import styled from 'styled-components'

export const Alert = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	row-gap: ${props => props.theme.fontSizes.extraSmall};
	margin: 25% auto; // for centering the Alert
	padding: ${props => props.theme.fontSizes.extraSmall};
	border-radius: ${props => props.theme.fontSizes.extraSmall};
	background-color: ${props => props.theme.colors.darkNeutralDark};
	box-shadow: ${props => props.theme.elevations.extraLarge};	
	width: 500px;
`
export const Title = styled.h1`
	font-size: ${props => props.theme.fontSizes.large};
	font-weight: bold;
`
export const ErrorMessage = styled.p`
	font-size: ${props => props.theme.fontSizes.medium};
	width: 400px;
	text-overflow: wrap;
	word-wrap: break-word; /* Allow words to break */
    overflow-wrap: break-word; /* Break long words if necessary */
    white-space: normal; /* Allow wrapping of text */
	background-color: ${props => props.theme.colors.darkNeutral};
	border-radius: ${props => props.theme.fontSizes.extraSmall};
	padding: ${props => props.theme.fontSizes.extraSmall};
	box-shadow: ${props => props.theme.elevations.medium};
`
export const RetryButton = styled.button`& :hover { box-shadow: ${props => props.theme.elevations.large};}`