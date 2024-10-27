import { VARIANTS } from '../../utils/constants.js'
import { StyledOutlineButton } from './OutlineButton.elements.js'
import { BiPlus } from 'react-icons/bi'
import { noop } from '../../../utils/helpers.js'

export default function OutlineButton({ state, services, ...props }) {
	const { variant = VARIANTS.dark, icon = <BiPlus />, text = 'New Chat', centered = false, maxheight = 44, maxwidth, } = state || {}
	const { onClick = noop } = services || {}
	return (
		<StyledOutlineButton variant={variant} onClick={onClick} $maxwidth={maxwidth} $maxheight={maxheight} $centered={centered} {...props}>
			{icon}{text}
		</StyledOutlineButton>
	)
}