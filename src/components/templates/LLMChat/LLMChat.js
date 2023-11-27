import { VARIANTS } from "../../utils/constants"
import { ChatListContainer } from './LLMChat.elements.js'
import ChatList from "../../organisms/ChatList/ChatList"
import SideBar from "../../organisms/SideBar/SideBar"

// TODO: Flesh out SideBar with all the props from LLMChat
function LLMChat({
	variant = VARIANTS.dark,
	chatHistory,
	userLogos,
	threads,
	threadListenerList = [() => {}],  // Pass to Parent
	trashListenerList = [() => {}],   // Pass to Parent
}) {
	return (
		<ChatListContainer>
			<SideBar 
				threads={threads}
				threadListenerList={threadListenerList}
				trashListenerList={trashListenerList}
			/>
			<ChatList 
				variant={variant}
				chatHistory={chatHistory}
				userLogos={userLogos}
			/>
		</ChatListContainer>
	)
}

export default LLMChat