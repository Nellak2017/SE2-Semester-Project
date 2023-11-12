import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'

export const ErrorContainer = styled.span`
	height: fit-content;
	padding: ${props => props.theme.spaces.small};
	border-radius: ${props => props.theme.spaces.small};

	background-color: ${props => props.theme.colors.dangerDark}50;
	border: 1px solid ${props => props.theme.colors.danger};

	&:hover {
		background-color: ${props => props.theme.colors.dangerDarkActive}50;
	}

	${space} 
    ${layout}
    ${typography}
`