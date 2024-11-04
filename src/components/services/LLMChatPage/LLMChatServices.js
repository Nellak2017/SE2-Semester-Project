import { handleExportButtonClick } from '../../../utils/helpers.js'
import { aggregateLLMChatServices } from '../../rules/LLMChatPageRules.js'

export const createLLMPageServices = store => {
	const dispatch = store.dispatch
	const { sideBarOpen, newChat, temperatureChange, temperatureUpdate, typingSpeedChange, typingSpeedUpdate, setThreadIndex, deleteThread, openExistingThread, scrollHandler, userInputChange, userInputSubmit, } = aggregateLLMChatServices(dispatch)
	return {
		sideBarServices: {
			sideBarOpen, newChat, temperatureChange, temperatureUpdate, typingSpeedChange, typingSpeedUpdate, setThreadIndex,
			exportHandler: messages => handleExportButtonClick(messages),
			threadListServices: { deleteThread, openExistingThread },
		},
		chatListServices: { scrollHandler, chatInputServices: { userInputChange, userInputSubmit, }, }
	}
}