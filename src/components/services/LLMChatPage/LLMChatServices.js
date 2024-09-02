import {
	toggleSidebarOpen,
	setTemperature,
	setTypingSpeed,
	setThreadIndex,
	setUserInput,
} from '../../../redux/reducers/LLMChatPageSlice.js'
import {
	newChat,
	temperatureUpdate,
	typingSpeedUpdate,
	// logout / signin,
	deleteThreadThunk,
	userInputSubmit,
} from '../../../redux/thunks/LLMChatPageThunks.js'
import { handleExportButtonClick } from '../../../utils/helpers.js'

export const createLLMPageServices = store => {
	const dispatch = store.dispatch
	const services = {
		sideBarServices: {
			sideBarOpen: () => {
				dispatch(toggleSidebarOpen())
			}, // reducer
			newChat: ({ userId, thread }) => {
				dispatch(newChat({ userId, thread }))
			}, // thunk
			temperatureChange: (temperature) => {
				dispatch(setTemperature(temperature))
			}, // reducer
			temperatureUpdate: ({ userId, temperature }) => {
				dispatch(temperatureUpdate({ userId, temperature }))
			}, // thunk
			typingSpeedChange: (typingSpeed) => {
				dispatch(setTypingSpeed(typingSpeed))
			}, // reducer
			typingSpeedUpdate: ({ userId, typingSpeed }) => {
				dispatch(typingSpeedUpdate({ userId, typingSpeed }))
			}, // thunk
			// TODO: Logout
			setThreadIndex: (index) => {
				dispatch(setThreadIndex(index))
			}, // reducer
			deleteThread: ({ userId, index }) => {
				dispatch(deleteThreadThunk({ userId, index }))
			}, // thunk
			exportHandler: (messages) => {
				handleExportButtonClick(messages)
			}, // raw function
		},
		chatListServices: {
			userInputChange: (userInput) => {
				dispatch(setUserInput(userInput))
			}, // reducer
			userInputSubmit: ({ userId, userInput }) => {
				dispatch(userInputSubmit({ userId, userInput }))
			}, // thunk
			scrollHandler: () => {

			}, // not implemented
		}
	}
	return services
}