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
				const { name, threadId, highlighted } = info
				const threadState = { variant, maxwidth, maxheight: 44, name, idno: threadId || index, highlighted, }
				const threadServices = { threadListener: () => openExistingThread({ userId, index, threadId }), trashListener: () => deleteThread({ userId, index, threadId }), }
				return (<Thread state={threadState} services={threadServices} key={`thread-trash-icon-${threadId}`} />)
			})}
		</ThreadListContainer>
	)
}