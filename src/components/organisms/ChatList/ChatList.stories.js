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
		sentByUser: 'model',
		text: markdownContent, // 'first (oldest)',
		messageId: 0
	},
	{
		sentByUser: 'user',
		text: 'second',
		messageId: 1
	},
	{
		sentByUser: 'model',
		text: 'third',
		error: 'An Error occurred, please refresh and try again', // optional parameter
		messageId: 2
	},
	{
		sentByUser: 'user',
		text: 'fourth',
		messageId: 3
	},
	{
		sentByUser: 'model',
		text: 'fifth',
		messageId: 4
	},
	{
		sentByUser: 'user',
		text: 'sixth',
		messageId: 5
	},
	{
		sentByUser: 'model',
		text: 'seventh',
		messageId: 6
	},
	{
		sentByUser: 'user',
		text: 'eigth',
		messageId: 7
	},
	{
		sentByUser: 'model',
		text: 'ninth',
		messageId: 8
	},
	{
		sentByUser: 'user',
		text: 'tenth',
		messageId: 9
	},
	{
		sentByUser: 'model',
		text: 'eleventh',
		messageId: 10
	},
	{
		sentByUser: 'user',
		text: 'twelveth (newest)',
		messageId: 11
	},
]

const exampleUserLogos = {
	'model': <PiPlaceholderLight />,
	'user': <PiPlaceholderDuotone />
}


//const sampleChatHistory = [{ "MessageID": 1, "ThreadID": 1, "Text": "Message1_Thread1_UserA", "Timestamp": "2024-08-27T06:33:45.000Z", "SentByUser": "model", "UserID": 1 }, { "MessageID": 2, "ThreadID": 1, "Text": "Message2_Thread1_UserA", "Timestamp": "2024-08-27T06:33:45.000Z", "SentByUser": "user", "UserID": 1 }, { "MessageID": 3, "ThreadID": 1, "Text": "Message3_Thread1_UserA", "Timestamp": "2024-08-27T06:33:49.000Z", "SentByUser": "model", "UserID": 1 }]
const sampleChatHistory = [{ "messageId": 1, "ThreadID": 1, "text": "Message1_Thread1_UserA", "Timestamp": "2024-08-27T06:33:45.000Z", "sentByUser": "model", "UserID": 1 }, { "messageId": 2, "ThreadID": 1, "text": "Message2_Thread1_UserA", "Timestamp": "2024-08-27T06:33:45.000Z", "sentByUser": "user", "UserID": 1 }, { "messageId": 3, "ThreadID": 1, "text": "Message3_Thread1_UserA", "Timestamp": "2024-08-27T06:33:49.000Z", "sentByUser": "model", "UserID": 1 }]

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