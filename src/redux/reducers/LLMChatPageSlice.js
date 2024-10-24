import { createSlice } from '@reduxjs/toolkit'
import { VARIANTS } from '../../components/utils/constants'

const initialState = {
	variant: VARIANTS.dark, // 'light'|'dark'
	userId: 1, // number
	typingSpeed: 50, // number in range 0 to 100
	threadIndex: 0, // number in range 0 to number of threads for given user
	chatHistory: [], // [{ user: number, text: string, messageId: number, error: optional string }] // there may be more?
	sideBar: {
		threads: [], // [{ Temperature: number, TypingSpeed: number, title: string, highlighted: bool, name: string, threadid: number }] // there may be more?
		temperature: 50, // number in range 0 to 100
		isSideBarOpen: true, //bool
	},
	chatList: {
		userInput: '', // string
		isNewChat: true, // bool
	},
}

const LLMChatPageSlice = createSlice({
	name: 'LLMChatPage',
	initialState,
	reducers: {
		setVariant: (state, action) => { state.variant = action.payload },
		setUserId: (state, action) => { state.userId = action.payload },
		toggleSidebarOpen: (state, _) => { state.sideBar.isSideBarOpen = !state.sideBar.isSideBarOpen },
		setTemperature: (state, action) => { state.sideBar.temperature = action.payload },
		setTypingSpeed: (state, action) => { state.typingSpeed = action.payload },
		setThreadIndex: (state, action) => {
			const index = action.payload
			state.threadIndex = index
		},
		setThreads: (state, action) => {
			const threads = action.payload
			state.sideBar.threads = threads
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
			if (state.chatHistory[0]?.error) return // prevents 2 errors displayed at once
			const message = action.payload
			state.chatHistory = [message, ...state.chatHistory]
		},
		setMessages: (state, action) => {
			const messages = action.payload
			state.chatHistory = messages
		},
		deleteMessages: (state, _) => { state.chatHistory = [] },
		setUserInput: (state, action) => {
			const userInput = action.payload
			state.chatList.userInput = userInput
		},
		setIsNewChat: (state, action) => {
			const bool = Boolean(action.payload)
			state.chatList.isNewChat = bool
		},
		highlightThread: (state, action) => {
			const index = action.payload
			state.sideBar.threads = state.sideBar.threads.map((e, i) => ({ ...e, highlighted: i === index }))
		}
	}
})

export const { setVariant, setUserId, toggleSidebarOpen, setTemperature, setTypingSpeed, setThreadIndex, setThreads, deleteThread, addThread, addMessage, setMessages, deleteMessages, setUserInput, setIsNewChat,
	highlightThread,
} = LLMChatPageSlice.actions
export default LLMChatPageSlice.reducer