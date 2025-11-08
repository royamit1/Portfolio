import {useRef, useCallback, useEffect} from "react";

const RENDER_SPEED = 2;
const RENDER_INTERVAL = 30;

interface UseTypewriterProps {
    onRender: (text: string) => void;
    onComplete: () => void;
}

export function useTypewriter({onRender, onComplete}: UseTypewriterProps) {
    const buffer = useRef("");
    const intervalId = useRef<NodeJS.Timeout | null>(null);
    const isStreamEnded = useRef(false);

    const stop = useCallback(() => {
        if (intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = null;
        }
    }, []);

    const start = useCallback(() => {
        stop();
        buffer.current = "";
        isStreamEnded.current = false;

        intervalId.current = setInterval(() => {
            if (buffer.current.length > 0) {
                const textToRender = buffer.current.slice(0, RENDER_SPEED);
                buffer.current = buffer.current.slice(RENDER_SPEED);
                onRender(textToRender); // Call the render callback
            } else if (isStreamEnded.current) {
                stop();
                onComplete();
            }
        }, RENDER_INTERVAL);
    }, [stop, onRender, onComplete]);

    const append = useCallback((text: string) => {
        buffer.current += text;
    }, []);

    const finish = useCallback(() => {
        isStreamEnded.current = true;
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => stop();
    }, [stop]);

    return {start, append, finish};
}
