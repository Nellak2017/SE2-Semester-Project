import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'

export const ButtonStyled = styled.button`
	// --- Common styles of most button variants ---
	color: #fff;
    min-width: 85px; // I want all buttons, standard width
	outline: none;
    outline: 0px solid transparent;
    border-radius: ${props => props.theme.spaces.small};
    padding: ${props => props.theme.spaces.small} ${props => props.theme.spaces.small};
    &:hover {
        box-shadow: ${props => props.theme.elevations.small};
      }
	&:active {
        box-shadow: ${props => props.theme.insets.normal};
    }
    // ------ 
    ${space} // lowest precedence
    ${layout}
    ${typography}
`