import { createSlice } from '@reduxjs/toolkit'
import { VARIANTS } from '../../components/utils/constants'

const initialState = {
	// shared fields here
	variant: VARIANTS.dark, // 'light'|'dark'
	userId: 1, // number
	typingSpeed: 50, // number in range 0 to 100
	threadIndex: 0, // number in range 0 to number of threads for given user
	chatHistory: [], // [{ user: number, text: string, messageId: number, error: optional bool }] // there may be more?
	sideBar: {
		// variant
		threads: [], // [{ Temperature: number, TypingSpeed: number, title: string, highlighted: bool, name: string, threadid: number }] // there may be more?
		temperature: 50, // number in range 0 to 100
		// typingSpeed
		// threadIndex
		// userID
		isSideBarOpen: true, //bool
		// maxwidth, buttonText, logoutText, exportText are constants
	},
	chatList: {
		// variant
		// chatHistory
		userInput: '', // string
		isNewChat: true, // bool
		// typingSpeed
	},
}

// Note: Reducers trust their inputs are validated with some aspect above
const LLMChatPageSlice = createSlice({
	name: 'LLMChatPage',
	initialState, 
	reducers: {
		setVariant: (state, action) => {
			state.variant = action.payload
		},
		setUserId: (state, action) => {
			state.userId = action.payload
		},
		toggleSidebarOpen: (state, _) => {
			state.sideBar.isSideBarOpen = !state.sideBar.isSideBarOpen
		},
		setTemperature: (state, action) => {
			state.sideBar.temperature = action.payload
		},
		setTypingSpeed: (state, action) => {
			state.typingSpeed = action.payload
		},
		setThreadIndex: (state, action) => {
			const index = action.payload
			state.threadIndex = index
		},
		deleteThread: (state, action) => {
			const index = action.payload
			state.sideBar.threads = [
				...state.sideBar.threads.slice(0, index),
				...state.sideBar.threads.slice(index + 1),
			] // delete it using array destructuring
		},
		addThread: (state, action) => {
			const thread = action.payload
			state.sideBar.threads = [...state.sideBar.threads, thread]
		},
		addMessage: (state, action) => {
			const message = action.payload
			state.chatHistory = [...state.chatHistory, message]
		},
		setUserInput: (state, action) => {
			const userInput = action.payload
			state.chatList.userInput = userInput
		},
		toggleIsNewChat: (state, _) => {
			state.chatList.isNewChat = !state.chatList.isNewChat
		}
	}
})

export const {
	setVariant,
	setUserId,
	toggleSidebarOpen,
	setTemperature,
	setTypingSpeed,
	setThreadIndex,
	deleteThread,
	addThread,
	addMessage,
	setUserInput,
	toggleIsNewChat,
} = LLMChatPageSlice.actions
export default LLMChatPageSlice.reducer