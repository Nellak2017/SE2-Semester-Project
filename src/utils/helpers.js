// Contains many pure functions used through out the application
import { toast } from 'react-toastify'
import {
	getThreads,
	getMessages,
	addMessage,
	postThread,
	patchTemperature,
	patchTypingSpeed,
	deleteThread
} from '../utils/api.js'


// ---------------------------------------------------------------
// --- General Helpers

// Function to highlight a specific thread at an index. If index is negative, it makes everything false
export function highlightThread(threadList, index = 0) {
	if (!threadList || index > threadList.length) return []
	if (index < 0) return threadList.map(e => ({ ...e, highlighted: false }))
	return threadList.map((e, i) => {
		return i === index ?
			{ ...e, highlighted: true } :
			{ ...e, highlighted: false }
	})
}

// Function to tell the index of the currently highlighted
export function indexOfCurrentlyHighlighted(threadList) { return threadList?.findIndex(el => el.highlighted === true) }

// Function to update an Object in a list given the index, property name, and property value
export function updateObjInList(objList, index, propertyName, propertyValue) {
	if (index < 0 || index === undefined || isNaN(index) || index > objList.length) return objList
	const updatedList = [...objList]
	updatedList[index] = { ...updatedList[index], [propertyName]: propertyValue }
	return updatedList
}

const top50EnglishWords = [
	'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
	'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
	'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
	'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so',
	'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me'
]

export function generateRandomSentence({ words = top50EnglishWords, min = 2, max = 5 }) {
	const sentenceLength = Math.floor(Math.random() * (max - min)) + min // Random length between 2 and 5 words
	const randomWords = Array.from(
		{ length: sentenceLength },
		() => { return words[Math.floor(Math.random() * words.length)] }
	)
	const sentence = randomWords.join(' ')

	// Capitalize the first letter and add a period at the end
	return sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + '.'
}

// Generalized listener assignment
export function assignListeners({ userID, threads, setter, callback }) {
	// Set the List of listener functions for each Link
	setter(threads.map((thread, idx) => { return () => callback(userID, thread, idx)}))
}

// ---------------------------------------------------------------
// --- API Helpers (API request and SET state using return values)

// Generalized API helper
export async function requestAndUpdate({ args, transformer = res => res, operation, setter, type, errorMessage = "Error fetching and updating" }) {
	try {
		const response = await operation(...args)
		const processed = transformer(response)
		setter(processed)
		return processed
	} catch (e) {
		console.error(`${errorMessage} ${type}: `, e)
		toast.error(`${errorMessage} ${type}, see dev console for more details.`)
	}
}

// Generalized Operation then Fetch/Update
export async function operationAndUpdate({ operationArgs, fetchArgs, operation, fetch, type = 'message', errorMessage = 'Error adding', setter = (_) => { } }) {
	const response = await requestAndUpdate({
		args: [...operationArgs],
		operation,
		setter,
		type,
		errorMessage
	})
	const updated = await fetch(...fetchArgs)
	return [response, updated]
}

// ---------------------------------------------------------------
// --- Wrappers (To make calling the generalized functions more convienient)

export async function fetchAndUpdateThreads(userID, setter, highlightIndex = 0, getter = getThreads) {
	const processed = await requestAndUpdate({
		args: [userID],
		transformer: response => {
			return highlightThread(response, highlightIndex)
		},
		operation: getter,
		setter,
		type: 'threads'
	})
	return processed
}

export async function fetchAndUpdateMessages(userID, threadID, setter, getter = getMessages) {
	const processed = await requestAndUpdate({
		args: [userID, threadID],
		transformer: messages => messages?.map(msg => ({
			user: msg?.SentByUser,
			text: msg?.Text,
			messageId: msg?.MessageID,
		})),
		operation: getter,
		setter,
		type: 'messages'
	})
	return processed
}

export async function postMessagesWrapper(text, userID, threadID, sentByUser, setter) {

	const response = await operationAndUpdate({
		operationArgs: [text, userID, threadID, sentByUser],
		fetchArgs: [userID, threadID, setter, getMessages],
		operation: addMessage,
		fetch: fetchAndUpdateMessages,
		type: 'message',
		errorMessage: 'Error Adding',
	})
	return response
}

export async function postThreadWrapper(threadName, userID, highlightIndex, setter) {

	const response = await operationAndUpdate({
		operationArgs: [userID, threadName],
		fetchArgs: [userID, setter, highlightIndex, getThreads],
		operation: postThread,
		fetch: fetchAndUpdateThreads,
		type: 'thread',
		errorMessage: 'Error Adding',
	})

	return response
}

export async function temperatureWrapper(userID, threadID, newTemperature, threadIndex, setter) {

	const response = await operationAndUpdate({
		operationArgs: [userID, threadID, newTemperature],
		fetchArgs: [userID, setter, threadIndex, getThreads],
		operation: patchTemperature,
		fetch: fetchAndUpdateThreads,
		type: 'temperature',
		errorMessage: 'Error updating',
	})

	return response
}

export async function typingSpeedWrapper(userID, threadID, newTypingSpeed, threadIndex, setter) {
	
	const response = await operationAndUpdate({
		operationArgs: [userID, threadID, newTypingSpeed],
		fetchArgs: [userID, setter, threadIndex, getThreads],
		operation: patchTypingSpeed,
		fetch: fetchAndUpdateThreads,
		type: 'typing speed',
		errorMessage: 'Error updating',
	})

	return response
}

export async function deleteWrapper(userID, threadID, setter) {

	const response = await operationAndUpdate({
		operationArgs: [userID, threadID],
		fetchArgs: [userID, setter, 0, getThreads],
		operation: deleteThread,
		fetch: fetchAndUpdateThreads,
		type: 'thread',
		errorMessage: 'Error deleting',
	})

	return response
}