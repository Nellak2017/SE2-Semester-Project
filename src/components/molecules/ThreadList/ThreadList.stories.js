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
		name: 'Test 1',
		highlighted: true
	},
	{
		name: 'Test 2'
	},
	{
		name: 'Test 3'
	}
]

export const Light = Template.bind({})
Light.args = {
	state: {
		variant: 'light',
		threads: exampleThreadInfo
	}
}

export const Dark = Template.bind({})
Dark.args = {
	state: {
		variant: 'dark',
		threads: exampleThreadInfo
	}
}
