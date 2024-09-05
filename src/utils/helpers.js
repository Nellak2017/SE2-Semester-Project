/* eslint-disable max-lines */
// Contains many pure functions used through out the application
// See also: https://medium.com/@jemimaosoro/ecmascript-2023-mastering-tosorted-toreversed-tospliced-and-with-array-methods-61030c57a677
import 'core-js/features/array/to-reversed' // https://github.com/vercel/next.js/issues/58242
import 'core-js/features/array/to-sorted' // https://github.com/vercel/next.js/issues/58242
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
import { generatePalmMessage } from './palmApi.js'
import { tryCatchAsync, handle, ok, err, getValue } from './result.js'

// ---------------------------------------------------------------
// --- General Helpers

// Function to highlight a specific thread at an index. If index is negative, it makes everything false
export const highlightThread = (threadList, index = 0) => threadList.map((e, i) => ({ ...e, highlighted: i === index }))

// Function to tell the index of the currently highlighted
export const indexOfCurrentlyHighlighted = threadList => threadList?.findIndex(el => el.highlighted === true)

// Function to update an Object in a list given the index, property name, and property value
export const updateObjInList = ({ objList, index, propertyName, propertyValue }) => {
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

export const generateRandomSentence = ({ words = top50EnglishWords, min = 2, max = 5 }) => {
	const sentence = Array.from(
		{ length: Math.floor(Math.random() * (max - min)) + min }, // Random length between 2 and 5 words
		() => { return words[Math.floor(Math.random() * words?.length)] }
	).join(' ')

	// Capitalize the first letter and add a period at the end
	return sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + '.'
}

// Generalized listener assignment
export const assignListeners = ({ userID, threads, setter, callback }) => {
	setter(threads.map((thread, idx) => () => callback(userID, thread, idx)))
} // Set the List of listener functions for each Link


export const apiRelevantFields = arrayOfObjects => arrayOfObjects
	.toSorted((a, b) => a.messageID - b.messageID) // Sort the array based on 'messageID'
	.toReversed()
	.map(obj => ({ author: obj?.author, content: obj?.content }))

// Function to convert object keys to lowercase
export const convertKeysToLowerCase = obj => Object.keys(obj).reduce((acc, currentKey) => {
	acc[currentKey.toLowerCase()] = obj[currentKey]
	return acc
}, {})
// ---------------------------------------------------------------
// --- API Helpers (API request and SET state using return values)

// Generalized API helper

// input => <Result>
// operation : input => <Result>
export const requestAndUpdate = async ({ args, transformer = res => res, operation, setter, type, errorMessage = "Error fetching and updating" }) => {
	const result = await operation(...args)
	return handle(
		result,
		res => {
			const processed = transformer(res)
			setter(processed)
			return ok(processed)
		},
		error => {
			console.error(error)
			toast.error(`${errorMessage} ${type}, see dev console for more details.`)
			return err(error)
		}
	) // if result ok then res function, if result not ok then err function
}

// Generalized Operation then Fetch/Update
// TODO: Look closer into the return type for this and the rest of the operationAndUpdate users
// input => [result value, updated]
export const operationAndUpdate = async ({ operationArgs, fetchArgs, operation, fetch, type = 'message', errorMessage = 'Error adding', setter = (_) => { } }) => {
	const result = await requestAndUpdate({
		args: [...operationArgs],
		operation,
		setter,
		type,
		errorMessage
	})
	const updated = await fetch(...fetchArgs)
	return [getValue(result), updated]
}

// ---------------------------------------------------------------
// --- Wrappers (To make calling the generalized functions more convienient)

export const fetchAndUpdateThreads = async ({ userID, setter, highlightIndex = 0, getter = getThreads }) => {
	const result = await requestAndUpdate({
		args: [userID],
		transformer: response => highlightThread(response, highlightIndex),
		operation: getter,
		setter,
		type: 'threads'
	})
	return getValue(result)
}

export const fetchAndUpdateMessages = async ({ userID, threadID, setter, getter = getMessages }) => {
	const result = await requestAndUpdate({
		args: [userID, threadID],
		transformer: messages => messages?.map(msg => ({
			author: String(msg?.SentByUser),
			content: msg?.Text,
			//user: msg?.SentByUser,
			//text: msg?.Text,
			messageId: msg?.MessageID,
		})),
		operation: getter,
		setter,
		type: 'messages'
	})
	return getValue(result)
}

export const postMessagesWrapper = async ({ text, userID, threadID, sentByUser, setter }) => {
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

export const postThreadWrapper = async ({ threadName, userID, highlightIndex, setter }) => {
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

export const temperatureWrapper = async ({ userID, threadID, newTemperature, threadIndex, setter }) => {
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

export const typingSpeedWrapper = async ({ userID, threadID, newTypingSpeed, threadIndex, setter }) => {
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

export const deleteWrapper = async (userID, threadID, setter) => {
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

export const generatePalmMessageWrapper = async (messages, temperature, context = '') => {
	const result = await generatePalmMessage({
		context: context,
		messages: messages,
		temperature: temperature
	})
	return handle(
		result,
		res => res?.data?.candidates[0]?.content ?? "Unspecified Error",
		err => {
			console.error(err)
			return generateRandomSentence({})
		}
	)
}

// ---------------------------------------------------------------
// --- FILE API Helpers

export const downloadFile = (content, fileName, contentType) => {
	const blob = new Blob([content], { type: contentType })
	const link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
	link.download = fileName
	link.click()
}

export const formatMessagesForExport = messages => messages
	.toReversed()
	.map(message => `${message.author}: ${message.content}`).join('\n') // Warning Messages were stored in reverse order: ;

export const handleExportButtonClick = messages => downloadFile(formatMessagesForExport(messages), 'exported_messages.txt', 'text/plain')
