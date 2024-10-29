import { ChatInputParent, ChatInputChild } from './ChatInput.elements'
import { useRef, useCallback } from 'react' // used to focus child when parent div pressed (accessibility)
import { IoIosSend } from 'react-icons/io'
import IconButton from '../IconButton/IconButton'
import { VARIANTS } from '../../utils/constants'
import { noop } from '../../../utils/helpers'

export default function ChatInput({ state, services, ...rest }) {
	const { variant = VARIANTS.dark, placeholder = 'Write a Message...', name = '', buttonType = 'submit', userId = 0, userInput = '', isNewChat = false, threads = [], threadIndex = 0, chatHistory = [], } = state || {}
	const { userInputSubmit = noop, userInputChange = noop, onBlur = noop, } = services || {}
	const ref = useRef(null)
	const handleClick = useCallback(() => ref.current.focus(), [ref]), handleInputChange = useCallback(e => userInputChange(e.target.value), [userInputChange])
	const handleSubmit = useCallback(() => userInputSubmit({
		userId, userInput, isNewChat,
		threadId: threads?.[threadIndex]?.threadId || 0,
		updatedThreadId: threads?.[threads.length - 1]?.threadId + 1 || 0,
		messageId: chatHistory?.[0]?.messageId + 1 || 0,
		nextThreadIndex: threads.length || 0,
		chatHistory
	}), [chatHistory, isNewChat, threadIndex, threads, userId, userInput, userInputSubmit])

	return (
		<ChatInputParent variant={variant} onClick={handleClick}>
			<ChatInputChild placeholder={placeholder} name={name} onChange={handleInputChange} value={userInput} onBlur={onBlur} ref={ref} {...rest} />
			<IconButton variant='icon' size='xl' type={buttonType} onClick={handleSubmit}><IoIosSend /></IconButton>
		</ChatInputParent>
	)
}
