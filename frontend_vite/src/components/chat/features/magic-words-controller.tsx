"use client"

import {useState, useEffect, useCallback} from "react"
import Confetti from 'react-confetti'
import {useWindowSize} from '@uidotdev/usehooks'
import {DigitalRain} from "@/components/chat/features/digital-rain.tsx"
import type {Message} from "@/lib/types.ts"

interface MagicWordsControllerProps {
    messages: Message[]
}

const POSITIVE_KEYWORDS = ["wow", "amazing", "cool", "awesome", "impressive", "love it"];
const SECRET_PHRASE = "show me the magic";

export function MagicWordsController({messages}: MagicWordsControllerProps) {
    const [showConfetti, setShowConfetti] = useState(false)
    const [showDigitalRain, setShowDigitalRain] = useState(false)
    const {width, height} = useWindowSize()

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'user') {
            const content = lastMessage.content.toLowerCase();

            // Confetti check
            if (POSITIVE_KEYWORDS.some(keyword => content.includes(keyword))) {
                setShowConfetti(true);
            }

            // Secret phrase check
            if (content.includes(SECRET_PHRASE)) {
                setShowDigitalRain(true);
            }
        }
    }, [messages]);

    const onConfettiComplete = useCallback(() => {
        setTimeout(() => {
            setShowConfetti(false)
        }, 3000);
    }, []);

    const onDigitalRainComplete = useCallback(() => {
        setShowDigitalRain(false);
    }, []);

    return (
        <>
            {showConfetti &&
                <Confetti
                    width={width!}
                    height={height!}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.15}
                    onConfettiComplete={onConfettiComplete}
                    colors={["#6366f1", "#8b5cf6", "#ec4899", "#22d3ee"]}
                />
            }
            {showDigitalRain && <DigitalRain onComplete={onDigitalRainComplete}/>}
        </>
    )
}
