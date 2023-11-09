import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, sidebarPresets } from '../../../styles/theme.js'

// TODO: Change 5px to spaces theme
export const SideBarContainer = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: 5px;

	padding: 5px 5px 10px 5px;
	height: 98vh;
	max-width: ${props => props.$maxwidth ? `${props.$maxwidth}px` : '100%'};

	border: 1px solid red;

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
	column-gap: 5px;
`