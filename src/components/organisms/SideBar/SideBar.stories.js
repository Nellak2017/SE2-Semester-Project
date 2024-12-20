import SideBar from './SideBar'
import { noop } from '../../../utils/helpers'

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
		name: 'Test 3'
	}
]

export const Light = Template.bind({})
Light.args = {
	state: { variant: 'light', threads: exampleThreadInfo, },
}

export const Dark = Template.bind({})
Dark.args = {
	state: {
		variant: 'dark',
		threads: exampleThreadInfo,
		initialTemperature: 50,
		initialTypingSpeed: 50,
		threadListenerList: [noop],
		trashListenerList: [noop],
		maxwidth: 260,
		buttonText: "New Chat",
		logoutText: "Log Out",
		exportText: "Export to Text",
	},
}