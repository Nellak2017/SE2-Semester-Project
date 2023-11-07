import Thread from './Thread'

export default {
  title: 'Molecules/Thread',
  component: Thread,
  argTypes: {
    variant: { control: 'text' },
  }
}

const Template = args => <Thread {...args} />

export const light = Template.bind({})
light.args = {
  variant: 'light',
  idno: 0
}

export const dark = Template.bind({})
dark.args = {
  variant: 'dark',
  idno: 0
}
