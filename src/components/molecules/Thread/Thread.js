import { useCallback } from 'react'
import { FiMessageSquare, FiTrash2 } from 'react-icons/fi'
import { ThreadContainerStyled, IconContainer } from './Thread.elements'
import { VARIANTS } from '../../utils/constants'
import { noop } from '../../../utils/helpers'

export default function Thread({ state, services, ...props }) {
	const { variant = VARIANTS.dark, name = 'Test name Test name', idno = 0, highlighted = false, maxwidth = 244, maxheight = 44, } = state || {}
	const { threadListener = noop, trashListener = noop } = services || {}
	const handleThreadClick = useCallback(() => { threadListener() }, [threadListener])
	const handleTrashClick = useCallback(e => { e.stopPropagation(); trashListener() }, [trashListener])
	return (
		<ThreadContainerStyled $maxwidth={maxwidth} $maxheight={maxheight} $variant={variant} $highlighted={highlighted} className={'thread-container'} onClick={handleThreadClick}{...props}>
			<IconContainer>
				<FiMessageSquare id={`thread-message-icon-${idno}`} />
				<p id={`thread-name-${idno}`}>{name}</p>
				<FiTrash2 id={`thread-trash-icon-${idno}`} className='last-icon' onClick={handleTrashClick} />
			</IconContainer>
		</ThreadContainerStyled>)
}
