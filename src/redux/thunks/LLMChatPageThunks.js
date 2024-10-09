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
	addThread, // userInputSubmit
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
	deleteThread as deleteThreadAPI
} from '../../utils/api.js'
import { isOk, handle, getError, getValue } from '../../utils/result.js'
import { convertMessagesToGemini } from '../../utils/helpers.js'

// TODO: Define what credentials mean

// initialize LLMChatPage (used in Login/Signup), returns boolean to indicate if successful updating userId, threads, and messages
export const initialize = ({ credentials }) => async (dispatch) => {
	// 1. initializeWorkflow({ credentials, threadIndex:0 }) => <Result> of { ok: { userId, threads, messages } | '' , error: string | ''}
	const result = await initializeWorkflow({ credentials, threadIndex: 0 })
	// 2. update threads and messages OR display an error when handling the result
	if (!isOk(result)) {
		console.error(getError(result))
		dispatch(addMessage({ MessageID: 1, ThreadID: 1, Text: '', TimeStamp: new Date().toISOString(), SentByUser: 'user', error: 'An initialization error occurred.\n' + getError(result) }))
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
	dispatch(setTemperature(50))
	dispatch(setTypingSpeed(50))
}

export const deleteThreadThunk = ({ userId, index, threadid = 0 }) => async (dispatch) => {
	dispatch(deleteThread(index))
	dispatch(deleteMessages())
	dispatch(highlightThread(-1))
	const deleteResult = await deleteThreadAPI({ userID: userId, threadID: threadid })
	handle(deleteResult,
		_ => dispatch(openExistingThread({ userId, index, threadid, isNewChat: true })),
		err => {
			console.error('Error deleting.')
			console.error(err)
		},
	)
	// TODO: If deletion fails rollback UI
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
				console.error('Could not update messages with AI response.')
				console.error(err)
				dispatch(addMessage({ MessageID: messageId, ThreadID: threadId, Text: userInput, TimeStamp: new Date().toISOString(), SentByUser: 'user', error: 'Could not update messages with AI response.\n' + err }))
			}
		)
		return result
	}
	const updateTitleWithAIResponse = async () => {
		const result = await titleWorkflow({ userId, userInput })
		if (chatHistory?.[0]?.error) dispatch(setMessages(chatHistory.slice(1, chatHistory.length))) // if we have an error displayed, remove it before proceeding
		handle(result,
			val => {
				dispatch(addThread({ ThreadID: val.newThreadID, Name: val.LLMResponse, Temperature: 50, TypingSpeed: 50, UserID: userId, highlighted: true }))
			},
			err => {
				console.error(err)
				dispatch(addThread({ ThreadID: updatedThreadId, Name: 'New Chat', Temperature: 50, TypingSpeed: 50, UserID: userId, highlighted: true }))
				dispatch(addMessage({ MessageID: messageId, ThreadID: threadId, Text: userInput, TimeStamp: new Date().toISOString(), SentByUser: 'user', error: err }))
			}
		)
		return result
	}
	if (!isNewChat) {
		await updateMessagesWithAIResponse(threadId)
		return
	}
	const titleResult = await updateTitleWithAIResponse() // Result of { newThreadID, LLMResponse }
	if (!isOk(titleResult)) return
	const { newThreadID } = getValue(titleResult)
	const messagesResult = await updateMessagesWithAIResponse(newThreadID)
	if (!isOk(messagesResult)) return

	dispatch(setIsNewChat(false))
	dispatch(setThreadIndex(nextThreadIndex))
}

export const openExistingThread = ({ userId, index, threadid, isNewChat = false }) => async (dispatch) => {
	dispatch(setThreadIndex(index))
	dispatch(setIsNewChat(isNewChat)) // if deleting it should be true, if otherwise it should be false
	dispatch(setUserInput(''))
	const result = await openThreadWorkflow({ userId, threadid })
	if (!isOk(result)) {
		console.error('Failed to open existing thread.')
		console.error(getError(result))
		dispatch(addMessage({ MessageID: -1, ThreadID: threadid, Text: '', TimeStamp: new Date().toISOString(), SentByUser: 'user', error: 'Failed to open existing thread.' }))
		return
	}
	const { threads, messages, temperature, typingSpeed } = getValue(result)
	dispatch(setThreads(threads))
	dispatch(setMessages(messages))
	dispatch(setTemperature(temperature))
	dispatch(setTypingSpeed(typingSpeed))
	dispatch(highlightThread(index))
}