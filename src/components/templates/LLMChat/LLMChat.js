import { VARIANTS } from "../../utils/constants"
import { ChatListContainer } from './LLMChat.elements.js'
import ChatList from "../../organisms/ChatList/ChatList"
import SideBar from "../../organisms/SideBar/SideBar"

// TODO: Flesh out SideBar with all the props from LLMChat
function LLMChat({
	state,
	services,
}) {
	const { 
		variant = VARIANTS.dark, 
		chatHistory = [], 
		userLogos = {}, 
		threads = [], 
		initialTemperature = 50, 
		initialTypingSpeed = 50, 
		threadListenerList = [() => {}], 
		trashListenerList = [() => { }], 
		typingSpeed = 50, 
		parentText = ''
	} = state || {}
	const { 
		onNewChatClick = () => console.log('New Chat'), 
		onSubmitHandler = text => console.log(text), 
		onTemperatureChange = (a) => console.log(a),
		onTypingSpeedChange = (a) => console.log(a), 
		onTemperatureMouseUp = () => console.log('On Mouse Up for Temperature'), 
		onTypingSpeedMouseUp = () => console.log('On Mouse Up for Typing Speed'),
		onScrollHandler = () => { }, 
		chatInputOnChange = () => { }, 
		exportHandler = () => { }
	} = services || {}

	const sideBarState = {
		variant,
		threads,
		initialTemperature,
		initialTypingSpeed,
		threadListenerList,
		trashListenerList,
		maxwidth: 260,
		buttonText: "New Chat",
		logoutText: "Log Out",
		exportText: "Export to Text",
	}

	const sideBarServices = {
		onNewChatClick,
		onTemperatureChange,
		onTypingSpeedChange,
		onTemperatureMouseUp,
		onTypingSpeedMouseUp,
		exportHandler
	}

	const chatListState = {
		variant,
		chatHistory,
		userLogos,
		typingSpeed, // don't use initial one
		parentText,
	}

	const chatListServices = {
		onSubmitHandler,
		onScrollHandler,
		chatInputOnChange,
	}

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