import styled from 'styled-components'

export const ThreadListContainer = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: 5px;
	max-width: ${props => props.$maxwidth ? `${props.$maxwidth}px` : '100%'};
`