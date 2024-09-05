// This file contains combinations of API endpoints called in sequence

// --- Sequential API convienience functions

// Side-effects: Post user message, Get LLM response, Post LLM message
// Input/Output: ({ userId, userInput, threadId }) => <Result> of { ok: { userMessage, LLMResponse } | '', error: string | '' }
export const dialogueWorkflow = async ({ userId, userInput, threadId }) => {

}

// Side-effects: Get LLM chat title based on user message, Post that chat title for thread name
// Input/Output: ({}) => <Result> of { ok: { LLMResponse } | '', error: string | ''} 
export const titleWorkflow = async () => {

}

// Side-effects: fetch threads, fetch messages for 0th thread 
// Input/Output: ({ userId }) => <Result> of { ok: { threads, messages } | '' , error: string | ''} 
export const initializeWorkflow = async () => {

}

// Side-effects: fetch threads, fetch messages for thread with threadId 
// Input/Output: ({ userId, threadId }) => <Result> of { ok: { threads, messages } | '' , error: string | ''} 
export const openThreadWorkflow = async () => {

}