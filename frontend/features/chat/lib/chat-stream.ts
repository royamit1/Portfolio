import {API_BASE_URL} from "@/services/api";
import {fetchEventSource} from "@microsoft/fetch-event-source";

export interface StreamCallbacks {
    onToken: (content: string) => void;
    onToolStart: (tool: string, message: string) => void;
    onToolEnd: (tool: string, message: string) => void;
    onError: (message: string) => void;
    onDone: () => void;
}

const RETRY_DELAY_MS = 3000;
const MAX_RETRIES = 2;

export async function streamChatService(
    request: { message: string; session_id: string },
    callbacks: StreamCallbacks,
    parentSignal?: AbortSignal
): Promise<void> {
    const {onToken, onToolStart, onToolEnd, onError, onDone} = callbacks;
    let retryCount = 0;
    let hasReceivedTokens = false;

    // We need an internal controller to manually kill the stream when we receive the 'done' event,
    // while still respecting the parent component's abort signal (e.g., user clicks stop).
    const ctrl = new AbortController();

    if (parentSignal) {
        parentSignal.addEventListener('abort', () => ctrl.abort());
    }

    try {
        await fetchEventSource(`${API_BASE_URL}/chat`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(request),
            signal: ctrl.signal,

            // Critical: Keeps connection alive when user switches browser tabs
            openWhenHidden: true,

            async onopen(response) {
                if (response.ok) {
                    retryCount = 0;
                    return;
                }

                // 4xx errors are fatal (client error), do not retry
                if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                    throw new Error(`Request failed: ${response.status}`);
                }

                // 5xx errors might be temporary, throwing here triggers onerror retry logic
                throw new Error(`Server error: ${response.status}`);
            },

            onmessage(msg) {
                if (msg.event === "done") {
                    onDone();
                    ctrl.abort(); // Manually stop the stream to prevent reconnection
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
                // If user aborted manually, stop everything
                if (err instanceof DOMException && err.name === 'AbortError') {
                    throw err;
                }

                // DATA INTEGRITY GUARD:
                // If we have already received partial text, we CANNOT retry.
                // Retrying now would cause the AI to restart its sentence, duplicating text.
                if (hasReceivedTokens) {
                    throw err;
                }

                // Retry logic for cold starts (5xx errors or network blips before data started)
                if (retryCount >= MAX_RETRIES) {
                    onError("Connection failed. The server might be busy, please try again.");
                    throw err;
                }

                retryCount++;

                // If this is a retry, inform the UI (likely a cold start on Render/Heroku)
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
        // Handle logic for when the stream dies completely
        if (err instanceof DOMException && err.name === 'AbortError') {
            return;
        }

        // If we received data before crashing, fail silently (user sees partial response)
        // otherwise, show the error.
        if (!hasReceivedTokens) {
            onError(err instanceof Error ? err.message : "Connection failed");
        } else {
            onDone();
        }
    }
}