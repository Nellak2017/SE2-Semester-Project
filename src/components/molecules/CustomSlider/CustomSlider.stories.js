import CustomSlider from './CustomSlider.js'

export default {
  title: 'Molecules/CustomSlider',
  component: CustomSlider,
  argTypes: {
    variant: { control: 'text' },
  }
}

const Template = args => <CustomSlider {...args} />

export const Light = Template.bind({})
Light.args = {
	state: {
		title: 'Test Light',
		value: 35,
	},
	// no services
}

export const Dark = Template.bind({})
Dark.args = {
	state: {
		title: 'Test Dark',
		value: 65,
	}
}
