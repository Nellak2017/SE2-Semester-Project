import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, llmChatPresets } from '../../../styles/theme.js'

export const ChatListContainer = styled.section`
	display: flex;
	align-items: flex-start;
	height: 100vh;
	max-width: 100%;

	${space} 
    ${layout}
    ${typography}
    ${getPresetCSS(llmChatPresets, 'variant')}
`