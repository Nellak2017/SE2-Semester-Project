import styled, { css } from 'styled-components'
import { getPresetCSS } from '../../../styles/theme.js'

const chatPresets = { user: { user: css` background-color: ${props => props.theme.colors.darkNeutral}; `, model: css` background-color: ${props => props.theme.colors.lightNeutral};`},}
export const ChatContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: ${props => props.theme.spaces.small};
	max-width: 100%;
	width: 100%;
	* { font-size: ${props => props.theme.fontSizes.medium};}
    ${getPresetCSS(chatPresets, 'user')}
`
export const MessageContainer = styled.div`
	display: flex;
	column-gap: ${props => props.theme.spaces.medium};
	padding-right: ${props => props.theme.spaces.medium};
	max-width: 766px;
	width: 100%;
	min-height: 84px;
`
export const LogoContainer = styled.div`svg { font-size: ${props => props.theme.fontSizes.larger}; }`
export const Message = styled.pre`
	font-size: ${props => props.theme.fontSizes.small};
	font-weight: 300;
	width: 100%;
	white-space: pre-wrap;
  	word-wrap: break-word;
	padding-top: ${props => props.theme.spaces.smaller};
`
export const CodeHeader = styled.div`
	background-color: ${props => props.theme.colors.darkNeutralDarker};
	border-radius: ${props => props.theme.spaces.smaller};
	width: 100%;
	p { padding: ${props => props.theme.spaces.smaller} ${props => props.theme.spaces.medium} 0 ${props => props.theme.spaces.medium};}
`
export const ErrorContainer = styled.div`
	font-size: ${props => props.theme.fontSizes.small};
	font-weight: 300;
	width: 100%;
	white-space: pre-wrap;
  	word-wrap: break-word;
	padding-top: ${props => props.theme.spaces.smaller};
`