import { getThreads, getMessages, getTemperature } from './api'
import { isOk, err, ok, handle } from './result'
import { highlightThread } from './helpers'

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

// Side-effects: get userID, fetch threads, fetch messages for 0th thread 
// Input/Output: ({ credentials, threadIndex }) => <Result> of { ok: { userId, threads, messages, temperature, typingSpeed } | '' , error: string | ''} 
export const initializeWorkflow = async ({ credentials, threadIndex = 0 }) => {
	// 0. get userId based on credentials
	// if no credentials return err('No credentials provided.')
	// TODO: get userId based on credentials
	const userID = 1
	if (userID <= 0) return err('No userId found for the given credentials.')

	// 1. fetch threads ({ userID })
	const threadsResult = await getThreads({ userID })
	if (!isOk(threadsResult)) return err('No threads found when initializing.')
	const threads = highlightThread(threadsResult.ok, threadIndex)
	const processedIndex = threadIndex > threads.length || threadIndex < 0 ? 0 : threadIndex
	const threadID = threads?.[processedIndex]?.ThreadID

	// 2. fetch messages for threadIndex'th thread's threadId ({ userID, threadID = okResponse?.[0]?.ThreadID })
	const messagesResult = await getMessages({ userID, threadID })
	if (!isOk(messagesResult)) return err('No messages found when initializing.')
	const messages = messagesResult.ok

	// 3. fetch temperature
	const temperatureResult = await getTemperature({ userID, threadID })
	if (!isOk(temperatureResult)) return err('Could not fetch temperature when initializing.')
	const temperature = temperatureResult.ok[0].Temperature

	// 4. fetch typing speed

	// 5. return ok({ userId, threads, messages, temperature, typingSpeed }) if both are ok
	return ok({ userID, threads, messages, temperature })
}

// Side-effects: fetch threads, fetch messages for thread with threadId 
// Input/Output: ({ userId, threadId }) => <Result> of { ok: { threads, messages } | '' , error: string | ''} 
export const openThreadWorkflow = async ({ userId, threadid }) => {
	// 1. Get threads
	const threadsResult = await getThreads({ userID: userId })
	if (!isOk(threadsResult)) return err('No threads found when opening existing thread.')
	const threads = threadsResult.ok

	// 2. Get messages
	const messagesResult = await getMessages({ userID: userId, threadID: threadid })
	if (!isOk(messagesResult)) return err('No messages found when opening existing thread.')
	const messages = messagesResult.ok

	// 3. Get temperature
	const temperatureResult = await getTemperature({ userID: userId, threadID: threadid })
	if (!isOk(temperatureResult)) return err('Could not fetch temperature when opening existing thread.')
	const temperature = temperatureResult.ok[0].Temperature

	// 3. return result
	return ok({ threads, messages, temperature })
}