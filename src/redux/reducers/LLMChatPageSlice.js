import { createSlice } from '@reduxjs/toolkit'
import { VARIANTS } from '../../components/utils/constants'

// TODO: Remove (testing purposes only!)
const exampleThreadInfo = [
	{
		name: 'Test 1',
		threadid: 10,
		highlighted: true,
	},
	{
		name: 'Test 2',
		threadid: 11,
	},
	{
		name: 'Test 3',
		threadid: 12,
	}
]

const markdownContent =
	`
Text Preceeding the Code Block.

\`\`\`python
def f(x):
    return x * 2

f(4)
# will be 8
\`\`\`

Text After the Code Block.

Another Code Block down here!

\`\`\`clojure
(defn hello-world [user]
	(println (str "Hello, " user "!")))
\`\`\`

Here is a longer-ish paragraph that continues on and on. and on and on and on and on and on and on and on and on.
And on and on and on and on and on and on and on and on.

Notice that the above text goes outside the box, but if styled right it instead wraps.

# Header 1
## Header 2
### Header 3

| Header 1 | Header 2 |
| ---------| ---------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`

const exampleChatHistory = [
	{
		user: 1,
		text: 'first (oldest)',
		messageId: 0
	},
	{
		user: 0,
		text: markdownContent,
		messageId: 1
	},
	{
		user: 1,
		text: 'third',
		error: true, // optional parameter
		messageId: 2
	},
	{
		user: 0,
		text: 'fourth',
		messageId: 3
	},
	{
		user: 1,
		text: 'fifth',
		messageId: 4
	},
	{
		user: 0,
		text: 'sixth',
		messageId: 5
	},
	{
		user: 1,
		text: 'seventh',
		messageId: 6
	},
	{
		user: 0,
		text: 'eigth',
		messageId: 7
	},
	{
		user: 1,
		text: 'ninth',
		messageId: 8
	},
	{
		user: 0,
		text: 'tenth',
		messageId: 9
	},
	{
		user: 1,
		text: 'eleventh',
		messageId: 10
	},
	{
		user: 0,
		text: 'twelveth (newest)',
		messageId: 11
	},
]

const initialState = {
	// shared fields here
	variant: VARIANTS.dark, // 'light'|'dark'
	userId: 1, // number
	typingSpeed: 50, // number in range 0 to 100
	threadIndex: 0, // number in range 0 to number of threads for given user
	chatHistory: exampleChatHistory, // [{ user: number, text: string, messageId: number, error: optional bool }] // there may be more?
	sideBar: {
		// variant
		threads: exampleThreadInfo, // [{ Temperature: number, TypingSpeed: number, title: string, highlighted: bool, name: string, threadid: number }] // there may be more?
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
		setMessages: (state, action) => {
			const messages = action.payload
			state.chatHistory = messages
		},
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
	setMessages,
	setUserInput,
	setIsNewChat,
	highlightThread,
} = LLMChatPageSlice.actions
export default LLMChatPageSlice.reducer