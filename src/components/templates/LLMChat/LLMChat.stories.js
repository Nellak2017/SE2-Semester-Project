import LLMChat from './LLMChat'
import {
	PiPlaceholderDuotone,
	PiPlaceholderLight
} from 'react-icons/pi'

export default {
	title: 'Templates/LLMChat',
	component: LLMChat,
	argTypes: {
		variant: { control: 'text' },
	}
}

const Template = args => <LLMChat {...args} />


const markdownContent =
	`
Text Preceeding the Code Block.

\`\`\`python
def f(x):
    return x * 2

f(4)
# will be 8
\`\`\`

Text After the Code Block.

Another Code Block down here!

\`\`\`clojure
(defn hello-world [user]
	(println (str "Hello, " user "!")))
\`\`\`

Here is a longer-ish paragraph that continues on and on. and on and on and on and on and on and on and on and on.
And on and on and on and on and on and on and on and on.

Notice that the above text goes outside the box, but if styled right it instead wraps.

# Header 1
## Header 2
### Header 3

| Header 1 | Header 2 |
| ---------| ---------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`

const exampleChatHistory = [
	{
		user: 'gpt',
		text: 'first (oldest)',
		messageId: 0
	},
	{
		user: 'user',
		text: markdownContent,
		messageId: 1
	},
	{
		user: 'gpt',
		text: 'third',
		messageId: 2
	},
	{
		user: 'user',
		text: 'fourth',
		messageId: 3
	},
	{
		user: 'gpt',
		text: 'fifth',
		messageId: 4
	},
	{
		user: 'user',
		text: 'sixth',
		messageId: 5
	},
	{
		user: 'gpt',
		text: 'seventh',
		messageId: 6
	},
	{
		user: 'user',
		text: 'eigth',
		messageId: 7
	},
	{
		user: 'gpt',
		text: 'ninth',
		messageId: 8
	},
	{
		user: 'user',
		text: 'tenth',
		messageId: 9
	},
	{
		user: 'gpt',
		text: 'eleventh',
		messageId: 10
	},
	{
		user: 'user',
		text: 'twelveth (newest)',
		messageId: 11
	},
]

const exampleUserLogos = {
	'gpt': <PiPlaceholderLight />,
	'user': <PiPlaceholderDuotone />
}

const exampleThreadInfo = [
	{
		title: 'Test 1',
		highlighted: true
	},
	{
		title: 'Test 2'
	},
	{
		title: 'Test 3'
	}
]

export const light = Template.bind({})
light.args = {
	variant: 'light',
	chatHistory: exampleChatHistory.slice().reverse(),
	userLogos: exampleUserLogos,
	threads: exampleThreadInfo
}

export const dark = Template.bind({})
dark.args = {
	variant: 'dark',
	chatHistory: exampleChatHistory.slice().reverse(),
	userLogos: exampleUserLogos,
	threads: exampleThreadInfo
}