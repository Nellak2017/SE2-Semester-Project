import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, sidebarPresets } from '../../../styles/theme.js'

// TODO: Change 5px to spaces theme
export const SideBarContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	row-gap: ${props => props.theme.spaces.smaller}; // 4px
	padding: ${props => props.theme.spaces.smaller} ${props => props.theme.spaces.smaller} ${props => props.theme.spaces.small} ${props => props.theme.spaces.smaller};
	height: 100%;
	max-width: ${props => props.$maxwidth ? `${props.$maxwidth}px` : '100%'};
	width: 100%;
	background-color: ${props => props.theme.colors.darkNeutralDark};

	.last {
		margin-top: auto;
		text-align: center;
		font-size: 16px;
	}

	& section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		row-gap: ${props => props.theme.spaces.smaller};
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
	padding-right: ${props => props.theme.spaces.small}; // 8px
`

export const SliderContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	& div {
		width: 80%;
	}
`