import { getThreads, getMessages, getTemperature, getTypingSpeed, addMessageAndResponse, postThread, getThreadNameExists } from './api'
import { isOk, err, ok, getValue, getError } from './result'
import { highlightThread } from './helpers'
import { generatePalmMessage } from './palmApi'

// This file contains combinations of API endpoints called in sequence
// TODO: Increase abstraction level. Instead of if(err) return, do some kind of chain operation?
// --- Sequential API convienience functions

// Side-effects: Post user message, Get LLM response, Post LLM message
// Input/Output: ({ userId, chatHistory, threadId, userText }) => <Result> of { ok: { userMessage, LLMResponse } | '', error: string | '' }
export const dialogueWorkflow = async ({ userId, chatHistory, threadId, userText }) => {
	// 1. Get AI response
	const LLMResult = await generatePalmMessage({ contents: chatHistory })
	if (!isOk(LLMResult)) return err('Unable to get a valid LLM Response. Please try again.\n' + getError(LLMResult))
	const { parts, role } = getValue(LLMResult)?.candidates?.[0]?.content || { parts: [], role: '' } // {parts: [{...}], role: 'model'|'user'}
	if (!parts || !role) return err('The AI response is malformed. \n' + JSON.stringify(LLMResult))
	const AIText = parts[0].text

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
	const contents = [{ role: 'user', parts: [{ text }] }]
	const LLMResult = await generatePalmMessage({ contents })
	if (!isOk(LLMResult)) return err('Unable to get a valid LLM Title. Using Default.\n' + getError(LLMResult))
	const { parts, role } = getValue(LLMResult)?.candidates?.[0]?.content || { parts: [], role: '' } // {parts: [{...}], role: 'model'|'user'}
	if (!parts || !role) return err('The AI response is malformed. \n' + JSON.stringify(LLMResult))
	const AIText = parts[0].text

	// 2. Update Database with unique title
	const AIBaseText = AIText.slice(0, 50).trim()
	const threadExistsResult = await getThreadNameExists({ userID: userId, threadName: AIBaseText })
	if (!isOk(threadExistsResult)) return err('Could not verify if the thread existed already or not. New thread was not added.\n' + getError(threadExistsResult))
	const threadAlreadyExists = getValue(threadExistsResult)?.exists
	const titleResult = await postThread({ userID: userId, threadName: threadAlreadyExists ? AIBaseText + (new Date().toISOString()) : AIBaseText }) // the date string is used to guaranteee uniqueness
	if (!isOk(titleResult)) return err('Could not update thread title in the database.\n' + getError(titleResult))

	const { newThreadID } = getValue(titleResult) // { message , newThreadID: int }
	return ok({ LLMResponse: AIText, newThreadID })
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
	if (!isOk(threadsResult)) return err('Could not fetch threads when initializing.\n' + getError(threadsResult))
	const threads = highlightThread(getValue(threadsResult), threadIndex)
	const processedIndex = threadIndex > threads.length || threadIndex < 0 ? 0 : threadIndex
	const threadID = threads?.[processedIndex]?.ThreadID

	// 2. fetch messages for threadIndex'th thread's threadId ({ userID, threadID = okResponse?.[0]?.ThreadID })
	const messagesResult = await getMessages({ userID, threadID })
	if (!isOk(messagesResult)) return err('Could not fetch messages when initializing.\n' + getError(messagesResult))
	const messages = getValue(messagesResult)

	// 3. fetch temperature
	const temperatureResult = await getTemperature({ userID, threadID })
	if (!isOk(temperatureResult)) return err('Could not fetch temperature when initializing.\n' + getError(temperatureResult))
	const temperature = getValue(temperatureResult)[0]?.Temperature

	// 4. fetch typing speed
	const typingSpeedResult = await getTypingSpeed({ userID, threadID })
	if (!isOk(typingSpeedResult)) return err('Could not fetch typing speed when initializing.\n' + getError(typingSpeedResult))
	const typingSpeed = getValue(typingSpeedResult)[0]?.TypingSpeed

	// 5. return ok({ userId, threads, messages, temperature, typingSpeed }) if both are ok
	return ok({ userID, threads, messages, temperature, typingSpeed })
}

// TODO: See if you can stop repeating yourself in openThreadWorkflow, it is basically identical to initialize.
// Side-effects: fetch threads, fetch messages for thread with threadId 
// Input/Output: ({ userId, threadId }) => <Result> of { ok: { threads, messages, temperature, typingSpeed } | '' , error: string | ''} 
export const openThreadWorkflow = async ({ userId, threadid }) => {
	// 1. Get threads
	const threadsResult = await getThreads({ userID: userId })
	if (!isOk(threadsResult)) return err('Could not fetch threads when opening existing thread.\n' + getError(threadsResult))
	const threads = getValue(threadsResult)

	// 2. Get messages
	const messagesResult = await getMessages({ userID: userId, threadID: threadid })
	if (!isOk(messagesResult)) return err('Could not fetch messages when opening existing thread.\n' + getError(messagesResult))
	const messages = getValue(messagesResult)

	// 3. Get temperature
	const temperatureResult = await getTemperature({ userID: userId, threadID: threadid })
	if (!isOk(temperatureResult)) return err('Could not fetch temperature when opening existing thread.\n' + getError(temperatureResult))
	const temperature = getValue(temperatureResult)[0]?.Temperature

	// 4. Get typing speed
	const typingSpeedResult = await getTypingSpeed({ userID: userId, threadID: threadid })
	if (!isOk(typingSpeedResult)) return err('Could not fetch typing speed when initializing.\n' + getError(typingSpeedResult))
	const typingSpeed = getValue(typingSpeedResult)[0]?.TypingSpeed

	// 5. return result
	return ok({ threads, messages, temperature, typingSpeed })
}