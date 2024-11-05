import LLMChatPageErrorBoundary from './LLMChatPageErrorBoundary'

export default {
	title: 'Templates/LLMChatPageErrorBoundary',
	component: LLMChatPageErrorBoundary,
	argTypes: {}
}

const Template = args => <LLMChatPageErrorBoundary {...args} />

export const Standard = Template.bind({})
Standard.args = {
	error: { message: 'You put a toaster in the tub with you, ouch.You put a toaster in the tub with you, ouch.' },
	resetErrorBoundary: () => console.log('You pressed reset boundary!')
}