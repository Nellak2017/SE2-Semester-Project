import { ThreadListContainer } from './ThreadList.elements'
import Thread from '../Thread/Thread.js'
import { VARIANTS } from '../../utils/constants.js'

function ThreadList({
	state,
	...props
}) {
	const {
		variant = VARIANTS.dark,
		maxwidth = 260,
		threads = [],
		threadListenerList = [() => { }],
		trashListenerList = [() => { }]
	} = state || {}

	const handleLinkClick = index => threadListenerList && threadListenerList[index] && threadListenerList[index]()
	const handleTrashClick = index => trashListenerList && trashListenerList[index] && trashListenerList[index]()

	// TODO: Extract this into seperate file and Unit test
	// Function to convert object keys to lowercase
	const convertKeysToLowerCase = obj => Object.keys(obj).reduce((acc, currentKey) => {
		acc[currentKey.toLowerCase()] = obj[currentKey]
		return acc
	}, {})

	return (
		<ThreadListContainer variant={variant} $maxwidth={maxwidth} {...props}>
			{threads?.map((info, i) => {
				const lowercaseInfo = convertKeysToLowerCase(info)
				// everything is lowercased to ensure consistency
				const { name, threadid, highlighted } = lowercaseInfo
				const threadState = {
					variant,
					maxwidth,
					maxheight: 44,
					name,
					idno: threadid || i,
					highlighted,
				}
				const threadServices = {
					threadListener: () => handleLinkClick(i),
					trashListener: () => handleTrashClick(i),
				}
				return (
					<Thread
						state={threadState}
						services={threadServices}
						key={`thread-trash-icon-${i}`}
					/>
				)
			}
			)}
		</ThreadListContainer>
	)
}

export default ThreadList