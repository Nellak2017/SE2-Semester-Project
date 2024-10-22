import { ChatInputParent, ChatInputChild } from './ChatInput.elements'
import { useRef } from 'react' // used to focus child when parent div pressed (accessibility)
import { IoIosSend } from 'react-icons/io'
import IconButton from '../IconButton/IconButton'
import { VARIANTS } from '../../utils/constants'

export default function ChatInput({ state, services, ...rest }) {
	const { variant = VARIANTS.dark, placeholder = 'Write a Message...', name = '', buttonType = 'submit', userID = 0, userInput = '', isNewChat = false, threads = [], threadIndex = 0, chatHistory = [], } = state || {}
	const { userInputSubmit = () => { }, userInputChange = () => { }, onBlur = () => { }, } = services || {}
	const ref = useRef(null), handleClick = () => ref.current.focus()
	const submitArgs = {
		userId: userID,
		userInput,
		isNewChat,
		threadId: threads?.[threadIndex]?.ThreadID || 0,
		updatedThreadId: threads?.[threads.length - 1]?.ThreadID + 1 || 0,
		messageId: chatHistory?.[0]?.MessageID + 1 || 0,
		nextThreadIndex: threads.length || 0,
		chatHistory
	}
	return (
		<ChatInputParent variant={variant} onClick={handleClick}>
			<ChatInputChild placeholder={placeholder} name={name} onChange={e => userInputChange(e.target.value)} value={userInput} onBlur={onBlur} ref={ref} {...rest} />
			<IconButton variant='icon' size='xl' type={buttonType} onClick={() => userInputSubmit(submitArgs)}><IoIosSend /></IconButton>
		</ChatInputParent>
	)
}