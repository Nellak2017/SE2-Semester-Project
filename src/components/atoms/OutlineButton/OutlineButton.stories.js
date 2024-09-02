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
	state: {
		variant: 'light',
		text: '',
		icon: <BsLayoutSidebar />,
	},
	services: {
		onClick: () => console.log('hello light theme')
	}
}

export const Dark = Template.bind({})
Dark.args = {
	state: {
		variant: 'dark',
	},
	services: {
		onClick: () => console.log('hello dark theme')
	}
}
