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

export const User = Template.bind({})
User.args = {
	state: {
		user: USERS.user,
		text: "This is user example content with nothing special.",
		userLogo: <PiPlaceholderDuotone />,
		error: ''
	}
}

export const Gpt = Template.bind({})
Gpt.args = {
	state: {
		user: USERS.model,
		text: markdownContent,
		userLogo: <PiPlaceholderLight />,
		typingSpeed: 50
	}
}

export const ErrorChat = Template.bind({})
ErrorChat.args = {
	state: {
		user: USERS.user,
		text: '',
		error: 'An error occurred. Please refresh and try again.',
		userLogo: <PiPlaceholderLight />,
		typingSpeed: 50,
	}
}