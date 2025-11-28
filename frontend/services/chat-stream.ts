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

    try {
        await fetchEventSource(`${API_BASE_URL}/chat`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(request),
            signal: signal,

            async onopen(response) {
                if (response.ok) return; // Connection successful

                // Client-side errors (4xx) are fatal; do not retry
                if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                    throw new Error(`Client Error: ${response.status}`);
                }
            },

            onmessage(msg) {
                // Handle specific events from the backend
                if (msg.event === "done") {
                    onDone();
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
                            break;
                    }
                } catch (err) {
                    console.error("Parse error", err);
                }
            },

            onerror(err) {
                console.error("Stream error:", err);
                onError("Network connection lost.");
                throw err; // Re-throw to stop the library from retrying indefinitely on fatal errors
            },

            onclose() {
                onDone();
            }
        });
    } catch (err) {
        // Fallback error handler
        onError(err instanceof Error ? err.message : "Connection failed");
    }
}