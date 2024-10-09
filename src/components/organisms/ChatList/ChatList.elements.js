import styled from 'styled-components'

export const ChatListContainer = styled.section`
	display: flex;
	flex-direction: column;
	width: 100%;
	row-gap: ${props => props.theme.spaces.small};
	height: 100%;
	align-items: center;
	justify-content: space-between;
	padding: 0 0 ${props => props.theme.spaces.medium} 0;
`

export const MessageContainer = styled.div`
	display: flex;
	flex-direction: column-reverse;
	max-height: 100%;
	width: 100%;
	overflow-y: auto;
`