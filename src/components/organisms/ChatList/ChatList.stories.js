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
		SentByUser: 'model',
		Text: markdownContent, // 'first (oldest)',
		MessageID: 0
	},
	{
		SentByUser: 'user',
		Text: 'second',
		MessageID: 1
	},
	{
		SentByUser: 'model',
		Text: 'third',
		error: 'An Error occurred, please refresh and try again', // optional parameter
		MessageID: 2
	},
	{
		SentByUser: 'user',
		Text: 'fourth',
		MessageID: 3
	},
	{
		SentByUser: 'model',
		Text: 'fifth',
		MessageID: 4
	},
	{
		SentByUser: 'user',
		Text: 'sixth',
		MessageID: 5
	},
	{
		SentByUser: 'model',
		Text: 'seventh',
		MessageID: 6
	},
	{
		SentByUser: 'user',
		Text: 'eigth',
		MessageID: 7
	},
	{
		SentByUser: 'model',
		Text: 'ninth',
		MessageID: 8
	},
	{
		SentByUser: 'user',
		Text: 'tenth',
		MessageID: 9
	},
	{
		SentByUser: 'model',
		Text: 'eleventh',
		MessageID: 10
	},
	{
		SentByUser: 'user',
		Text: 'twelveth (newest)',
		MessageID: 11
	},
]

const exampleUserLogos = {
	'model': <PiPlaceholderLight />,
	'user': <PiPlaceholderDuotone />
}


const sampleChatHistory = [{ "MessageID": 1, "ThreadID": 1, "Text": "Message1_Thread1_UserA", "Timestamp": "2024-08-27T06:33:45.000Z", "SentByUser": "model", "UserID": 1 }, { "MessageID": 2, "ThreadID": 1, "Text": "Message2_Thread1_UserA", "Timestamp": "2024-08-27T06:33:45.000Z", "SentByUser": "user", "UserID": 1 }, { "MessageID": 3, "ThreadID": 1, "Text": "Message3_Thread1_UserA", "Timestamp": "2024-08-27T06:33:49.000Z", "SentByUser": "model", "UserID": 1 }]

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
		chatHistory: sampleChatHistory.slice().reverse(),
	}
}