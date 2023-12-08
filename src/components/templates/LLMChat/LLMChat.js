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
	initialTemperature = 50,
	initialTypingSpeed = 50,
	threadListenerList = [() => {}],  // Pass to Parent
	trashListenerList = [() => {}],   // Pass to Parent
	onNewChatClick = () => console.log('New Chat'), // Pass to Parent
	onTemperatureChange = (a) => console.log(a), // Pass to Parent
	onTypingSpeedChange = (a) => console.log(a), // Pass to Parent
	onTemperatureMouseUp = () => console.log('On Mouse Up for Temperature'), // Pass to Parent
	onTypingSpeedMouseUp = () => console.log('On Mouse Up for Typing Speed'), // Pass to Parent
	onSubmitHandler = text => console.log(text), // takes text from input as arg
	onScrollHandler = () => { }, // Pass to Parent
	typingSpeed = 50,
	parentText, // Pass To Parent so they can clear text on changing threads
	chatInputOnChange, // Pass To Parent so they can see text
	exportHandler, // Pass To Parent
}) {
	return (
		<ChatListContainer>
			<SideBar 
				threads={threads}
				initialTemperature={initialTemperature}
				initialTypingSpeed={initialTypingSpeed}
				threadListenerList={threadListenerList}
				trashListenerList={trashListenerList}
				onNewChatClick={onNewChatClick}
				onTemperatureChange={onTemperatureChange}
				onTypingSpeedChange={onTypingSpeedChange}
				onTemperatureMouseUp={onTemperatureMouseUp}
				onTypingSpeedMouseUp={onTypingSpeedMouseUp}
				exportHandler={exportHandler}
			/>
			<ChatList 
				variant={variant}
				chatHistory={chatHistory}
				userLogos={userLogos}
				onSubmitHandler={onSubmitHandler}
				onScrollHandler={onScrollHandler}
				typingSpeed={typingSpeed} // don't use initial one
				parentText={parentText}
				chatInputOnChange={chatInputOnChange}
			/>
		</ChatListContainer>
	)
}

export default LLMChat