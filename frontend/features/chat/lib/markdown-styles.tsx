import type { Components } from "react-markdown";

export const markdownComponents: Components = {
    p: ({ node, ...props }) => (
        <p {...props} className="mb-5 leading-7 text-zinc-200 block last:mb-0" />
    ),
    strong: ({ node, ...props }) => (
        <strong {...props} className="font-bold text-white" />
    ),
    ul: ({ node, ...props }) => (
        <ul {...props} className="list-disc list-outside ml-5 mb-4 space-y-2 marker:text-zinc-400" />
    ),
    ol: ({ node, ...props }) => (
        <ol {...props} className="list-decimal pl-6 mb-5 space-y-2 marker:text-zinc-200" />
    ),
    li: ({ node, ...props }) => (
        <li {...props} className="pl-1 text-zinc-200" />
    ),
    a: ({ node, ...props }) => (
        <a {...props}
            className="text-indigo-400 hover:text-indigo-300 hover:underline decoration-indigo-400/30 font-medium transition-colors"
            target="_blank" rel="noopener noreferrer" />
    ),
    h3: ({ node, ...props }) => (
        <h3 {...props} className="text-lg font-bold text-white mt-5 mb-2 tracking-tight" />
    ),
};
