import { useState, useEffect, useRef } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm"
import { CodeHeader } from "../Chat/Chat.elements"
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

const syntaxTheme = oneDark

// TODO: Centralize this to some other location
const MarkdownComponents = {
	code({ node, inline, className, ...props }) {
		const hasLang = /language-(\w+)/.exec(className || '')
		const hasMeta = node?.data?.meta

		const applyHighlights = (applyHighlight) => {
			if (hasMeta) {
				const RE = /{([\d,-]+)}/
				const metadata = node.data.meta?.replace(/\s/g, '')
				const strlineNumbers = RE?.test(metadata)
					? RE?.exec(metadata)[1]
					: '0'
				const highlightLines = rangeParser(strlineNumbers)
				const highlight = highlightLines
				const data = highlight.includes(applyHighlight)
					? 'highlight'
					: null
				return { data }
			} else {
				return {}
			}
		}

		return hasLang ? (
			<CodeHeader>
				<p>{hasLang[1]}</p>
				<SyntaxHighlighter
					style={syntaxTheme}
					language={hasLang[1]}
					PreTag="div"
					className="codeStyle syntax-higlighter"
					showLineNumbers={true}
					wrapLines={hasMeta}
					useInlineStyles={true}
					lineProps={applyHighlights}
				>
					{props.children}
				</SyntaxHighlighter>
			</CodeHeader>
		) : (
			<code className={className} {...props} />
		)
	}
}

const TypingSimulator = ({ message, typingSpeed }) => {

	const [typedText, setTypedText] = useState('')
	const initialMount = useRef(true)
	const calculateDelay = () => {return Math.floor(100 / (typingSpeed + 1))}
	
	useEffect(() => {
		// To ensure this runs only once, I use a ref
		if (initialMount.current) {
			let currentIndex = 0
			const totalChars = message.length
			const typeCharacters = async () => {
				while (currentIndex < totalChars) {
					// Use a Promise to introduce an asynchronous delay
					await new Promise(resolve => setTimeout(resolve, calculateDelay()))
					const idxToUse = currentIndex // must be used, otherwise inconsistent with let
					setTypedText(prevText => prevText + message[idxToUse])
					currentIndex += 1
				}
			}
	
			// Start typing simulation
			typeCharacters()
			initialMount.current = false
		}
	}, [])

	return (
		<ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
			{typedText}
		</ReactMarkdown>
	)
}

export default TypingSimulator