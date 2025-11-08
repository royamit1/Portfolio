'use client';

import {ChatProvider} from './context/chat-context';
import {ChatLayout} from './chat-layout';

export default function ChatPageClient() {
    return (
        <ChatProvider>
            <ChatLayout/>
        </ChatProvider>
    );
}
