import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, chatPresets } from '../../../styles/theme.js'

export const ChatContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;

	min-height: 84px;
	padding: ${props => props.theme.spaces.small};
	border: 1px solid gray;

	* {
		font-size: ${props => props.theme.fontSizes.small};
	}

	${space} 
    ${layout}
    ${typography}
    ${getPresetCSS(chatPresets, 'user')}
    ${getPresetCSS(chatPresets, 'color')}
`

export const MessageContainer = styled.div`
	display: flex;
	column-gap: ${props => props.theme.spaces.medium};

	padding-right: ${props => props.theme.spaces.medium};
	width: 60%;
	min-height: 84px;
`

export const LogoContainer = styled.div`
	svg {
		font-size: ${props => props.theme.fontSizes.larger};
	}
`

export const Message = styled.pre`
	font-size: ${props => props.theme.fontSizes.small};
	font-weight: 100;
	width: 100%;
	white-space: pre-wrap;
  	word-wrap: break-word;
`

// Style copied pixel perfectly from ChatGPT
export const CodeHeader = styled.div`
	background-color: ${props => props.theme.colors.darkNeutralDarker};
	border-radius: ${props => props.theme.spaces.smaller};
	width: 100%;

	p {
		padding: ${props => props.theme.spaces.smaller} ${props => props.theme.spaces.medium} 0 ${props => props.theme.spaces.medium};
	}
`