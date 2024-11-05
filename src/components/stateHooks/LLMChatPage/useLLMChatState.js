import { useSelector } from 'react-redux'
import { USER_LOGOS } from '../../utils/constants.js'
import { aggregateLLMChatState } from '../../rules/LLMChatPageRules.js'

export const useLLMChatState = () => {
	const { variant, userId, threads, threadIndex, temperature, typingSpeed, isSideBarOpen, chatHistory, userInput, isNewChat } = aggregateLLMChatState(useSelector)
	const threadMeta = { variant, userId, threads, threadIndex, }, threadListState = { ...threadMeta, maxwidth: 260, }
	return {
		sideBarState: {
			...threadListState, temperature, typingSpeed, isSideBarOpen, threadListState, chatHistory,
			buttonText: "New Chat", logoutText: "Log Out", exportText: "Export to Text",
		},
		chatListState: {
			variant, chatHistory, typingSpeed, userLogos: USER_LOGOS,
			chatInputState: {
				...threadMeta, userInput, isNewChat, chatHistory,
				placeholder: 'Write a Message...', name: '', buttonType: 'submit',
			},
		},
	}
}