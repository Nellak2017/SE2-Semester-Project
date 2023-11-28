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
	variant = VARIANTS.dark,
	color,
	chatHistory,
	userLogos,
	onSubmitHandler,
	onScrollHandler,
	typingSpeed,
}) {
	return (
		<ChatListContainer variant={variant}>
			<MessageContainer onScroll={onScrollHandler}>
				{chatHistory?.map((el, key) => (
					<Chat
						key={`text-${el?.messageId}`}
						user={el?.user || USERS?.user}
						message={el?.text || ""}
						userLogo={userLogos[el?.user || USERS?.user] || <PiPlaceholderDuotone />}
						error={el?.error ?? false}
						typingSpeed={key === 0 && el?.user === USERS?.gpt ? typingSpeed : undefined}
					/>
				))}
			</MessageContainer>
			<ChatInput 
				onSubmitHandler={onSubmitHandler}

			/>
		</ChatListContainer>
	)
}

export default ChatList