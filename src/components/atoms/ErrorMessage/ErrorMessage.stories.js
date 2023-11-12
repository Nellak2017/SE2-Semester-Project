import ErrorMessage from './ErrorMessage'

export default {
  title: 'Atoms/Errors/ErrorMessage',
  component: ErrorMessage,
  argTypes: {
    variant: { control: 'text' },
  }
}

const Template = args => <ErrorMessage {...args} />

export const defaultComponent = Template.bind({})
defaultComponent.args = {
  
}