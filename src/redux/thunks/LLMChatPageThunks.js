import {
	addThread, // newChat
	deleteThread, // deleteThreadThunk 
	setTemperature, // temperatureUpdate
	setTypingSpeed, // typingSpeedUpdate
	setUserId, // logout potentially
	setUserInput, // userInputSubmit, openExistingThread
	setThreadIndex, // openExistingThread, newChat
	setThreads, // initialize
	setIsNewChat, // openExistingThread, newChat, userInputSubmit
	highlightThread, // openExistingThread, newChat
	setMessages, // newChat
	addMessage, // userInputSubmit
	// whatever would be used for onScroll?
} from '../reducers/LLMChatPageSlice.js'

import {
	dialogueWorkflow,
	titleWorkflow,
	initializeWorkflow,
} from '../../utils/workflows.js'

// TODO: Add API calls and other required actions to these thunks
// TODO: Define what credentials mean

// initialize LLMChatPage (used in Login/Signup), returns boolean to indicate if successful updating userId, threads, and messages
export const initialize = ({ credentials }) => async (dispatch) => {
	// 1. initializeWorkflow({ credentials, threadIndex:0 }) => <Result> of { ok: { userId, threads, messages } | '' , error: string | ''}
	const result = await initializeWorkflow({ credentials, threadIndex: 0 })
	// 2. update threads and messages OR display an error when handling the result
	if (result?.error) {
		// log it with console.log and the other method using the logging aspect or other means
		console.log("surrogate for proper logging of initialization error")
		return false
	}
	// otherwise, update userId, threads, messages
	const { userID, threads, messages } = result.ok
	dispatch(setUserId(userID))
	dispatch(setThreads(threads))
	dispatch(setMessages(messages))
	return true
}

export const newChat = ({ userId, threadid }) => dispatch => {
	// don't highlight anything, thread index = 0, messages = [], isNewChat = true
	console.log(`Implement thunk for delete newChat with userID: ${userId}, with threadid: ${threadid}`)
	dispatch(highlightThread(-1))
	dispatch(setThreadIndex(0))
	dispatch(setMessages([]))
	dispatch(setIsNewChat(true))
	// POST requests using userId to make a new thread?
}

export const deleteThreadThunk = ({ userId, index, threadid }) => dispatch => {
	dispatch(deleteThread(index))
	console.log(`Implement thunk for delete thread: ${index} with userID: ${userId}, with threadid: ${threadid}`)
	// DELETE requests using userId to delete a thread
	// TODO: Change this to delete based on threadId instead of index
	// possible highlighting logic upon deletion
}

export const temperatureUpdate = ({ userId, temperature }) => dispatch => {
	dispatch(setTemperature(temperature))
	console.log("Implement thunk for temperature")
	console.log(temperature)
	// POST requests using userId to update temperature field
}

export const typingSpeedUpdate = ({ userId, typingSpeed }) => dispatch => {
	dispatch(setTypingSpeed(typingSpeed))
	console.log("Implement thunk for typing speed")
	console.log(typingSpeed)
	// POST requests using userId to update typing field
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
// TODO: Make all threadID and userId and other consistent casing universally!
// TODO: openExistingThread ({userId, index, threadID}): theadIndex = i, isNewchat = false, userInput = '', get new messages, get new threads
export const openExistingThread = ({ userId, index, threadid }) => dispatch => {
	console.log("implement thunk for openExisting Thread")
	dispatch(setThreadIndex(index))
	dispatch(setIsNewChat(false))
	dispatch(setUserInput(''))
	// GET threads for the user
	// GET messages for the user given the threadId
	dispatch(highlightThread(index))
}