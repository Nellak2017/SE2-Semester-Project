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

export const DefaultInput = Template.bind({})
DefaultInput.args = {
  state: {
    variant: 'default'
  }
}

export const SmallInput = Template.bind({})
SmallInput.args = {
  state: {
    variant: 'small'
  }
}
