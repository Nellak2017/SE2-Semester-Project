import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { CodeHeader, } from '../Chat/Chat.elements.js'
// TODO: Research Syntax Highlighting deeper (1) React Syntax Highlighter - https://github.com/react-syntax-highlighter/react-syntax-highlighter (2) Blog that shows how to do it (Modern) - https://amirardalan.com/blog/syntax-highlight-code-in-markdown
// TODO: Support Image in the Logo container not SVG
export const MarkdownComponents = {
	code({ node, inline, className, ...props }) {
		const hasLang = /language-(\w+)/.exec(className || ''), hasMeta = node?.data?.meta
		const applyHighlights = applyHighlight => {
			const RE = /{([\d,-]+)}/, metadata = node?.data?.meta?.replace(/\s/g, '')
			return hasMeta ? { data: rangeParser(RE?.test(metadata) ? RE?.exec(metadata)[1] : '0').includes(applyHighlight) ? 'highlight' : null } : {}
		}
		return hasLang ? (
			<CodeHeader>
				<p>{hasLang[1]}</p>
				<SyntaxHighlighter style={oneDark} language={hasLang[1]} PreTag="div" className="codeStyle syntax-higlighter" showLineNumbers={true} wrapLines={hasMeta} useInlineStyles={true} lineProps={applyHighlights}>
					{props.children}
				</SyntaxHighlighter>
			</CodeHeader>
		) : (<code className={className} {...props} />)
	}
}