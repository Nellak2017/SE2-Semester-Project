import { FiMessageSquare, FiTrash2 } from 'react-icons/fi'
import { ThreadContainerStyled, IconContainer } from './Thread.elements'
import { VARIANTS } from '../../utils/constants'

// TODO: change user: 'gpt'|'user' to use boolean instead
function Thread({
	state,
	services,
	...props
}) {
	const {
		variant = VARIANTS.dark,
		name = 'Test name Test name',
		idno = 0,
		highlighted = false,
		maxwidth = 244,
		maxheight = 44,
	} = state || {}
	const { threadListener = () => { }, trashListener = () => { } } = services || {}
	return (
		<ThreadContainerStyled
			$maxwidth={maxwidth}
			$maxheight={maxheight}
			$variant={variant}
			$highlighted={highlighted}
			className={'thread-container'}
			onClick={() => threadListener()}
			{...props}>
			<IconContainer>
				<FiMessageSquare id={`thread-message-icon-${idno}`} />
				<p id={`thread-name-${idno}`}>{name}</p>
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