import { useSelector } from 'react-redux'
import { USER_LOGOS } from '../../utils/constants.js'
import { aggregateLLMChatState } from '../../rules/LLMChatPageRules.js'

export const useLLMChatState = () => {
	const { variant, userId, threads, threadIndex, temperature, typingSpeed, isSideBarOpen, chatHistory, userInput, isNewChat } = aggregateLLMChatState(useSelector)
	const threadMeta = { variant, userId, threads, threadIndex, }, threadListState = { ...threadMeta, maxwidth: 260, }
	return {
		sideBarState: {
			...threadListState,
			temperature, typingSpeed, isSideBarOpen,
			buttonText: "New Chat", logoutText: "Log Out", exportText: "Export to Text",
			threadListState, chatHistory,
		},
		chatListState: {
			variant, chatHistory, userLogos: USER_LOGOS, typingSpeed,
			chatInputState: {
				...threadMeta,
				placeholder: 'Write a Message...', name: '', buttonType: 'submit',
				userInput, isNewChat, chatHistory,
			},
		},
	}
}