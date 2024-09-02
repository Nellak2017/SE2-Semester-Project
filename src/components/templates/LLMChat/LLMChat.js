import { VARIANTS } from "../../utils/constants"
import { ChatListContainer } from './LLMChat.elements.js'
import ChatList from "../../organisms/ChatList/ChatList"
import SideBar from "../../organisms/SideBar/SideBar"

// TODO: Flesh out SideBar with all the props from LLMChat
function LLMChat({
	state = {
		variant: VARIANTS.dark,
		chatHistory,
		userLogos,
		threads,
		initialTemperature: 50,
		initialTypingSpeed: 50,
		threadListenerList: [() => { }],  // Pass to Parent
		trashListenerList: [() => { }],   // Pass to Parent
		typingSpeed: 50,
		parentText, // Pass To Parent so they can clear text on changing threads
	},
	services = {
		onNewChatClick: () => console.log('New Chat'), // Pass to Parent
		onTemperatureChange: (a) => console.log(a), // Pass to Parent
		onTypingSpeedChange: (a) => console.log(a), // Pass to Parent
		onTemperatureMouseUp: () => console.log('On Mouse Up for Temperature'), // Pass to Parent
		onTypingSpeedMouseUp: () => console.log('On Mouse Up for Typing Speed'), // Pass to Parent
		onSubmitHandler: text => console.log(text), // takes text from input as arg
		onScrollHandler: () => { }, // Pass to Parent
		chatInputOnChange, // Pass To Parent so they can see text
		exportHandler, // Pass To Parent
	},
}) {
	const { variant, chatHistory, userLogos, threads, initialTemperature,
		initialTypingSpeed, threadListenerList, trashListenerList,
		typingSpeed, parentText
	} = state || {}
	const { onNewChatClick, onSubmitHandler, onTemperatureChange,
		onTypingSpeedChange, onTemperatureMouseUp, onTypingSpeedMouseUp,
		onScrollHandler, chatInputOnChange, exportHandler
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