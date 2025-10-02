// hooks/useTypewriter.ts
import { useEffect, useState } from "react";

export default function useTypewriter(
    text: string,
    speed: number = 50,
    delay: number = 0
) {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayed((prev) => prev + text[i]);
                i++;
                if (i >= text.length) clearInterval(interval);
            }, speed);
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, speed, delay]);

    return displayed;
}
