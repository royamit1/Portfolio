import {API_BASE_URL} from "@/services/api";
import {fetchEventSource} from "@microsoft/fetch-event-source";

export interface StreamCallbacks {
    onToken: (content: string) => void;
    onToolStart: (tool: string, message: string) => void;
    onToolEnd: (tool: string, message: string) => void;
    onError: (message: string) => void;
    onDone: () => void;
}

export async function streamChatService(
    request: { message: string; session_id: string },
    callbacks: StreamCallbacks,
    signal?: AbortSignal
): Promise<void> {
    const {onToken, onToolStart, onToolEnd, onError, onDone} = callbacks;
    let retryCount = 0;
    const MAX_RETRIES = 2;

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

            async onopen(response) {
                // If we get a 200 OK, reset retries
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
                            ctrl.abort();
                            break;
                    }
                } catch (err) {
                    console.error("Parse error", err);
                }
            },

            onerror(err) {
                // 1. Handle User Abort (The Fix)
                if (err instanceof DOMException && err.name === 'AbortError') {
                    // Do nothing, silence the error
                    return;
                }

                // 2. Handle Retry Logic (Render Cold Start)
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

                // Retry after 3 seconds
                return 3000;
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
        onError(err instanceof Error ? err.message : "Connection failed");
    }
}