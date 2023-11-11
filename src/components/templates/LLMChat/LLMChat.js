import { VARIANTS } from "../../utils/constants"
import { ChatListContainer } from './LLMChat.elements.js'
import ChatList from "../../organisms/ChatList/ChatList"
import SideBar from "../../organisms/SideBar/SideBar"

function LLMChat({
	variant = VARIANTS.dark,
	chatHistory,
	userLogos,
	threads
}) {
	return (
		<ChatListContainer>
			<SideBar 
				threads={threads}
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