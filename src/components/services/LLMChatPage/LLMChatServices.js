import { toggleSidebarOpen, setTemperature, setTypingSpeed, setThreadIndex, setUserInput, } from '../../../redux/reducers/LLMChatPageSlice.js'
import { newChat, temperatureUpdate, typingSpeedUpdate, deleteThreadThunk, userInputSubmit, openExistingThread } from '../../../redux/thunks/LLMChatPageThunks.js'
import { handleExportButtonClick } from '../../../utils/helpers.js'

export const createLLMPageServices = store => {
	const dispatch = store.dispatch
	const services = {
		sideBarServices: {
			sideBarOpen: () => {
				dispatch(toggleSidebarOpen())
			}, // reducer
			newChat: () => {
				dispatch(newChat())
			}, // thunk
			temperatureChange: (temperature) => {
				dispatch(setTemperature(temperature))
			}, // reducer
			temperatureUpdate: ({ userId, threadID, temperature }) => {
				dispatch(temperatureUpdate({ userId, threadID, temperature }))
			}, // thunk
			typingSpeedChange: (typingSpeed) => {
				dispatch(setTypingSpeed(typingSpeed))
			}, // reducer
			typingSpeedUpdate: ({ userId, threadID, typingSpeed }) => {
				dispatch(typingSpeedUpdate({ userId, threadID, typingSpeed }))
			}, // thunk
			// TODO: Logout
			setThreadIndex: (index) => {
				dispatch(setThreadIndex(index))
			}, // reducer
			exportHandler: (messages) => {
				handleExportButtonClick(messages)
			}, // raw function
			threadListServices: {
				deleteThread: ({ userId, threadid, index }) => {
					dispatch(deleteThreadThunk({ userId, threadid, index }))
				}, // thunk
				openExistingThread: ({ userId, threadid, index }) => {
					dispatch(openExistingThread({ userId, threadid, index }))
				}, // thunk
			},
		},
		chatListServices: {
			scrollHandler: () => {
			}, // not implemented
			chatInputServices: {
				userInputChange: (userInput) => {
					dispatch(setUserInput(userInput))
				}, // reducer
				userInputSubmit: ({ userId, userInput, isNewChat, threadId, updatedThreadId, messageId, nextThreadIndex, threads, chatHistory }) => {
					dispatch(userInputSubmit({ userId, userInput, isNewChat, threadId, updatedThreadId, messageId, nextThreadIndex, threads, chatHistory }))
				}, // thunk
				// OnBlur: not defined
			},
		}
	}
	return services
}