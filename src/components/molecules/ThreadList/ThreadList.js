import { ThreadListContainer } from './ThreadList.elements'
import { VARIANTS } from '../../utils/constants'
import Thread from '../Thread/Thread.js'

// TODO: Add listeners to each thread. It should re-direct to a certain page onClick
function ThreadList({
	variant = VARIANTS.dark,
	color,
	maxwidth,
	threads
}) {
	return (
		<ThreadListContainer variant={variant} color={color} $maxwidth={maxwidth}>
			{threads?.map((info, key) => (
				<Thread
					variant={info?.variant}
					color={info?.color}
					title={info?.title}
					idno={info?.idno || key}
					highlighted={info?.highlighted}
					maxwidth={info?.maxwidth}
					maxheight={info?.maxheight}
					key={`thread-trash-icon-${key}`}
				/>
			))}
		</ThreadListContainer>
	)
}

export default ThreadList