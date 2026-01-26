# Building an AI-Powered Portfolio: A Developer's Journey

#nextjs #python #ai #langchain

---

## Introduction

Traditional portfolios have a fundamental problem: they assume visitors will actually read them. We craft paragraphs about our experience, build grids of project cards, and hope that recruiters or potential collaborators will take the time to scroll through everything we've written. Most don't.

This project started with a different premise. What if a portfolio could actively engage with visitors? Instead of presenting information and hoping it gets consumed, what if it could have a conversation?

This article documents the journey of building an AI-powered portfolio from scratch—the architectural decisions, the technical challenges, and the lessons learned along the way.

---

## Defining the Experience Before the Technology

One principle guided the early development: design the experience first, then figure out how to build it.

Before writing any backend code, the entire user interface was built. A chat window as the central element. A sidebar for structured navigation. A greeting banner with quick-action buttons for common questions. A command palette for keyboard-oriented users. Even the streaming text effect that would later show AI responses being generated in real-time.

This approach served two purposes. First, it forced clarity about what the product should feel like before getting lost in implementation details. Second, it created concrete requirements for the AI system. The interface specified what the backend needed to deliver.

The decision to commit entirely to dark mode came from a focus on consistency. Maintaining two color schemes requires double the design effort for every new component. The dark aesthetic also aligned better with the developer-focused positioning of the portfolio.

---

## The Challenge of Grounded Responses

The first backend implementation was straightforward: FastAPI as the server framework, LangChain for AI orchestration, and OpenAI's GPT as the language model. Within a single development session, there was a working chatbot with a defined persona.

The problem emerged immediately. The chatbot could hold a conversation, but it didn't know anything factual about the portfolio owner. When asked about specific projects, it would generate plausible-sounding but fictional descriptions. When asked about technical skills, it would list generic developer competencies rather than actual expertise.

This is a common pitfall with language models. They're excellent at generating fluent text but have no mechanism for distinguishing between what they've been trained on and what the developer wants them to know.

The solution was Retrieval-Augmented Generation, commonly called RAG. Instead of relying on the model's training data, this approach provides relevant context with each question. The implementation involved several components: documents containing actual portfolio information (resume, project descriptions, skills, bio), a process to convert these documents into searchable embeddings, a vector database to store and query these embeddings, and a modified prompt structure that includes retrieved context before asking for a response.

The initial vector store was FAISS, a library that handles similarity search efficiently. For a prototype, it worked well. The chatbot could now answer questions about real projects, cite actual technologies used, and provide accurate information about experience and education.

---

## Reconsidering the Frontend Framework

The frontend began as a Vite and React application. Vite's fast hot module replacement made development pleasant, and the React ecosystem provided all necessary UI components.

As the project matured, several limitations became apparent. Search engine optimization required manual implementation of meta tags and careful attention to server-side rendering—which Vite doesn't provide natively. Image optimization needed external tooling. The Open Graph images for social sharing were particularly problematic, requiring workarounds that felt fragile.

Next.js offered built-in solutions for each of these problems. Its App Router architecture provided clear patterns for organizing code. Server Components could handle data fetching without sending unnecessary JavaScript to the client. The Image component automated optimization. The metadata API made SEO straightforward.

The migration required restructuring the entire application. Component paths changed, the boundary between server and client code needed explicit definition, and responsive layouts that worked in the previous setup broke in ways that required investigation. The transition happened across three separate development branches over multiple days.

The investment was worthwhile. The codebase became more organized, and problems that previously required workarounds became trivial.

---

## Building a Real-Time Experience

A critical insight about chat interfaces is that perceived speed matters as much as actual speed. Users waiting for a complete response experience that wait as delay. Users watching text appear progressively experience the same duration as responsiveness.

Implementing streaming introduced significant complexity. The backend needed to generate responses as Server-Sent Events, sending partial content as it became available. The frontend needed to receive these events, accumulate the partial content, and render it progressively—all while handling edge cases like dropped connections, race conditions between messages, and proper scroll behavior.

The initial implementation had numerous bugs. Messages would sometimes disappear mid-stream when React re-renders occurred. Loading indicators would persist incorrectly. Multiple messages arriving in quick succession would cause rendering anomalies.

Resolving these issues required rethinking the state management approach. A centralized React Context replaced the previous pattern of passing state through component props. A dedicated hook encapsulated the typewriter rendering logic. The streaming handler was rebuilt to properly manage partial messages and their accumulation.

---

## Evolving from Retrieval to Agency

The RAG implementation could answer questions, but it couldn't take actions. When visitors asked for a resume, the system could describe its contents but couldn't actually provide it.

The next architectural evolution transformed the chatbot into an agent with tools. Rather than a single pipeline that always performed retrieval and generation, the system gained a decision-making layer. The AI evaluates each request and selects the appropriate tool: searching the knowledge base for informational questions, or triggering the email system for resume requests.

This changed the interaction model significantly. A visitor could now request a resume, provide their email address, and actually receive the document. The AI wasn't simulating an action—it was performing one.

Getting the tool selection to work reliably required extensive prompt engineering. Early versions would invoke tools incorrectly, attempt searches for topics outside the knowledge base, or lose context across multiple messages in a conversation. Each failure mode required analysis to understand why the model made that decision, then prompt refinements to guide better choices.

The critical improvements came from being explicit about decision criteria. Rather than hoping the model would infer when to use each tool, the system prompt provides clear conditions and examples for each scenario.

---

## Addressing Security and Cost Constraints

Traditional web applications have predictable costs. Servers run whether they receive one request or one thousand. AI applications are different—each request carries a direct cost for model inference.

This creates a vulnerability that standard development practices don't address. Without proper safeguards, a malicious script could generate thousands of requests and produce substantial API bills. Even without malicious intent, bugs in client code could create request loops that drain budgets quickly.

The solution involved multiple defensive layers. Rate limiting capped requests per session at sustainable levels. Input validation rejected requests that appeared designed to consume excessive tokens. Token counting before API calls enforced cost guardrails. These measures feel paranoid until you consider the consequences of not having them.

---

## Production Database Architecture

The FAISS vector store served well for development but had significant limitations for production. As an in-memory store, it couldn't persist across server restarts. In serverless deployment environments, it couldn't be shared across function instances. Every cold start required regenerating embeddings—a process that consumed both time and API credits.

PostgreSQL with the pgvector extension provided a production-ready alternative. Since the project already used PostgreSQL (hosted on Neon) for other persistence needs, adding vector search capability to the same database reduced infrastructure complexity. Embeddings became persistent and shared across all instances.

Chat history presented a separate persistence challenge. Conversations needed to survive page refreshes and browser sessions. Visitors returning the next day should see their previous interactions. Redis, hosted on Upstash in a serverless configuration, provided the solution. The ephemeral nature of chat history aligned well with Redis's strengths: fast reads and writes, automatic expiration for old conversations, and minimal cost when idle.

Docker Compose brought these services together for local development. A single command starts PostgreSQL and Redis with identical configuration to production. This eliminated the category of bugs that arise from development-production environment mismatches.

---

## Crafting the First-Person Voice

An unexpected challenge emerged in how the AI referred to its owner. Despite instructions to represent the portfolio owner directly, the model persistently used third-person constructions: "Roy Amit is a developer who specializes in..." rather than "I'm a developer who specializes in..."

This might seem like a minor stylistic issue, but it fundamentally affected the user experience. A portfolio AI that speaks about its owner feels like a biographical assistant. One that speaks as the owner feels like a digital twin—a more personal and engaging interaction.

The fix required explicit examples in the system prompt demonstrating the expected voice. Rather than abstract instructions to "speak in first person," the prompt now includes concrete examples of correct and incorrect responses for common question types. Edge cases like "Are you a real person?" received specific handling to maintain the persona without being misleading.

---

## The Final Layer: Visual Identity and Social Presence

The last development phase focused on details that elevate a project to a product.

Rich templates replaced plain text for common interactions. When visitors ask for an introduction, they receive a formatted card with a professional illustration, structured sections, and smoothly streaming text—not a plain paragraph.

A branded splash screen provides a polished first impression. The portfolio's logo animates into view as the application loads, setting a professional tone before any interaction begins.

Open Graph images ensure the portfolio makes a good impression when shared on social platforms. This seemingly simple requirement exposed an interesting edge case: Vercel generates unique URLs for preview deployments, and these URLs are protected by authentication. Social media crawlers couldn't access the preview images, resulting in broken cards on LinkedIn and Twitter. The solution involved configuring the application to always reference the production domain for social images, regardless of the deployment context.

---

## Reflections on the Process

Several insights emerged from this development journey.

Prompt engineering has more in common with traditional engineering than its name might suggest. It requires systematic debugging, careful attention to edge cases, and iterative refinement based on observed behavior. Small changes in phrasing produce significant changes in output.

Streaming fundamentally transforms perceived performance. The same computational delay feels responsive when visible as progressive output and frustrating when hidden behind a loading indicator.

AI applications require security considerations beyond traditional web development. Cost-per-request changes the threat model, making rate limiting and input validation essential rather than optional.

Building the user experience before the AI implementation created clarity that persisted throughout the project. Every technical decision could be evaluated against a concrete vision of what the product should feel like.

---

## Conclusion

The finished portfolio demonstrates an alternative to static presentation. Visitors can ask questions, explore projects through conversation, and receive documents directly. The AI provides accurate information because it retrieves from curated sources rather than generating from training data. It speaks with a consistent voice because that voice was deliberately crafted.

Whether this approach suits every developer portfolio is debatable. For technical roles that value innovation and AI familiarity, the format itself communicates something about capabilities.

The complete implementation is available at [royamit.vercel.app](https://royamit.vercel.app), with source code on [GitHub](https://github.com/royamit1/Portfolio).

---

*Roy Amit is a full-stack developer focused on building applications that feel intelligent without sacrificing reliability.*
