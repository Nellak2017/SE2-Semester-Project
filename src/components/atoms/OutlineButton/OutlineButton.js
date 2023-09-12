import React from 'react'
import { VARIANTS } from '../../utils/constants.js'
import { StyledOutlineButton } from './OutlineButton.elements.js'
import { BiPlus } from 'react-icons/bi'

// TODO: Pass the value of onclick to the parent component
function OutlineButton({ variant = 'dark', onclick, icon = <BiPlus />, text = 'New Chat', maxwidth }) {
	if (!VARIANTS.includes(variant)) variant = 'dark'

	return (
		<StyledOutlineButton variant={variant} onClick={onclick} maxwidth={maxwidth}>
			{icon && icon}
			{text && text}
		</StyledOutlineButton>
	)
}

export default OutlineButton