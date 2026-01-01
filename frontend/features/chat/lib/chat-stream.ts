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
    signal?: AbortSignal
): Promise<void> {
    const {onToken, onToolStart, onToolEnd, onError, onDone} = callbacks;
    let retryCount = 0;
    let hasReceivedTokens = false; // Track if we've started receiving text

    // Create a controller to bridge the user signal to the fetch signal
    const ctrl = new AbortController();

    if (signal) {
        signal.addEventListener('abort', () => ctrl.abort());
    }

    try {
        await fetchEventSource(`${API_BASE_URL}/chat`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(request),
            signal: signal,
            openWhenHidden: true, // <--- CRITICAL FIX: Prevents browser from killing connection on tab switch

            async onopen(response) {
                // If we get a 200 OK, we reset retries.
                // However, we rely on hasReceivedTokens to prevent bad retries.
                if (response.ok) {
                    retryCount = 0;
                    return;
                }

                // If it's a 4xx error (Client Error), do not retry. Throw fatal.
                if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                    throw new Error(`Request failed: ${response.status}`);
                }

                // If 5xx (Server Error), throwing allows retrying via onerror below
                throw new Error(`Server error: ${response.status}`);
            },

            onmessage(msg) {
                // Handle specific events from the backend
                if (msg.event === "done") {
                    onDone();
                    // Close connection explicitly
                    ctrl.abort();
                    return;
                }

                try {
                    const data = JSON.parse(msg.data);

                    switch (msg.event) {
                        case "token":
                            hasReceivedTokens = true; // Mark that we are receiving data
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
                    console.error("Parse error", err);
                }
            },

            onerror(err) {
                // 1. Handle User Abort
                if (err instanceof DOMException && err.name === 'AbortError') {
                    throw err; // Stop retrying
                }

                // 2. Prevent Duplication on Tab Switch
                // If we have already received tokens, do NOT retry.
                // This prevents the "Hello... Hello..." loop.
                if (hasReceivedTokens) {
                    console.log("Stream interrupted after receiving data. Stopping to prevent duplication.");
                    throw err; // Stop retrying
                }

                // 3. Handle Retry Logic (Render Cold Start)
                console.error("Stream error:", err);

                if (retryCount >= MAX_RETRIES) {
                    // Give up after max retries
                    onError("Connection failed. The server might be busy, please try again.");
                    throw err; // Stops the library from retrying further
                }

                retryCount++;

                // Show a "Reconnecting" status in the UI
                if (retryCount === 1) {
                    onToolStart("system", "Waking up server (this may take a moment)...");
                }

                // Retry after delay
                return RETRY_DELAY_MS;
            },

            onclose() {
                onDone();
            }
        });
    } catch (err) {
        // Fallback error handler
        if (err instanceof DOMException && err.name === 'AbortError') {
            return;
        }

        // If we already received tokens, we don't want to show a "Connection Failed" error
        // because the user likely sees a partial response. We just finish silently.
        if (hasReceivedTokens) {
            onDone();
            return;
        }

        onError(err instanceof Error ? err.message : "Connection failed");
    }
}
