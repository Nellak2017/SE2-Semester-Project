import { FiMessageSquare, FiTrash2 } from 'react-icons/fi'
import { ThreadContainerStyled, IconContainer } from './Thread.elements'

function Thread({
	variant = 'dark',
	color,
	title = 'Test Title Test Titledddddd',
	idno = -1,
	highlighted = true
}) {
	return (
		<ThreadContainerStyled
			$maxwidth={244}
			$maxheight={44}
			$variant={variant}
			$color={color}
			$highlighted={highlighted}>
			<IconContainer>
				<FiMessageSquare id={`thread-message-icon-${idno}`} />
				<p id={`thread-title-${idno}`}>{title}</p>
				<FiTrash2 id={`thread-trash-icon-${idno}`} className='last-icon' />
			</IconContainer>
		</ThreadContainerStyled>
	)
}

export default Thread