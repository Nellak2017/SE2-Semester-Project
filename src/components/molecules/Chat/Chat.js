import { USERS } from "../../utils/constants"
import {
	ChatContainer,
	MessageContainer,
	LogoContainer,
	Message,
	ErrorContainer
} from './Chat.elements.js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm"
import ErrorMessage from "../../atoms/ErrorMessage/ErrorMessage.js"
import TypingSimulator from "../TypingSimulator/TypingSimulator.js"
import {
	PiPlaceholderDuotone,
} from 'react-icons/pi'
import { MarkdownComponents } from './markdownComponents.js'

export default function Chat({ state, ...props }) {
	const {
		user = USERS.user,
		userLogo = <PiPlaceholderDuotone />,
		text = '',
		error = false, // this is a code smell...
		typingSpeed = undefined,
	} = state || {}
	return (
		<ChatContainer user={user === 0 ? 'user' : 'gpt'} {...props}>
			<MessageContainer>
				<LogoContainer>
					{userLogo}
				</LogoContainer>
				{!error && (!typingSpeed && typingSpeed !== 0) && (
					// Render normally if no typingSpeed
					<Message>
						<ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
							{text}
						</ReactMarkdown>
					</Message>
				)}
				{!error && (typingSpeed || typingSpeed === 0) && user === USERS.gpt && (
					// Render typing simulation if typingSpeed is provided
					<Message>
						<TypingSimulator message={text} typingSpeed={typingSpeed} />
					</Message>
				)}
				{error &&
					<ErrorContainer>
						<ErrorMessage />
					</ErrorContainer>
				}
			</MessageContainer>
		</ChatContainer>
	)
}