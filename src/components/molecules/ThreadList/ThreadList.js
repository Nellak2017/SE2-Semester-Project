import { ThreadListContainer } from './ThreadList.elements'
import { VARIANTS } from '../../utils/constants'
import Thread from '../Thread/Thread.js'

function ThreadList({
	variant = VARIANTS.dark,
	color,
	maxwidth = 244,
	threads
}) {
	return (
		<ThreadListContainer $maxwidth={maxwidth}>
			{threads?.map((info, key) => (
				<Thread
					variant={info?.variant}
					color={info?.color}
					title={info?.title}
					idno={info?.idno || key}
					highlighted={info?.highlighted}
					maxwidth={info?.maxwidth}
					maxheight={info?.maxheight}
					key={info?.idno || key}
				/>
			))}
		</ThreadListContainer>
	)
}

export default ThreadList