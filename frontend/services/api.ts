// import axios from "axios";
//
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5173";
//
// export async function askBackend(question: string): Promise<string> {
//     try {
//         const res = await axios.post(`${API_URL}/ask`, { question });
//         return res.data?.answer ?? "Sorry, I couldn't get an answer.";
//     } catch (err) {
//         console.error("askBackend error", err);
//         return "Sorry, there was an error contacting the assistant.";
//     }
// }