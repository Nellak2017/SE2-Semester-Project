import React from 'react'
import { VARIANTS } from '../../utils/constants.js'
import { StyledOutlineButton } from './OutlineButton.elements.js'
import { BiPlus } from 'react-icons/bi'

// TODO: Pass the value of onclick to the parent component
// TODO: Fix the variant validation logic
function OutlineButton({
	variant = VARIANTS.dark,
	icon = <BiPlus />,
	text = 'New Chat',
	centered = false, // centers if true
	maxheight = 44,
	maxwidth,
	...props
}) {
	//if (!VARIANTS.includes(variant)) variant = 'dark'
	return (
		<StyledOutlineButton
			variant={variant}
			onClick={e => {e.stopPropagation()}}
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