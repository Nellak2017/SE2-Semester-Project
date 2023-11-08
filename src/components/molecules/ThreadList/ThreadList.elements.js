import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, threadListPresets } from '../../../styles/theme.js'

export const ThreadListContainer = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: 5px;

	max-width: ${props => props.$maxwidth ? `${props.$maxwidth}px` : '100%'};

	${space} 
    ${layout}
    ${typography}
    ${getPresetCSS(threadListPresets, 'variant')}
    ${getPresetCSS(threadListPresets, 'color')}
`