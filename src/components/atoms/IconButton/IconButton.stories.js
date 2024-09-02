import {IconButton as IconButton2} from './IconButton'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import { IoIosSend, IoIosPlay } from 'react-icons/io'

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

export const DeclineButton = Template.bind({})
DeclineButton.args = {
  children: <AiOutlineClose />,
  variant: 'declineOutline'
}

export const ConfirmButton = Template.bind({})
ConfirmButton.args = {
  children: <AiOutlineCheck />,
  variant: 'confirmOutline'
}

export const MediaControllerButton = Template.bind({})
MediaControllerButton.args = {
  children: <IoIosPlay />,
  variant: 'mediaControllerOutline'
}
