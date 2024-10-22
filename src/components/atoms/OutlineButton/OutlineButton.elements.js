import styled from 'styled-components'

export const StyledOutlineButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: ${props => props.$centered ? "center" : "flex-start"};
	column-gap: ${props => props.theme.spaces.small};
	background: transparent;
	outline: 1px solid ${props => props.theme.colors.lightNeutralLight}50; // 50% transparent
	&:hover { background-color: ${props => props.theme.colors.lightNeutralLight}20; }
	&:active { background-color: ${props => props.theme.colors.lightNeutralActive}; }
	max-width: ${props => props.$maxwidth ? props.$maxwidth + 'px' : '100%'}; // optional max-width prop
	width: 100%; 
	min-height: ${props => props.$maxheight ? props.$maxheight + 'px' : '100%'};
	padding: ${props => props.theme.spaces.small}; 
	svg { font-size: ${props => props.theme.fontSizes.medium}; }
`