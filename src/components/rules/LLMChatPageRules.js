import { VARIANTS } from '../utils/constants.js'
import { toggleSidebarOpen, setTemperature, setTypingSpeed, setThreadIndex, setUserInput, } from '../../redux/reducers/LLMChatPageSlice.js'
import { newChat, temperatureUpdate, typingSpeedUpdate, deleteThreadThunk, userInputSubmit, openExistingThread } from '../../redux/thunks/LLMChatPageThunks.js'
import { aggregateServices, aggregateState } from './businessRuleHelpers.js'

export const LLMChatPageDefaults = { variant: VARIANTS['dark'], temperature: 50, typingSpeed: 50, userId: 1, isSideBarOpen: true, threadIndex: 0, threads: [], chatHistory: [], userInput: '', isNewChat: false, }
// --- service stuff
const LLMChatRawServices = {
	sideBarOpen: toggleSidebarOpen,
	newChat,
	temperatureChange: setTemperature,
	temperatureUpdate,
	typingSpeedChange: setTypingSpeed,
	typingSpeedUpdate,
	setThreadIndex,
	deleteThread: deleteThreadThunk,
	openExistingThread,
	scrollHandler: () => {/* empty because not implemented */ },
	userInputChange: setUserInput,
	userInputSubmit,
}
const LLMChatServiceValidators = {
	sideBarOpen: () => true,
	newChat: () => true,
	temperatureChange: temp => Number.isFinite(temp) && temp >= 0 && temp <= 100,
	temperatureUpdate: ({ userId, threadId, temperature }) => Number.isFinite(userId) && Number.isFinite(threadId) && Number.isFinite(temperature),
	typingSpeedChange: spd => Number.isFinite(spd) && spd >= 0 && spd <= 100,
	typingSpeedUpdate: ({ userId, threadId, typingSpeed }) => Number.isFinite(userId) && Number.isFinite(threadId) && Number.isFinite(typingSpeed),
	setThreadIndex: idx => Number.isInteger(idx) && idx >= 1,
	exportHandler: messages => Array.isArray(messages),
	deleteThread: ({ userId, threadId, index }) => true,
	openExistingThread: ({ userId, threadId, index }) => true,
	scrollHandler: () => true,
	userInputChange: userInput => true,
	userInputSubmit: ({ userId, userInput, isNewChat, threadId, updatedThreadId, messageId, nextThreadIndex, threads, chatHistory }) => true,
}
const LLMChatServiceDefaults = {
	sideBarOpen: LLMChatPageDefaults.isSideBarOpen,
	newChat: LLMChatPageDefaults.isNewChat,
	temperatureChange: LLMChatPageDefaults.temperature,
	temperatureUpdate: { userId: LLMChatPageDefaults.userId, threadId: 0, temperature: LLMChatPageDefaults.temperature },
	typingSpeedChange: LLMChatPageDefaults.typingSpeed,
	typingSpeedUpdate: { userId: LLMChatPageDefaults.userId, threadId: 0, typingSpeed: LLMChatPageDefaults.typingSpeed },
	setThreadIndex: LLMChatPageDefaults.threadIndex,
	exportHandler: LLMChatPageDefaults.chatHistory,
}
export const aggregateLLMChatServices = dispatch => aggregateServices(dispatch)(LLMChatRawServices, LLMChatServiceValidators, LLMChatServiceDefaults)

// --- state stuff
const LLMChatStateValidators = {
	variant: variant => Object.values(VARIANTS).includes(variant),
	userId: id => Number.isInteger(id) && id >= 1,
	threads: threadLis => Array.isArray(threadLis),
	threadIndex: index => Number.isInteger(index) && index >= 0,
	temperature: temp => Number.isInteger(temp) && temp >= 0 && temp <= 100,
	typingSpeed: speed => Number.isInteger(speed) && speed >= 0 && speed <= 100,
	isSideBarOpen: bool => bool === true || bool === false,
	chatHistory: chatLis => Array.isArray(chatLis),
	userInput: input => typeof input === 'string' && input.length <= 1000,
	isNewChat: bool => bool === true || bool === false,
}
const LLMChatStateDataPaths = {
	variant: 'LLMChatPage.variant',
	userId: 'LLMChatPage.userId',
	threads: 'LLMChatPage.sideBar.threads',
	threadIndex: 'LLMChatPage.threadIndex',
	temperature: 'LLMChatPage.sideBar.temperature',
	typingSpeed: 'LLMChatPage.typingSpeed',
	isSideBarOpen: 'LLMChatPage.sideBar.isSideBarOpen',
	chatHistory: 'LLMChatPage.chatHistory',
	userInput: 'LLMChatPage.chatList.userInput',
	isNewChat: 'LLMChatPage.chatList.isNewChat',
}
export const aggregateLLMChatState = useSelector => aggregateState(useSelector)(LLMChatStateDataPaths, LLMChatStateValidators, LLMChatPageDefaults)