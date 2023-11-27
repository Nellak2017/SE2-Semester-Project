import SideBar from './SideBar'

export default {
  title: 'Organisms/SideBar',
  component: SideBar,
  argTypes: {
    variant: { control: 'text' },
  }
}

const Template = args => <SideBar {...args} />

const exampleThreadInfo = [
	{
		name: 'Test 1',
		highlighted: true
	},
	{
		name: 'Test 2'
	},
	{
		Name: 'Test 3'
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