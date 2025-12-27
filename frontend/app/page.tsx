import ChatPageClient from '@/features/chat/chat-page-client';

export default function Home() {
    return (
        // Use 100dvh (dynamic viewport height) to handle mobile browser address bars correctly
        <main className="h-[100dvh] w-full overflow-hidden">
            <ChatPageClient/>
        </main>
    );
}
