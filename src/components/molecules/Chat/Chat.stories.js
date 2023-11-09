import Chat from './Chat'
import {
	PiPlaceholderDuotone,
	PiPlaceholderLight
} from 'react-icons/pi'
import { USERS } from '../../utils/constants.js'

export default {
	title: 'Molecules/Chat',
	component: Chat,
	argTypes: {
		variant: { control: 'text' },
	}
}

const Template = args => <Chat {...args} />

const exampleChatHistory = [
	{
		user: 'LLM',
		Text: 'Example Text here',
		messageId: 0
	},
	{
		user: 'User',
		Text: 'I am a User I made this request',
		messageId: 1
	},
	{
		user: 'LLM',
		Text: 'Example Text here number 2',
		messageId: 2
	}
]

const exampleUserLogos = {
	'LLM': <PiPlaceholderLight />,
	'User': <PiPlaceholderDuotone />
}


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

export const user = Template.bind({})
user.args = {
	user: USERS.user,
	message: markdownContent,
	userLogo: <PiPlaceholderDuotone />
}

export const gpt = Template.bind({})
gpt.args = {
	user: USERS.gpt,
	message: markdownContent,
	userLogo: <PiPlaceholderLight />
}