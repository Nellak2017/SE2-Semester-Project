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
// Input/Output: ({ userID }) => <Result> of { ok: { threads, messages } | '' , error: string | ''} 
export const initializeWorkflow = async () => {
	// 1. fetch threads ({ userID, threadIndex = 0 })

	// -> const getThreads = async ({ userID }) => {
	//     const result = await tryCatchAsync(() => axios.get('/api/getThreads', { params: { userID } }), 'Error fetching threads: ')
	//     return result }
	// -> const result = await getThreads({userID})
	// -> okResponse => ok(highlightThread(okResponse, threadIndex))
	// -> errorResponse => err(errorResponse)

	// if no threads when fetching, early return err('No threads found when initializing')

	// 2. fetch messages for 0th thread's threadId ({ userID, threadID = okResponse?.[0]?.ThreadID })

	// -> const getMessages = async ({ userID, threadID }) => { // min = 0, max = step
	// 			const result = await tryCatchAsync(() => axios.get('/api/getMessages', { params: { userID, threadID } }), 'Error fetching messages: ')
	// 			return result}
	// -> const result = await getMessages({ userID, threadID })
	// -> okResponse => ok(okResponse.map(msg => ({ author: String(msg?.SentByUser), content: msg?.Text, messageId: msg?.MessageID })))
	// -> errorResponse => err(errorResponse)

	// 3. return ok({ threads, messages }) if both are ok, else return err(threadError + messageError)
}

// Side-effects: fetch threads, fetch messages for thread with threadId 
// Input/Output: ({ userId, threadId }) => <Result> of { ok: { threads, messages } | '' , error: string | ''} 
export const openThreadWorkflow = async () => {

}