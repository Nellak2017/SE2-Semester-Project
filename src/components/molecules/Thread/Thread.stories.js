import Thread from './Thread'

export default {
  title: 'Molecules/Thread',
  component: Thread,
  argTypes: {
    variant: { control: 'text' },
  }
}

const Template = args => <Thread {...args} />

export const Light = Template.bind({})
Light.args = {
  state: {
    variant: 'light',
    idno: 0,
    highlighted: true
  }
}

export const Dark = Template.bind({})
Dark.args = {
  state: {
    variant: 'dark',
    idno: 0
  }
}
