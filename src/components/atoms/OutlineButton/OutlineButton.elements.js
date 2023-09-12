import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'


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

	// Factor the below styles out if you need to parameterize based on sizes
	padding: ${props => props.theme.spaces.small}; // factor this out if you need other sizes
	svg {
		font-size: 16px; // factor this out if you need other sizes
	}

	// ------ 
    ${space} 
    ${layout}
    ${typography}
`