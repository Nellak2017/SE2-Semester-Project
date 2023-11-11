import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, chatListPresets } from '../../../styles/theme.js'

export const ChatListContainer = styled.section`
	display: flex;
	flex-direction: column;
	width: 100%;
	row-gap: ${props => props.theme.spaces.small};
	height: 100%;
	align-items: center;
	justify-content: flex-end;

	${space} 
    ${layout}
    ${typography}
    ${getPresetCSS(chatListPresets, 'variant')}
    ${getPresetCSS(chatListPresets, 'color')}
`

export const MessageContainer = styled.div`
	display: flex;
	flex-direction: column-reverse;
	max-height: 100%;
	width: 100%;
	overflow-y: auto;
`