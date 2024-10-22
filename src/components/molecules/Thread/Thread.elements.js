import styled from 'styled-components'

export const ThreadContainerStyled = styled.section`
	display: flex;
	align-items: center;
	border-radius: 5px;
	background-color: ${props => props.$highlighted === true ? props.theme.colors.lightNeutral : 'transparent'};
	max-width: ${props => props.$maxwidth ? `${props.$maxwidth}px` : '100%'};
	height: ${props => `${props.$maxheight}px`};
	width: 100%;
	* { font-size: 14px;}
    &:hover {
		cursor: pointer;
        box-shadow: ${props => props.theme.elevations.small};
		background-color: ${props => props.theme.colors.lightNeutralHover};
    }
	// This weird :active thing is so that Trashcan :active can be independent from parent
	// See also: https://stackoverflow.com/questions/33114318/css-prevent-parent-element-getting-active-pseudoclass-when-child-element-is-cl
	&:active:not(:has(:active)) {
		cursor: pointer;
		background-color: ${props => props.theme.colors.lightNeutralActive};
	}
`

export const IconContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	column-gap: 10px;
	width: 100%;
	height: 100%; // Added in so that Clicking Trash Can is independent from Nav
	padding-left: 10px; // Added in so that Clicking Trash Can is independent from Nav
	padding-right: 10px; // Added in so that Clicking Trash Can is independent from Nav
	border-radius: 5px; // Added in so that Clicking Trash Can is independent from Nav
	p {
		vertical-align: middle;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		white-space: nowrap;
		line-height: 1.25rem;
		height: 1.25rem;
		width: 80%; // to fix small trash can issue 
	}
	svg { font-size: 20px; }
	svg:hover {
		cursor: pointer;
		color: ${props => props.theme.colors.primary};
	}
	svg:active {
		cursor: pointer;
		color: ${props => props.theme.colors.primaryActive};
	}
	// This weird :active thing is so that Trashcan :active can be independent from parent
	// See also: https://stackoverflow.com/questions/33114318/css-prevent-parent-element-getting-active-pseudoclass-when-child-element-is-cl
	&:active:not(:has(:active)) {
		cursor: pointer;
		background-color: ${props => props.theme.colors.lightNeutralActive};
	}
	.last-icon { margin-left: auto; }
`