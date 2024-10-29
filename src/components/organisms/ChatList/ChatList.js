import Chat from '../../molecules/Chat/Chat'
import ChatInput from '../../atoms/ChatInput/ChatInput.js'
import { VARIANTS, USER_LOGOS } from '../../utils/constants'
import { ChatListContainer, MessageContainer } from './ChatList.elements.js'
import { PiPlaceholderDuotone } from 'react-icons/pi'
import { noop } from '../../../utils/helpers.js'

export default function ChatList({ state, services }) {
	const { variant = VARIANTS.dark, chatHistory = [], userLogos = USER_LOGOS, typingSpeed = 50, chatInputState, } = state || {}
	const { scrollHandler = noop, chatInputServices } = services || {}
	return (
		<ChatListContainer variant={variant}>
			<MessageContainer onScroll={scrollHandler}>
				{chatHistory?.map((el, i) => {
					const { sentByUser: user, text, messageId, error } = el || {}
					const userLogo = userLogos[user] || <PiPlaceholderDuotone />, newTypingSpeed = i === 0 && typingSpeed /* typingSpeed or false */
					return (<Chat state={{ user, text, error, userLogo, typingSpeed: newTypingSpeed, }} key={`text-${messageId}`} />)
				})}
			</MessageContainer>
			<ChatInput state={chatInputState} services={chatInputServices} />
		</ChatListContainer>
	)
}