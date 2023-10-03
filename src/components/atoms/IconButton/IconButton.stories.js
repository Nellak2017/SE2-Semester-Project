import IconButton from './IconButton'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import { IoIosSend, IoIosPlay } from 'react-icons/io'

export default {
  title: 'Atoms/Buttons/IconButton',
  component: IconButton,
  argTypes: {
    variant: { control: 'text' },
    size: { control: 'text' },
    background: { control: 'text' },
    color: { control: 'text' },
    outlineSize: { control: 'text' },
    outlineColor: { control: 'text' }
  }
}

const Template = args => <IconButton {...args} />

export const iconButton = Template.bind({})
iconButton.args = {
  children: <IoIosSend />,
  variant: 'icon'
}

export const declineButton = Template.bind({})
declineButton.args = {
  children: <AiOutlineClose />,
  variant: 'declineOutline'
}

export const confirmButton = Template.bind({})
confirmButton.args = {
  children: <AiOutlineCheck />,
  variant: 'confirmOutline'
}

export const mediaControllerButton = Template.bind({})
mediaControllerButton.args = {
  children: <IoIosPlay />,
  variant: 'mediaControllerOutline'
}
