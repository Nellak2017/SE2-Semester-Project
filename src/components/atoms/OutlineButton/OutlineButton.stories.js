import OutlineButton from './OutlineButton.js'

import { BsLayoutSidebar } from 'react-icons/bs'

export default {
	title: 'Atoms/Buttons/OutlineButton',
	component: OutlineButton,
	argTypes: {
		variant: { control: 'text' },
		size: { control: 'text' },
		onClick: { action: 'onClick works' },
	}
}

const Template = args => <OutlineButton {...args} />

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
	text: null,
	icon: <BsLayoutSidebar />,
	onclick: () => console.log('hello light theme')
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
	onclick: () => console.log('hello dark theme')
}
