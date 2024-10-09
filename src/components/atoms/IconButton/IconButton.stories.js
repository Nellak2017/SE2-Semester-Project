import {IconButton as IconButton2} from './IconButton'
import { IoIosSend } from 'react-icons/io'

export default {
  title: 'Atoms/Buttons/IconButton',
  component: IconButton2,
  argTypes: {
    variant: { control: 'text' },
    size: { control: 'text' },
    background: { control: 'text' },
    color: { control: 'text' },
    outlineSize: { control: 'text' },
    outlineColor: { control: 'text' }
  }
}

const Template = args => <IconButton2 {...args} />

export const IconButton = Template.bind({})
IconButton.args = {
  children: <IoIosSend />,
  variant: 'icon'
}