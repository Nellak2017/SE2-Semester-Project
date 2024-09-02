import { ChatInputParent, ChatInputChild } from './ChatInput.elements'
import { useRef, useState, useEffect } from 'react' // used to focus child when parent div pressed (accessibility)
import { IoIosSend } from 'react-icons/io' // testing only
import IconButton from '../IconButton/IconButton' // testing only

// ChatInput is defined here as just a div wrapping a textarea with No Internal State.
// I.E. This is still just a Stateless Functional React Component, that has composibility
// NOTE: Small variant overrides the Button Size to make it fit!!
const ChatInput = ({
	state,
	services,
	...rest
}) => {
	const {
		variant = 'default',
		placeholder = 'Write a Message...',
		name = '',
		buttonType = 'submit',
		parentText = '', // Pass To Parent so they can clear text on changing threads
	} = state || {}
	const {
		onSubmitHandler = () => { },
		onChange = () => { },
		onBlur = () => { },
	} = services || {}

	const ref = useRef(null)
	const handleClick = () => ref.current.focus()

	const [text, setText] = useState('')

	const handleSubmit = text => {
		text && onSubmitHandler && onSubmitHandler(text)
		setText('') // Clear after submitting
	}

	const handleChange = e => {
		onChange && onChange(e)
		setText(e.target.value)
	}

	useEffect(() => {
		(parentText || parentText === '') && setText(parentText)
	}, [parentText])

	return (
		<ChatInputParent variant={variant} onClick={handleClick}>
			<ChatInputChild placeholder={placeholder} name={name} onChange={e => handleChange(e)} value={text} onBlur={onBlur} ref={ref} {...rest} />
			<IconButton variant='icon' type={buttonType} onClick={() => handleSubmit(text)} size='xl'><IoIosSend /></IconButton>
		</ChatInputParent>
	)
}

export default ChatInput
