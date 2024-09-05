import { ChatInputParent, ChatInputChild } from './ChatInput.elements'
import { useRef } from 'react' // used to focus child when parent div pressed (accessibility)
import { IoIosSend } from 'react-icons/io'
import IconButton from '../IconButton/IconButton' 
import { VARIANTS } from '../../utils/constants'

export default function ChatInput({ state, services, ...rest }){
	const {
		variant = VARIANTS.dark,
		placeholder = 'Write a Message...',
		name = '',
		buttonType = 'submit',
		userID = 0,
		userInput = '',
		isNewChat = false,
		threads = [],
		threadIndex = 0,
		chatHistory = [],
	} = state || {}
	const {
		userInputSubmit = () => { },
		userInputChange = () => { },
		onBlur = () => { },
	} = services || {}

	const ref = useRef(null)
	const handleClick = () => ref.current.focus()

	const submitArgs = {
		userID, 
		userInput, 
		isNewChat, 
		threadId: threads?.[threadIndex]?.threadid || 0, 
		messageId: chatHistory?.[chatHistory?.length - 1]?.messageId + 1 || 0,
		nextThreadIndex: threads?.length || 0
	}

	return (
		<ChatInputParent variant={variant} onClick={handleClick}>
			<ChatInputChild placeholder={placeholder} name={name} onChange={e => userInputChange(e.target.value)} value={userInput} onBlur={onBlur} ref={ref} {...rest} />
			<IconButton variant='icon' type={buttonType} onClick={() => userInputSubmit(submitArgs)} size='xl'><IoIosSend /></IconButton>
		</ChatInputParent>
	)
}