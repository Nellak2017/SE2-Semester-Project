// This file contains combinations of API endpoints called in sequence
import { getThreads, getMessages, getTemperature, getTypingSpeed, addMessageAndResponse, postThread, getThreadNameExists } from './api'
import { isOk, err, ok, getValue, getError } from './result'
import { highlightThread } from './helpers'
import { generatePalmMessage } from './palmApi'

// --- Helpers
const fetchAIResponse = async ({ contents }) => {
	const LLMResult = await generatePalmMessage({ contents })
	if (!isOk(LLMResult)) return err('Unable to get a valid LLM response.\n' + getError(LLMResult))
	const { parts, role } = getValue(LLMResult)?.candidates?.[0]?.content || { parts: [], role: '' }
	if (!parts || !role) return err('The AI response is malformed.\n' + JSON.stringify(LLMResult))
	return ok(parts[0].text)
}

// Input/Output: ({ userId, threadID, threadIndex }) => <Result> of { ok: { userId, threads, messages, temperature, typingSpeed } | '', error: string | '' }
const fetchThreadData = async ({ userId, threadID, threadIndex = -1 }) => {
	const threadsResult = await getThreads({ userID: userId })
	if (!isOk(threadsResult)) return err('Could not fetch threads when opening existing thread.\n' + getError(threadsResult))
	const threads = highlightThread(getValue(threadsResult), threadIndex) // if threadIndex = -1 it doesn't highlight
	const processedIndex = threadIndex > threads.length || threadIndex < 0 ? 0 : threadIndex
	const processedThreadID = !threadID ? threads?.[processedIndex]?.ThreadID : threadID

	const messagesResult = await getMessages({ userID: userId, threadID: processedThreadID })
	if (!isOk(messagesResult)) return err('Could not fetch messages.\n' + getError(messagesResult))
	const messages = getValue(messagesResult)

	const temperatureResult = await getTemperature({ userID: userId, threadID: processedThreadID })
	if (!isOk(temperatureResult)) return err('Could not fetch temperature.\n' + getError(temperatureResult))
	const temperature = getValue(temperatureResult)[0]?.Temperature

	const typingSpeedResult = await getTypingSpeed({ userID: userId, threadID: processedThreadID })
	if (!isOk(typingSpeedResult)) return err('Could not fetch typing speed.\n' + getError(typingSpeedResult))
	const typingSpeed = getValue(typingSpeedResult)[0]?.TypingSpeed

	return ok({ userId, threads, messages, temperature, typingSpeed })
}

// TODO: Increase abstraction level. Instead of if(err) return, do some kind of chain operation?

// --- Sequential API convienience functions
// Side-effects: Post user message, Get LLM response, Post LLM message
// Input/Output: ({ userId, chatHistory, threadId, userText }) => <Result> of { ok: { userMessage, LLMResponse } | '', error: string | '' }
export const dialogueWorkflow = async ({ userId, chatHistory, threadId, userText }) => {
	// 1. Get AI response
	const LLMResult = await fetchAIResponse({ contents: chatHistory })
	if (!isOk(LLMResult)) return LLMResult
	const AIText = getValue(LLMResult)

	// 2. Update Database with user and AI messages
	const messagesResult = await addMessageAndResponse({ userID: userId, threadID: threadId, userText, AIText })
	if (!isOk(messagesResult)) return err('Failed to update the database with the user and LLM messages.\n' + getError(messagesResult))

	// 3. If all ok, then return ok({userMessage, LLMResponse})
	return ok({ userMessage: userText, LLMResponse: AIText })
}

// Side-effects: Get LLM chat title based on user message, Post that chat title for thread name
// Input/Output: ({ userInput }) => <Result> of { ok: { LLMResponse, newThreadID } | '', error: string | ''} 
export const titleWorkflow = async ({ userId, userInput }) => {
	// 1. Get AI Response for title
	const text = `Using this supplied user input create a LLM Chat title that is between 2 and 5 words long. Your response must only be those words.\n---User Input\n"${userInput}"`
	const LLMResult = await fetchAIResponse({ contents: [{ role: 'user', parts: [{ text }] }] })
	if (!isOk(LLMResult)) return LLMResult

	// 2. Update Database with unique title
	const AIBaseText = getValue(LLMResult).slice(0, 50).trim()
	const threadExistsResult = await getThreadNameExists({ userID: userId, threadName: AIBaseText })
	if (!isOk(threadExistsResult)) return err('Could not verify if the thread existed already or not. New thread was not added.\n' + getError(threadExistsResult))
	const threadAlreadyExists = getValue(threadExistsResult)?.exists
	const titleResult = await postThread({ userID: userId, threadName: threadAlreadyExists ? AIBaseText + (new Date().toISOString()) : AIBaseText }) // the date string is used to guaranteee uniqueness
	if (!isOk(titleResult)) return err('Could not update thread title in the database.\n' + getError(titleResult))

	const { newThreadID } = getValue(titleResult) // { message , newThreadID: int }
	return ok({ LLMResponse: AIBaseText, newThreadID })
}

// Side-effects: get userID, fetch threads, fetch messages for 0th thread 
// Input/Output: ({ credentials, threadIndex }) => <Result> of { ok: { userId, threads, messages, temperature, typingSpeed } | '' , error: string | ''} 
export const initializeWorkflow = async ({ credentials, threadIndex = 0 }) => {
	// get userId based on credentials, if no credentials return err('No credentials provided.')
	const userId = 1 // TODO: get userId based on credentials
	if (userId <= 0) return err('No userId found for the given credentials.')
	return fetchThreadData({ userId, threadID: undefined, threadIndex })
}

// Side-effects: fetch threads, fetch messages for thread with threadId 
// Input/Output: ({ userId, threadId }) => <Result> of { ok: { threads, messages, temperature, typingSpeed } | '' , error: string | ''} 
export const openThreadWorkflow = async ({ userId, threadid }) => fetchThreadData({ userId, threadID: threadid })