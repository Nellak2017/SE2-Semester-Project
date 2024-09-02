import Chat from '../../molecules/Chat/Chat'
import ChatInput from '../../atoms/ChatInput/ChatInput.js'
import { VARIANTS, USERS } from '../../utils/constants'
import {
	ChatListContainer,
	MessageContainer
} from './ChatList.elements.js'
import { PiPlaceholderDuotone } from 'react-icons/pi'

// TODO: Flesh out ChatInput so that all props are used
function ChatList({
	state,
	services,
}) {
	const { variant = VARIANTS.dark, chatHistory = [], userLogos = [], typingSpeed = 0, parentText = ''} = state || {}
	const { onSubmitHandler = () => {}, onScrollHandler = () => {}, chatInputOnChange = () => {} } = services || {}

	const chatInputState = {
		variant: 'default',
		placeholder: 'Write a Message...',
		name: undefined, // Not sure what? TODO: Figure out name
		buttonType: 'submit',
		parentText,
	}
	const chatInputServices = {
		onSubmitHandler,
		onChange: chatInputOnChange,
		// onBlur not defined
	}

	return (
		<ChatListContainer variant={variant}>
			<MessageContainer onScroll={onScrollHandler}>
				{chatHistory?.map((el, key) => {
					const { user, author, text, content, error } = el || {}
					return (
						<Chat
							state={{
								user: user || parseInt(author) || USERS?.user,
								message: text || content || "",
								userLogo: userLogos[user || USERS?.user] || <PiPlaceholderDuotone />,
								error: error ?? false,
								typingSpeed: key === 0 && parseInt(author) === USERS?.gpt ? typingSpeed : undefined, // el?.user === USERS?.gpt
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