import { FiMessageSquare, FiTrash2 } from 'react-icons/fi'
import { ThreadContainerStyled, IconContainer } from './Thread.elements'
import { VARIANTS } from '../../utils/constants'

function Thread({
	variant = VARIANTS.dark,
	color,
	title = 'Test Title Test Titledddddd',
	idno = 0,
	highlighted = false,
	maxwidth = 244,
	maxheight = 44
}) {
	return (
		<ThreadContainerStyled
			$maxwidth={maxwidth}
			$maxheight={maxheight}
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