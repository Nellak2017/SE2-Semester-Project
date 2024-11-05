import { VARIANTS } from '../utils/constants.js'
import { toggleSidebarOpen, setTemperature, setTypingSpeed, setThreadIndex, setUserInput, } from '../../redux/reducers/LLMChatPageSlice.js'
import { newChat, temperatureUpdate, typingSpeedUpdate, deleteThreadThunk, userInputSubmit, openExistingThread } from '../../redux/thunks/LLMChatPageThunks.js'
import { aggregateServices, aggregateState, toValidators } from './businessRuleHelpers.js'
import { any, number, mixedArray, bool, string, mixed, object } from '../../utils/schemaHelpers.js'

export const LLMChatPageDefaults = { variant: VARIANTS['dark'], temperature: 50, typingSpeed: 50, userId: 1, isSideBarOpen: true, threadIndex: 0, threads: [], chatHistory: [], userInput: '', isNewChat: false, }
const temperature = number.min(0).max(100), typingSpeed = number.min(0).max(100), threadIndex = number.integer().min(0), userId = number.integer().min(1), threadId = number, index = number, isNewChat = bool, updatedThreadId = number, messageId = number, nextThreadIndex = number, threads = mixedArray, chatHistory = mixedArray, userInput = string.max(1000), isSideBarOpen = bool, variant = mixed.oneOf(Object.values(VARIANTS))
const temperatureDTO = { userId, threadId, temperature }, typingSpeedDTO = { userId, threadId, typingSpeed }, deleteThreadDTO = { userId, threadId, index }, userInputSubmitDTO = { userId, threadId, threads, chatHistory, userInput, isNewChat, updatedThreadId, messageId, nextThreadIndex, }
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
const LLMChatServiceSchema = {
	sideBarOpen: any,  // Placeholder, since the validator is blank
	newChat: any,
	temperatureChange: temperature,
	temperatureUpdate: object(temperatureDTO),
	typingSpeedChange: typingSpeed,
	typingSpeedUpdate: object(typingSpeedDTO),
	setThreadIndex: threadIndex,
	exportHandler: mixedArray,
	deleteThread: object(deleteThreadDTO).required(),
	openExistingThread: object(deleteThreadDTO).required(),
	scrollHandler: any,
	userInputChange: any,
	userInputSubmit: object(userInputSubmitDTO).required(),
}
const LLMChatServiceValidators = toValidators(LLMChatServiceSchema)
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
const LLMChatStateSchema = { variant, userId, threads, threadIndex, temperature, typingSpeed, chatHistory, userInput, isSideBarOpen, isNewChat, }
const LLMChatStateValidators = toValidators(LLMChatStateSchema)
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