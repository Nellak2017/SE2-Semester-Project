import { ThreadListContainer } from './ThreadList.elements'
import Thread from '../Thread/Thread.js'
import { VARIANTS } from '../../utils/constants.js'
import { convertKeysToLowerCase } from '../../../utils/helpers.js'

export default function ThreadList({ state, services, ...props }) {
	const {
		variant = VARIANTS.dark,
		userId = 0,
		maxwidth = 260,
		threads = [],
	} = state || {}
	const {
		deleteThread = () => { },
		openExistingThread = () => { }
	} = services || {}

	return (
		<ThreadListContainer variant={variant} $maxwidth={maxwidth} {...props}>
			{threads?.map((info, index) => {
				// everything is lowercased to ensure consistency
				const { name, threadid, highlighted } = convertKeysToLowerCase(info)
				const threadState = {
					variant,
					maxwidth,
					maxheight: 44,
					name,
					idno: threadid || index,
					highlighted,
				}
				const threadServices = {
					threadListener: () => openExistingThread({ userId, index, threadid }),
					trashListener: () => deleteThread({ userId, index, threadid }),
				}
				return (
					<Thread
						state={threadState}
						services={threadServices}
						key={`thread-trash-icon-${threadid}`}
					/>
				)
			})}
		</ThreadListContainer>
	)
}