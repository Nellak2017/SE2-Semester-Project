import ThreadList from './ThreadList'

export default {
  title: 'Molecules/ThreadList',
  component: ThreadList,
  argTypes: {
    variant: { control: 'text' },
  }
}

const Template = args => <ThreadList {...args} />

const exampleThreadInfo = [
	{
		title: 'Test 1',
		highlighted: true
	},
	{
		title: 'Test 2'
	},
	{
		title: 'Test 3'
	}
]

export const light = Template.bind({})
light.args = {
  variant: 'light',
  threads: exampleThreadInfo
}

export const dark = Template.bind({})
dark.args = {
  variant: 'dark',
  threads: exampleThreadInfo
}
