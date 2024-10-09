import { USERS } from "../../utils/constants"
import {
	ChatContainer,
	MessageContainer,
	LogoContainer,
	Message,
} from './Chat.elements.js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm"
import ErrorMessage from "../../atoms/ErrorMessage/ErrorMessage.js"
import TypingSimulator from "../TypingSimulator/TypingSimulator.js"
import { PiPlaceholderDuotone } from 'react-icons/pi'
import { MarkdownComponents } from '../TypingSimulator/markdownComponents.js'

const NormalComponent = ({ error, typingSpeed, user, text = '' }) => !error && (user !== USERS.model || !typingSpeed)
	? (<Message><ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown></Message>)
	: undefined

const TypingSimulationComponent = ({ error, typingSpeed, user, text = '' }) => !error && user === USERS.model && typingSpeed
	? (<Message><TypingSimulator message={text} typingSpeed={typingSpeed} /></Message>)
	: undefined

const ErrorComponent = ({ error }) => error
	? (<ErrorMessage message={error} />) 
	: undefined

export default function Chat({ state, ...props }) {
	const {
		user = USERS.user,
		userLogo = <PiPlaceholderDuotone />,
		text = '',
		error = '',
		typingSpeed = 0,
	} = state || {}
	return (
		<ChatContainer user={user} {...props}> {/* possible users are: 'user' or 'model'. Invalid defaults to 'user' styles */}
			<MessageContainer>
				<LogoContainer>{userLogo}</LogoContainer>
				{NormalComponent({ error, typingSpeed, user, text }) /* Render normal component if no errors and typing speed provided */}
				{TypingSimulationComponent({ error, typingSpeed, user, text }) /* Render typing simulation if typingSpeed is provided */}
				{ErrorComponent({ error }) /* Render error if error is provided */}
			</MessageContainer>
		</ChatContainer>
	)
}