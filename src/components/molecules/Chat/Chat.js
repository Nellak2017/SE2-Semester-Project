import { USERS } from "../../utils/constants"
import {
	ChatContainer,
	MessageContainer,
	LogoContainer,
	Message,
	CodeHeader
} from './Chat.elements.js'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from "remark-gfm"

// TODO: Research Syntax Highlighting deeper
//     (1) React Syntax Highlighter - https://github.com/react-syntax-highlighter/react-syntax-highlighter
// 	   (2) Blog that shows how to do it (Modern) - https://amirardalan.com/blog/syntax-highlight-code-in-markdown
// TODO: Support Image in the Logo container not SVG

const syntaxTheme = oneDark

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
	},
}

function Chat({
	user = USERS.user,
	userLogo,
	message
}) {
	return (
		<ChatContainer user={user}>
			<MessageContainer>
				<LogoContainer>
					{userLogo}
				</LogoContainer>
				<Message>
					<ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
						{message}
					</ReactMarkdown>
				</Message>
			</MessageContainer>
		</ChatContainer>
	)
}

export default Chat