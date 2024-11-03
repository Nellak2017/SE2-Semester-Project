import { DEFAULTS, VARIANTS } from '../../utils/constants.js'
import { getOrDefault, getNestedState } from '../../../utils/helpers.js'

// Business Rules / Constraints on State (Stateless version)
const validators = {
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

// Data Paths
const dataPaths = {
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

// Getters
export const selectState = (key, rule, defaultVal) => state => getOrDefault(rule(getNestedState(state, key)), getNestedState(state, key), defaultVal)
export const aggregateState = (keys = dataPaths, rules = validators, defaultVals = DEFAULTS) => Object.fromEntries(Object.entries(keys).map(([key, path]) => [key, selectState(path, rules[key], defaultVals[key])]))