import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MarkdownComponents } from './markdownComponents'

const TypingSimulator = ({ message, typingSpeed }) => {
	const [typedText, setTypedText] = useState('')
	const initialMount = useRef(true)
	const calculateDelay = useCallback(() => Math.floor(100 / (typingSpeed + 1)), [typingSpeed])
	const typeCharacter = useCallback(
		(currentIndex) => {
			if (currentIndex >= message?.length) return
			setTimeout(() => {
				setTypedText((prev) => prev + message[currentIndex])
				typeCharacter(currentIndex + 1)
			}, calculateDelay())
		},
		[message, calculateDelay] // Dependencies for the callback
	)

	useEffect(() => {
		if (initialMount.current) {
			typeCharacter(0)
			initialMount.current = false
		}
	}, [message, typingSpeed, typeCharacter])

	return (
		<ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
			{typedText}
		</ReactMarkdown>
	)
}

export default TypingSimulator