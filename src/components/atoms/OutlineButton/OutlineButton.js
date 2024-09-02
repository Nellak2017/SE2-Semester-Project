import React from 'react'
import { VARIANTS } from '../../utils/constants.js'
import { StyledOutlineButton } from './OutlineButton.elements.js'
import { BiPlus } from 'react-icons/bi'

function OutlineButton({
	state = {
		variant: VARIANTS.dark,
		icon: <BiPlus />,
		text: 'New Chat',
		centered: false, // centers if true
		maxheight: 44,
		maxwidth,
	},
	services = {
		onClick: () => console.log('no service defined for this button'),
	},
	...props
}) {
	const { variant, icon, text, centered, maxheight, maxwidth } = state || {}
	const { onClick } = services || {}
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

export default OutlineButton