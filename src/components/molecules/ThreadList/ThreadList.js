import { ThreadListContainer } from './ThreadList.elements'
import { VARIANTS } from '../../utils/constants'
import Thread from '../Thread/Thread.js'

function ThreadList({
	variant = VARIANTS.dark,
	color,
	maxwidth,
	threads,
	threadListenerList = [() => {}], // Pass to Parent
	trashListenerList = [() => {}],  // Pass to Parent
	...props
}) {

	const handleLinkClick = (index) => {
		threadListenerList && threadListenerList[index]()
	}

	const handleTrashClick = (index) => {
		trashListenerList && trashListenerList[index]()
	}

	return (
		<ThreadListContainer variant={variant} color={color} $maxwidth={maxwidth} {...props}>
			{threads?.map((info, key) => (
				<Thread
					variant={info?.variant}
					color={info?.color}
					title={info?.title}
					idno={info?.idno || key}
					highlighted={info?.highlighted}
					maxwidth={info?.maxwidth}
					maxheight={info?.maxheight}
					threadListener={() => handleLinkClick(key)}
					trashListener={() => handleTrashClick(key)}
					key={`thread-trash-icon-${key}`}
				/>
			))}
		</ThreadListContainer>
	)
}

export default ThreadList