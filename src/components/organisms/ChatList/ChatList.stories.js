import ChatList from './ChatList'
import {
	PiPlaceholderDuotone,
	PiPlaceholderLight
} from 'react-icons/pi'

export default {
	title: 'Organisms/ChatList',
	component: ChatList,
	argTypes: {
		variant: { control: 'text' },
	}
}

const Template = args => <ChatList {...args} />

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
		user: 1,
		text: 'first (oldest)',
		messageId: 0
	},
	{
		user: 0,
		text: markdownContent,
		messageId: 1
	},
	{
		user: 1,
		text: 'third',
		error: true, // optional parameter
		messageId: 2
	},
	{
		user: 0,
		text: 'fourth',
		messageId: 3
	},
	{
		user: 1,
		text: 'fifth',
		messageId: 4
	},
	{
		user: 0,
		text: 'sixth',
		messageId: 5
	},
	{
		user: 1,
		text: 'seventh',
		messageId: 6
	},
	{
		user: 0,
		text: 'eigth',
		messageId: 7
	},
	{
		user: 1,
		text: 'ninth',
		messageId: 8
	},
	{
		user: 0,
		text: 'tenth',
		messageId: 9
	},
	{
		user: 1,
		text: 'eleventh',
		messageId: 10
	},
	{
		user: 0,
		text: 'twelveth (newest)',
		messageId: 11
	},
]

const exampleUserLogos = {
	'gpt': <PiPlaceholderLight />,
	'user': <PiPlaceholderDuotone />
}

export const Light = Template.bind({})
Light.args = {
	state: {
		variant: 'light',
		chatHistory: exampleChatHistory.slice().reverse(),
		userLogos: exampleUserLogos
	}
}

export const Dark = Template.bind({})
Dark.args = {
	state: {
		variant: 'dark',
		chatHistory: exampleChatHistory.slice().reverse(),
		userLogos: exampleUserLogos
	}
}