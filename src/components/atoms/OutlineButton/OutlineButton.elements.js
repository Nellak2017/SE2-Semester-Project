import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, outlineButtonPreSets } from '../../../styles/theme.js'

export const StyledOutlineButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	column-gap: ${props => props.theme.spaces.small};
	background: transparent;
	outline: 1px solid ${props => props.theme.colors.lightNeutralLight}50; // 50% transparent

	&:hover {
		background-color: ${props => props.theme.colors.lightNeutralLight}20;
	}

	// If maxwidth prop is defined, we use this as the width of the button, otherwise it is normal
	max-width: ${props => props.maxwidth ? props.maxwidth + 'px' : 'inherit'}; // optional max-width prop
	width: ${props => props.maxwidth ? '100%' : 'inherit'}; 

	// TODO: In the theme.js test the effect of different sizes and fix. I sloppily put it in there
	// TODO: Factor the below styles out if you need to parameterize based on sizes
	padding: ${props => props.theme.spaces.small}; 
	svg {
		font-size: ${props => props.theme.fontSizes.medium}; 
	}

	// ------ 
    ${space} 
    ${layout}
    ${typography}
	${getPresetCSS(outlineButtonPreSets, 'variant')}
	${getPresetCSS(outlineButtonPreSets, 'size')}
	${getPresetCSS(outlineButtonPreSets, 'color')}
`