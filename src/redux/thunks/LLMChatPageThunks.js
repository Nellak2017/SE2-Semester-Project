import {
	deleteThread, // deleteThreadThunk 
	setTemperature, // temperatureUpdate, openExistingThread, initialize
	setTypingSpeed, // typingSpeedUpdate, openExistingThread, initialize
	setUserId, // logout potentially
	setUserInput, // userInputSubmit, openExistingThread
	setThreadIndex, // openExistingThread, newChat
	setThreads, // initialize, openExistingThread
	setIsNewChat, // openExistingThread, newChat, userInputSubmit
	highlightThread, // openExistingThread, newChat
	setMessages, // newChat, openExistingThread
	addMessage, // userInputSubmit
	// whatever would be used for onScroll?
} from '../reducers/LLMChatPageSlice.js'

import {
	dialogueWorkflow,
	titleWorkflow,
	initializeWorkflow,
	openThreadWorkflow,
} from '../../utils/workflows.js'

import {
	patchTemperature,
	patchTypingSpeed,
} from '../../utils/api.js'

import { isOk } from '../../utils/result.js'

// TODO: Add API calls and other required actions to these thunks
// TODO: Define what credentials mean

// initialize LLMChatPage (used in Login/Signup), returns boolean to indicate if successful updating userId, threads, and messages
export const initialize = ({ credentials }) => async (dispatch) => {
	// 1. initializeWorkflow({ credentials, threadIndex:0 }) => <Result> of { ok: { userId, threads, messages } | '' , error: string | ''}
	const result = await initializeWorkflow({ credentials, threadIndex: 0 })
	// 2. update threads and messages OR display an error when handling the result
	if (!isOk(result)) {
		// log it with console.log and the other method using the logging aspect or other means
		console.error(result.error)
		return false
	}
	// otherwise, update userId, threads, messages
	const { userID, threads, messages, temperature, typingSpeed } = result.ok
	dispatch(setUserId(userID))
	dispatch(setThreads(threads))
	dispatch(setMessages(messages))
	dispatch(setTemperature(temperature))
	dispatch(setTypingSpeed(typingSpeed))
	return true
}

export const newChat = () => dispatch => {
	dispatch(highlightThread(-1))
	dispatch(setThreadIndex(0))
	dispatch(setMessages([]))
	dispatch(setIsNewChat(true))
}

export const deleteThreadThunk = ({ userId, index, threadid }) => dispatch => {
	dispatch(deleteThread(index))
	console.log(`Implement thunk for delete thread: ${index} with userID: ${userId}, with threadid: ${threadid}`)
	// DELETE requests using userId to delete a thread
	// TODO: Change this to delete based on threadId instead of index
	// possible highlighting logic upon deletion
}

export const temperatureUpdate = ({ userId, threadID, temperature }) => dispatch => {
	dispatch(setTemperature(temperature))
	patchTemperature({ userID: userId, threadID, newTemperature: temperature })
}

export const typingSpeedUpdate = ({ userId, threadID, typingSpeed }) => dispatch => {
	dispatch(setTypingSpeed(typingSpeed))
	patchTypingSpeed({ userID: userId, threadID, newTypingSpeed: typingSpeed })
}

// TODO: Log in thunk
// TODO: Log out thunk

export const userInputSubmit = ({ userId, userInput, isNewChat, threadId, messageId, nextThreadIndex }) => async (dispatch) => {
	console.log('implement userInputSubmit thunk')
	if (!isNewChat) {
		dispatch(addMessage({ user: 0, text: userInput, messageId })) // user message reducer
		console.log('addMessage dispatched')
		const result = await dialogueWorkflow({ userId, userInput, threadId })
		// ok => dispatch(addMessage({ user: 1, text: LLMResponse, messageId: messageId + 1 }))
		// error => console.error(error) 
		return
	}
	const titleResult = await titleWorkflow()
	// ok => dispatch(addThread( ... ))
	// error => console.error(error)

	dispatch(addMessage({ user: 0, text: userInput, messageId })) // user message reducer
	const dialogueResult = await dialogueWorkflow({ userId, userInput, threadId })
	// ok => dispatch(addMessage({ user: 1, text: LLMResponse, messageId: messageId + 1 }))
	// error => console.error(error)

	dispatch(setIsNewChat(false))
	dispatch(setThreadIndex(nextThreadIndex))
}

export const openExistingThread = ({ userId, index, threadid }) => async (dispatch) => {
	dispatch(setThreadIndex(index))
	dispatch(setIsNewChat(false))
	dispatch(setUserInput(''))
	const result = await openThreadWorkflow({ userId, threadid })
	if (!isOk(result)) {
		console.error('Failed to open existing thread\n' + result.error)
		return
	}
	const { threads, messages, temperature, typingSpeed } = result.ok
	dispatch(setThreads(threads))
	dispatch(setMessages(messages))
	dispatch(setTemperature(temperature))
	dispatch(setTypingSpeed(typingSpeed))
	dispatch(highlightThread(index))
}