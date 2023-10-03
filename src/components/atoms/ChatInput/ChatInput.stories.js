import ChatInput from './ChatInput'

export default {
  title: 'Atoms/Input/ChatInput',
  component: ChatInput,
  argTypes: {
    variant: { control: 'text' },
    color: { control: 'text' }
  }
}

const Template = args => <ChatInput {...args} />

export const defaultInput = Template.bind({})
defaultInput.args = {
  variant: 'default'
}

export const smallInput = Template.bind({})
smallInput.args = {
  variant: 'small'
}
