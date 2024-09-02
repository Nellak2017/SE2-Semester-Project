import { VARIANTS, USER_LOGOS } from "../../utils/constants"
import { ChatListContainer } from './LLMChat.elements.js'
import ChatList from "../../organisms/ChatList/ChatList"
import SideBar from "../../organisms/SideBar/SideBar"
import { createLLMPageServices } from "../../services/LLMChatPage/LLMChatServices.js"
import store from '../../../redux/store.js'

// TODO: Flesh out SideBar with all the props from LLMChat
function LLMChat({
	state,
	services = createLLMPageServices(store),
}) {
	const {
		sideBarState = {
			variant: VARIANTS.dark,
			threads: [], 
			temperature: 50,
			typingSpeed: 50,
			threadIndex: 0,
			userID: 0,
			isSideBarOpen: true,
			maxwidth: 260, 
			buttonText: "New Chat", 
			logoutText: "Log Out", 
			exportText: "Export to Text",
		},
		chatListState = {
			variant: VARIANTS.dark,
			chatHistory: [],
			userLogos: USER_LOGOS, 
			typingSpeed: 50,
			userInput: '',
			isNewChat: true,
		}
	} = state || {}
	const { sideBarServices, chatListServices } = services || {}
	return (
		<ChatListContainer>
			<SideBar
				state={sideBarState}
				services={sideBarServices}
			/>
			<ChatList
				state={chatListState}
				services={chatListServices}
			/>
		</ChatListContainer>
	)
}

export default LLMChat