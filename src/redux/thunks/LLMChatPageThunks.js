import {
	addThread, // newChat
	deleteThread, // deleteThreadThunk 
	setTemperature, // temperatureUpdate
	setTypingSpeed, // typingSpeedUpdate
	setUserId, // logout potentially
	setUserInput, // userInputSubmit, openExistingThread
	setThreadIndex, // openExistingThread, newChat
	setIsNewChat, // openExistingThread, newChat, userInputSubmit
	highlightThread, // openExistingThread, newChat
	setMessages, // newChat
	addMessage, // userInputSubmit
	// whatever would be used for onScroll?
} from '../reducers/LLMChatPageSlice.js'

import {
	dialogueWorkflow,
	titleWorkflow,
} from '../../utils/workflows.js'

// TODO: Do these need try/catch?
// TODO: Add API calls and other required actions to these thunks

// Initial fetch of data
// TODO: Create

// initial userId update
export const initialUserIdUpdate = ({ userId }) => dispatch => {
	dispatch(setUserId(userId))
}

// initialize LLMChatPage
export const initialize = ({ userId }) => dispatch => {
	console.log('Implement initialize')
	// 0. initial userIdUpdate
	dispatch(initialUserIdUpdate({ userId }))
	// 1. fetch threads
	// if no threads when fetching, early return
	// 2. update threads
	// 3. fetch messages for 0th thread's threadId
	// 4. update messages
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