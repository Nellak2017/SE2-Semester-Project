import Chat from '../../molecules/Chat/Chat'
import ChatInput from '../../atoms/ChatInput/ChatInput.js'
import { VARIANTS, USERS, USER_LOGOS } from '../../utils/constants'
import {
	ChatListContainer,
	MessageContainer
} from './ChatList.elements.js'
import { PiPlaceholderDuotone } from 'react-icons/pi'

function ChatList({
	state,
	services,
}) {
	const { 
		variant = VARIANTS.dark, 
		chatHistory = [], 
		userLogos = USER_LOGOS, 
		typingSpeed = 50, 
		userInput = '',
		isNewChat = true,
	} = state || {}
	const { 
		userInputChange = () => {},
		userInputSubmit = () => {}, 
		scrollHandler = () => {}, 
	} = services || {}

	const chatInputState = {
		variant: 'default',
		placeholder: 'Write a Message...',
		name: undefined, // Not sure what? TODO: Figure out name
		buttonType: 'submit',
		parentText: userInput,
	}
	// TODO: Refactor this to be more concise ({userInputSubmit, userInputChange})
	const chatInputServices = {
		onSubmitHandler: userInputSubmit,
		onChange: userInputChange,
		// onBlur not defined
	}

	return (
		<ChatListContainer variant={variant}>
			<MessageContainer onScroll={scrollHandler}>
				{chatHistory?.map((el, i) => {
					const { user, text, error } = el || {}
					return (
						<Chat
							state={{
								user,
								text,
								error,
								userLogo: userLogos[user] || <PiPlaceholderDuotone />,
								typingSpeed: i === 0 && user === USERS.gpt ? typingSpeed : undefined,
							}}
							key={`text-${el?.messageId}`}
						/>)
				})}
			</MessageContainer>
			<ChatInput
				state={chatInputState}
				services={chatInputServices}
			/>
		</ChatListContainer>
	)
}

export default ChatList