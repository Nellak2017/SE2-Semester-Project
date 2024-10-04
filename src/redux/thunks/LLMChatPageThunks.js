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
	deleteMessages, // deleteThreadThunk
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
import { isOk, handle, getError, getValue } from '../../utils/result.js'
import { convertMessagesToGemini } from '../../utils/helpers.js'

// TODO: Add API calls and other required actions to these thunks
// TODO: Define what credentials mean

// initialize LLMChatPage (used in Login/Signup), returns boolean to indicate if successful updating userId, threads, and messages
export const initialize = ({ credentials }) => async (dispatch) => {
	// 1. initializeWorkflow({ credentials, threadIndex:0 }) => <Result> of { ok: { userId, threads, messages } | '' , error: string | ''}
	const result = await initializeWorkflow({ credentials, threadIndex: 0 })
	// 2. update threads and messages OR display an error when handling the result
	if (!isOk(result)) {
		console.error(getError(result))
		dispatch(addMessage({ MessageID: 1, ThreadID: 1, Text: '', TimeStamp: new Date().toISOString(), SentByUser: 'user', error: 'An initialization error occurred.' + getError(result) }))
		return false
	}
	// otherwise, update userId, threads, messages
	const { userID, threads, messages, temperature, typingSpeed } = getValue(result)
	dispatch(setUserId(userID))
	dispatch(setThreads(threads))
	dispatch(setMessages(messages))
	dispatch(setTemperature(temperature))
	dispatch(setTypingSpeed(typingSpeed))
	dispatch(setIsNewChat(threads.length === 0 || messages.length === 0))
	return true
}

export const newChat = () => dispatch => {
	dispatch(highlightThread(-1))
	dispatch(setThreadIndex(0))
	dispatch(setMessages([]))
	dispatch(setIsNewChat(true))
}

export const deleteThreadThunk = ({ userId, index, threadid = 0 }) => dispatch => {
	dispatch(deleteThread(index))
	dispatch(highlightThread(threadid))
	dispatch(deleteMessages())
	// TODO: DELETE requests using userId to delete a thread
	dispatch(openExistingThread({ userId, index, threadid }))
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

export const userInputSubmit = ({ userId, userInput, isNewChat, threadId, updatedThreadId, messageId, nextThreadIndex, chatHistory }) => async (dispatch) => {
	const userMessage = { MessageID: messageId, ThreadID: threadId, Text: userInput, TimeStamp: new Date().toISOString(), SentByUser: 'user' }
	const processedNewChatHistory = convertMessagesToGemini([userMessage, ...chatHistory]).toReversed()

	const updateMessagesWithAIResponse = async (processedThreadId) => {
		const result = await dialogueWorkflow({ userId, chatHistory: processedNewChatHistory, threadId: processedThreadId, userText: userMessage.Text })
		if (chatHistory?.[0]?.error) dispatch(setMessages(chatHistory.slice(1, chatHistory.length))) // if we have an error displayed, remove it before proceeding
		handle(result,
			val => {
				dispatch(addMessage(userMessage)) // user message reducer		
				dispatch(addMessage({ MessageID: messageId + 1, ThreadID: processedThreadId, Text: val.LLMResponse, TimeStamp: new Date().toISOString(), SentByUser: 'model' }))
				dispatch(setUserInput(''))
			},
			err => {
				console.error(err)
				dispatch(addMessage({ MessageID: messageId, ThreadID: threadId, Text: userInput, TimeStamp: new Date().toISOString(), SentByUser: 'user', error: err }))
			}
		)
	}
	const updateTitleWithAIResponse = async () => {
		//const titleResult = await titleWorkflow()
		// ok => dispatch(addThread( ... ))
		// error => console.error(error)
	}
	if (!isNewChat) {
		await updateMessagesWithAIResponse(threadId)
		return
	}
	await updateTitleWithAIResponse(updatedThreadId)
	//await updateMessagesWithAIResponse()

	dispatch(setIsNewChat(false))
	dispatch(setThreadIndex(nextThreadIndex))
}

export const openExistingThread = ({ userId, index, threadid }) => async (dispatch) => {
	dispatch(setThreadIndex(index))
	dispatch(setIsNewChat(false))
	dispatch(setUserInput(''))
	const result = await openThreadWorkflow({ userId, threadid })
	if (!isOk(result)) {
		console.error('Failed to open existing thread.\n' + getError(result))
		dispatch(addMessage({ MessageID: -1, ThreadID: threadid, Text: '', TimeStamp: new Date().toISOString(), SentByUser: 'user', error: 'Failed to open existing thread.\n' + getError(result) }))
		return
	}
	const { threads, messages, temperature, typingSpeed } = getValue(result)
	dispatch(setThreads(threads))
	dispatch(setMessages(messages))
	dispatch(setTemperature(temperature))
	dispatch(setTypingSpeed(typingSpeed))
	dispatch(highlightThread(index))
}