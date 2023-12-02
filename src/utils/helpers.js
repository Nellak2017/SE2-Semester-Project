// Contains many pure functions used through out the application
import { toast } from 'react-toastify'

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

// Generalized listener assignment (UNTESTED)
export function assignListeners({ userID, threads, setter, callback }) {
	// Set the List of listener functions for each Link
	setter(threads.map((thread, idx) => {
		return () => callback(userID, thread, idx)
	}))
}

// ---------------------------------------------------------------
// --- API Helpers (API request and SET state using return values)

// Generalized API helper
export async function requestAndUpdate({ args, transformer = res => res, getter, setter, type, errorMessage = "Error fetching and updating" }) {
	try {
		const response = await getter(...args)
		const processed = transformer(response)
		setter(processed)
		return processed
	} catch (e) {
		console.error(`${errorMessage} ${type}: `, e)
		toast.error(`${errorMessage} ${type}, see dev console for more details.`)
	}
}

// ---------------------------------------------------------------
// --- Wrappers (To make calling the generalized functions more convienient)

export async function fetchAndUpdateThreads(userID, getter, setter, highlightIndex = 0) {
	const processed = await requestAndUpdate({
		args: [userID],
		transformer: response => {
			return highlightThread(response, highlightIndex)
		},
		getter,
		setter,
		type: 'threads'
	})
	return processed
}

export async function fetchAndUpdateMessages(userID, threadID, getter, setter) {
	const processed = await requestAndUpdate({
		args: [userID, threadID],
		transformer: messages => messages?.map(msg => ({
			user: msg?.SentByUser,
			text: msg?.Text,
			messageId: msg?.MessageID,
		})),
		getter,
		setter,
		type: 'messages'
	})
	return processed
}

export async function postAndUpdateMessage(text, userID, threadID,
	getters = { 'post': () => { }, 'get': () => { } }, setters = { 'post': () => { }, 'get': () => { } }, sentByUser = 0) {

	const processed = await requestAndUpdate({
		args: [text, userID, threadID, sentByUser],
		getter: getters['post'],
		setter: setters['post'],
		type: 'message',
		errorMessage: 'Error adding'
	})

	const unfilteredMessages = await fetchAndUpdateMessages(userID, threadID, getters['get'], setters['get']) // update messages when you add a new one
	return [processed, unfilteredMessages]
}

export async function postAndUpdateThread(threadName, userID, highlightIndex,
	getters = { 'post': () => { }, 'get': () => { } }, setters = { 'post': () => { }, 'get': () => { } }) {

	const newThreadID = await requestAndUpdate({
		args: [userID, threadName],
		getter: getters['post'],
		setter: setters['post'],
		type: 'thread',
		errorMessage: 'Error adding'
	})

	const unfilteredThreads = await fetchAndUpdateThreads(userID, getters['get'], setters['get'], highlightIndex)

	return [newThreadID, unfilteredThreads]
}

export async function patchTemperatureAndUpdateThreads(userID, threadID, newTemperature, threadIndex,
	getters = { 'patch': () => { }, 'get': () => { } }, setters = { 'patch': () => { }, 'get': () => { } }) {
	const processed = await requestAndUpdate({
		args: [userID, threadID, newTemperature],
		getter: getters['patch'],
		setter: setters['patch'],
		type: 'temperature',
		errorMessage: 'Error updating'
	})

	const unfilteredThreads = await fetchAndUpdateThreads(userID, getters['get'], setters['get'], threadIndex)

	return [processed, unfilteredThreads]
}

export async function patchTypingSpeedAndUpdateThreads(userID, threadID, newTemperature, threadIndex,
	getters = { 'patch': () => { }, 'get': () => { } }, setters = { 'patch': () => { }, 'get': () => { } }) {
	const processed = await requestAndUpdate({
		args: [userID, threadID, newTemperature],
		getter: getters['patch'],
		setter: setters['patch'],
		type: 'typing speed',
		errorMessage: 'Error updating'
	})

	const unfilteredThreads = await fetchAndUpdateThreads(userID, getters['get'], setters['get'], threadIndex)

	return [processed, unfilteredThreads]
}

export async function deleteAndUpdateThreads(userID, threadID,
	getters = { 'delete': () => { }, 'get': () => { } }, setters = { 'delete': () => { }, 'get': () => { } }) {

	const processed = await requestAndUpdate({
		args: [userID, threadID],
		getter: getters['delete'],
		setter: setters['delete'],
		type: 'thread',
		errorMessage: 'Error deleting'
	})

	const unfilteredThreads = await fetchAndUpdateThreads(userID, getters['get'], setters['get'], 0)

	return [processed, unfilteredThreads]
}