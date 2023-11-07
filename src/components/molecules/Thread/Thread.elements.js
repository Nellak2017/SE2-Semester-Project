import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, threadPresets } from '../../../styles/theme.js'

export const ThreadContainerStyled = styled.section`
	display: flex;
	align-items: center;

	border-radius: 5px;
	padding-left: 10px;
	padding-right: 10px;
	background-color: ${props => props.$highlighted === true ? props.theme.colors.lightNeutral : 'transparent'};

	max-width: ${props => props.$maxwidth ? `${props.$maxwidth}px` : '100%'};
	height: ${props => `${props.$maxheight}px`};
	width: 100%;

	* {
		font-size: 14px;
	}

    &:hover {
		cursor: pointer;
        box-shadow: ${props => props.theme.elevations.small};
		background-color: ${props => props.theme.colors.lightNeutralHover};
    }
    &:active {
		cursor: pointer;
		background-color: ${props => props.theme.colors.lightNeutralActive};
    }
    ${space} 
    ${layout}
    ${typography}
    ${getPresetCSS(threadPresets, 'variant')}
    ${getPresetCSS(threadPresets, 'color')}
`

export const IconContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	column-gap: 10px;
	width: 100%;

	p {
		vertical-align: middle;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		white-space: nowrap;
		line-height: 1.25rem;
		height: 1.25rem; 
	}

	svg {
		font-size: 20px;
	}

	svg:hover {
		cursor: pointer;
		color: ${props => props.theme.colors.primary};
	}
	svg:active {
		cursor: pointer;
		color: ${props => props.theme.colors.primaryActive};
	}

	.last-icon {
		margin-left: auto;
	}
`