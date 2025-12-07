import {useState, useEffect, useCallback, useRef} from "react";
import type {Message, ToolLog} from "@/lib/types";
import {getSessionId} from "@/services/api";
import {streamChatService} from "@/services/chat-stream";

// --- Mock Answer for Testing ---
const MOCK_ANSWER = `Of course. Here is a detailed breakdown of the project, including its architecture, challenges, and outcomes.

### Project Overview
This project was a full-stack web application designed to solve a critical business need in the logistics sector. The primary goal was to create a real-time tracking and management platform for a fleet of vehicles.

### Core Technologies
- **Frontend**: Built with Next.js and TypeScript for a robust, type-safe, and performant user interface.
- **Styling**: Tailwind CSS was used for utility-first styling, allowing for rapid development and easy maintenance.
- **State Management**: Zustand was chosen for its simplicity and minimal boilerplate.
- **Backend**: A Node.js server running Express provided the RESTful API endpoints.
- **Database**: PostgreSQL was used for relational data, while Redis handled caching and session management.

### Key Architectural Decisions
1.  **Microservices Approach**: The backend was split into three distinct services: Authentication, Geolocation, and Notifications. This separation of concerns allowed for independent scaling and development.
2.  **Real-time Communication**: WebSockets were implemented using Socket.IO to provide real-time location updates to the frontend without needing to poll the server continuously.
3.  **Database Optimization**: We heavily utilized PostGIS extensions in PostgreSQL for efficient geospatial queries, which was critical for features like "find nearest vehicle."

### Challenges and Solutions
- **Scalability**: The initial monolith struggled under load. Migrating to microservices was a significant undertaking but ultimately solved our scaling bottlenecks.
- **UI Performance**: Rendering thousands of data points on a map was slow. We implemented client-side clustering (using Leaflet's marker clustering plugin) to group nearby points into a single marker, drastically improving render times.
- **Data Consistency**: Ensuring data was consistent across multiple services was a challenge. We implemented an event-driven architecture using RabbitMQ. When a critical event occurred (e.g., a delivery was completed), a message was published, and all interested services could subscribe and react to it.

This approach allowed us to build a resilient, scalable, and feature-rich platform that met all the client's requirements.
`;

// --- Stream Simulation Function ---
const simulateStream = (
    aiMessageId: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    onDone: () => void
) => {
    const chunks = MOCK_ANSWER.split(" ");
    let i = 0;
    const interval = setInterval(() => {
        if (i < chunks.length) {
            const token = chunks[i] + " ";
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === aiMessageId
                        ? {...msg, content: msg.content + token}
                        : msg
                )
            );
            i++;
        } else {
            clearInterval(interval);
            onDone();
        }
    }, 50); // 50ms delay between chunks to simulate streaming
};


export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentToolLog, setCurrentToolLog] = useState<ToolLog | null>(null);
    const [sessionId, setSessionId] = useState("");
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        setSessionId(getSessionId());
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return;

        abortControllerRef.current?.abort();
        const newAbortController = new AbortController();
        abortControllerRef.current = newAbortController;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: new Date(),
        };

        const aiMessagePlaceholder: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "",
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage, aiMessagePlaceholder]);
        setIsLoading(true);
        setCurrentToolLog(null); // Reset tool log

        // --- MOCK RESPONSE LOGIC ---
        if (content.trim() === "/mock") {
            simulateStream(aiMessagePlaceholder.id, setMessages, () => {
                setIsLoading(false);
            });
            return; // Stop here and don't call the real service
        }
        // --- END MOCK RESPONSE LOGIC ---

        await streamChatService(
            {message: content, session_id: sessionId},
            {
                onToken: (token) => {
                    setCurrentToolLog(null);
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === aiMessagePlaceholder.id
                                ? {...msg, content: msg.content + token}
                                : msg
                        )
                    );
                },
                onToolStart: (tool, message) => {
                    setCurrentToolLog({tool, message, status: 'loading'});
                },
                onToolEnd: (tool, message) => {
                    setCurrentToolLog({tool, message, status: 'success'});
                },
                onError: (errorMessage) => {
                    setCurrentToolLog({tool: 'error', message: errorMessage, status: 'error'});
                    setIsLoading(false);
                },
                onDone: () => {
                    setCurrentToolLog(null);
                    setIsLoading(false);
                    if (abortControllerRef.current === newAbortController) {
                        abortControllerRef.current = null;
                    }
                }
            },
            newAbortController.signal
        );

    }, [sessionId, isLoading]);

    const setMessagesAndClearLogs = (msgs: Message[]) => {
        setMessages(msgs);
        setCurrentToolLog(null);
    }

    return {messages, isLoading, currentToolLog, sendMessage, setMessages: setMessagesAndClearLogs, setCurrentToolLog};
}
