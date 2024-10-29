import { toggleSidebarOpen, setTemperature, setTypingSpeed, setThreadIndex, setUserInput, } from '../../../redux/reducers/LLMChatPageSlice.js'
import { newChat, temperatureUpdate, typingSpeedUpdate, deleteThreadThunk, userInputSubmit, openExistingThread } from '../../../redux/thunks/LLMChatPageThunks.js'
import { handleExportButtonClick } from '../../../utils/helpers.js'

export const createLLMPageServices = store => { // TODO: Add Logout
	const dispatch = store.dispatch
	const services = {
		sideBarServices: {
			sideBarOpen: () => { dispatch(toggleSidebarOpen()) }, // reducer
			newChat: () => { dispatch(newChat()) }, // thunk
			temperatureChange: temperature => { dispatch(setTemperature(temperature)) }, // reducer
			temperatureUpdate: ({ userId, threadId, temperature }) => { dispatch(temperatureUpdate({ userId, threadId, temperature })) }, // thunk
			typingSpeedChange: typingSpeed => { dispatch(setTypingSpeed(typingSpeed)) }, // reducer
			typingSpeedUpdate: ({ userId, threadId, typingSpeed }) => { dispatch(typingSpeedUpdate({ userId, threadId, typingSpeed })) }, // thunk
			setThreadIndex: index => { dispatch(setThreadIndex(index)) }, // reducer
			exportHandler: messages => { handleExportButtonClick(messages) }, // raw function
			threadListServices: {
				deleteThread: ({ userId, threadId, index }) => { dispatch(deleteThreadThunk({ userId, threadId, index })) }, // thunk
				openExistingThread: ({ userId, threadId, index }) => { dispatch(openExistingThread({ userId, threadId, index })) }, // thunk
			},
		},
		chatListServices: {
			scrollHandler: () => { /* empty because not implemented */ },
			chatInputServices: {
				userInputChange: userInput => { dispatch(setUserInput(userInput)) }, // reducer
				userInputSubmit: ({ userId, userInput, isNewChat, threadId, updatedThreadId, messageId, nextThreadIndex, threads, chatHistory }) => { dispatch(userInputSubmit({ userId, userInput, isNewChat, threadId, updatedThreadId, messageId, nextThreadIndex, threads, chatHistory })) }, // thunk
				// OnBlur: not defined
			},
		}
	}
	return services
}