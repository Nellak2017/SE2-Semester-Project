import { FiMessageSquare, FiTrash2 } from 'react-icons/fi'
import { ThreadContainerStyled, IconContainer } from './Thread.elements'
import { VARIANTS } from '../../utils/constants'

// TODO: change user: 'gpt'|'user' to use boolean instead

function Thread({
	variant = VARIANTS.dark,
	color,
	title = 'Test Title Test Title',
	idno = 0,
	highlighted = false,
	maxwidth = 244,
	maxheight = 44,
	threadListener = () => { }, // Listener for clicking on the Thread itself, almost like a link
	trashListener = () => { }, // Listener for clicking on the Trash icon.
	...props
}) {
	return (
		<ThreadContainerStyled
			$maxwidth={maxwidth}
			$maxheight={maxheight}
			$variant={variant}
			$color={color}
			$highlighted={highlighted}
			className={'thread-container'}
			onClick={() => threadListener()}
			{...props}>
			<IconContainer>
				<FiMessageSquare id={`thread-message-icon-${idno}`} />
				<p id={`thread-title-${idno}`}>{title}</p>
				<FiTrash2
					id={`thread-trash-icon-${idno}`}
					className='last-icon'
					onClick={e => { e.stopPropagation(); trashListener() }}
				/>
			</IconContainer>
		</ThreadContainerStyled>
	)
}

export default Thread