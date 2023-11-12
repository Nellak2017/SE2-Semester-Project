import Chat from '../../molecules/Chat/Chat'
import ChatInput from '../../atoms/ChatInput/ChatInput.js'
import { VARIANTS, USERS } from '../../utils/constants'
import {
	ChatListContainer,
	MessageContainer
} from './ChatList.elements.js'
import { PiPlaceholderDuotone } from 'react-icons/pi'

function ChatList({
	variant = VARIANTS.dark,
	color,
	chatHistory,
	userLogos
}) {
	return (
		<ChatListContainer variant={variant}>
			<MessageContainer>
				{chatHistory?.map((el, key) => (
					<Chat
						key={`text-${el?.messageId}`}
						user={el?.user || USERS?.user}
						message={el?.text || ""}
						userLogo={userLogos[el?.user || USERS?.user] || <PiPlaceholderDuotone />}
						error={el?.error ?? false}
					/>
				))}
			</MessageContainer>
			<ChatInput />
		</ChatListContainer>
	)
}

export default ChatList