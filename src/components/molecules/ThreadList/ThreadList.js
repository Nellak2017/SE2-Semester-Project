import { ThreadListContainer } from './ThreadList.elements'
import Thread from '../Thread/Thread.js'
import { VARIANTS } from '../../utils/constants.js'
import { noop } from '../../../utils/helpers.js'

export default function ThreadList({ state, services, ...props }) {
	const { variant = VARIANTS.dark, userId = 0, maxwidth = 260, threads = [], } = state || {}
	const { deleteThread = noop, openExistingThread = noop } = services || {}
	return (
		<ThreadListContainer variant={variant} $maxwidth={maxwidth} {...props}>
			{threads?.map((info, index) => {
				const { Name, ThreadID, highlighted } = info
				const threadState = {
					variant,
					maxwidth,
					maxheight: 44,
					name: Name,
					idno: ThreadID || index,
					highlighted,
				}
				const threadServices = { threadListener: () => openExistingThread({ userId, index, threadid: ThreadID }), trashListener: () => deleteThread({ userId, index, threadid: ThreadID }), }
				return (<Thread state={threadState} services={threadServices} key={`thread-trash-icon-${ThreadID}`} />)
			})}
		</ThreadListContainer>
	)
}