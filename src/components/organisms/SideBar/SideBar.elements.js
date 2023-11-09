import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, sidebarPresets } from '../../../styles/theme.js'

// TODO: Change 5px to spaces theme
export const SideBarContainer = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: ${props => props.theme.spaces.smaller}; // 4px
	padding: ${props => props.theme.spaces.smaller} ${props => props.theme.spaces.smaller} ${props => props.theme.spaces.small} ${props => props.theme.spaces.smaller};
	height: 98vh;
	max-width: ${props => props.$maxwidth ? `${props.$maxwidth}px` : '100%'};

	.last {
		margin-top: auto;
	}

	${space} 
    ${layout}
    ${typography}
    ${getPresetCSS(sidebarPresets, 'variant')}
    ${getPresetCSS(sidebarPresets, 'color')}
`

export const IconContainer = styled.div`
	display: flex;
	column-gap: ${props => props.theme.spaces.smaller}; // 4px
`