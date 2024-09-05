import { VARIANTS } from '../../utils/constants.js'
import { StyledOutlineButton } from './OutlineButton.elements.js'
import { BiPlus } from 'react-icons/bi'

export default function OutlineButton({ state, services, ...props }) {
	const {
		variant = VARIANTS.dark,
		icon = <BiPlus />,
		text = 'New Chat',
		centered = false, // centers if true
		maxheight = 44,
		maxwidth,
	} = state || {}
	const { onClick = () => { } } = services || {}
	return (
		<StyledOutlineButton
			variant={variant}
			//onClick={e => { e.stopPropagation() }}
			onClick={onClick}
			$maxwidth={maxwidth}
			$maxheight={maxheight}
			$centered={centered}
			{...props}
		>
			{icon}
			{text}
		</StyledOutlineButton>
	)
}