import { API_BASE_URL } from "@/services/api";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getSessionId } from "@/lib/session";

interface StreamCallbacks {
    onToken: (content: string) => void;
    onToolStart: (tool: string, message: string) => void;
    onToolEnd: (tool: string, message: string) => void;
    onError: (message: string, isRateLimit?: boolean) => void;
    onDone: () => void;
}

const RETRY_DELAY_MS = 3000;
const MAX_RETRIES = 2;

export async function streamChatService(
    request: { message: string; session_id: string },
    callbacks: StreamCallbacks,
    parentSignal?: AbortSignal
): Promise<void> {
    const { onToken, onToolStart, onToolEnd, onError, onDone } = callbacks;
    let retryCount = 0;
    let hasReceivedTokens = false;

    // Internal controller to close stream on 'done', while respecting parent abort signal
    const ctrl = new AbortController();

    if (parentSignal) {
        parentSignal.addEventListener('abort', () => ctrl.abort());
    }

    try {
        await fetchEventSource(`${API_BASE_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Session-ID": getSessionId(),
            },
            body: JSON.stringify(request),
            signal: ctrl.signal,

            openWhenHidden: true, // Keep connection alive when tab is hidden

            async onopen(response) {
                if (response.ok) {
                    retryCount = 0;
                    return;
                }

                if (response.status === 429) {
                    onError("You're sending messages too quickly. Please wait a moment before trying again. ⏱️", true);
                    throw new Error("Rate limit exceeded");
                }

                // 4xx: client error (fatal)
                if (response.status >= 400 && response.status < 500) {
                    throw new Error(`Request failed: ${response.status}`);
                }

                // 5xx: server error (may be temporary)
                throw new Error(`Server error: ${response.status}`);
            },

            onmessage(msg) {
                if (msg.event === "done") {
                    onDone();
                    ctrl.abort();
                    return;
                }

                try {
                    const data = JSON.parse(msg.data);

                    switch (msg.event) {
                        case "token":
                            hasReceivedTokens = true;
                            if (data.content) onToken(data.content);
                            break;

                        case "tool_start":
                            onToolStart(data.tool, data.message);
                            break;

                        case "tool_end":
                            onToolEnd(data.tool, data.message);
                            break;

                        case "error":
                            onError(data.message);
                            onDone();
                            ctrl.abort();
                            break;
                    }
                } catch (err) {
                    console.error("Stream parse error", err);
                }
            },

            onerror(err) {
                if (err instanceof DOMException && err.name === 'AbortError') {
                    throw err;
                }

                // Don't retry if we've already received tokens (would duplicate text)
                if (hasReceivedTokens) {
                    throw err;
                }

                // Retry for cold starts before data arrived
                if (retryCount >= MAX_RETRIES) {
                    onError("Connection failed. The server might be busy, please try again.");
                    throw err;
                }

                retryCount++;

                if (retryCount === 1) {
                    onToolStart("system", "Waking up server (this may take a moment)...");
                }

                return RETRY_DELAY_MS;
            },

            onclose() {
                onDone();
            }
        });
    } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
            return;
        }

        // Show error only if no data was received
        if (!hasReceivedTokens) {
            onError(err instanceof Error ? err.message : "Connection failed");
        } else {
            onDone();
        }
    }
}