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
	onTemperatureChange = (a) => console.log(a), // Pass to Parent
	onTypingSpeedChange = (a) => console.log(a), // Pass to Parent
	onTemperatureMouseUp = () => console.log('On Mouse Up for Temperature'), // Pass to Parent
	onTypingSpeedMouseUp = () => console.log('On Mouse Up for Typing Speed'), // Pass to Parent
	onSubmitHandler = text => console.log(text), // takes text from input as arg
}) {
	return (
		<ChatListContainer>
			<SideBar 
				threads={threads}
				initialTemperature={initialTemperature}
				initialTypingSpeed={initialTypingSpeed}
				threadListenerList={threadListenerList}
				trashListenerList={trashListenerList}
				onTemperatureChange={onTemperatureChange}
				onTypingSpeedChange={onTypingSpeedChange}
				onTemperatureMouseUp={onTemperatureMouseUp}
				onTypingSpeedMouseUp={onTypingSpeedMouseUp}
			/>
			<ChatList 
				variant={variant}
				chatHistory={chatHistory}
				userLogos={userLogos}
				onSubmitHandler={onSubmitHandler}
			/>
		</ChatListContainer>
	)
}

export default LLMChat