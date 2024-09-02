import { ThreadListContainer } from './ThreadList.elements'
import Thread from '../Thread/Thread.js'

function ThreadList({
	state = {
		variant,
		maxwidth,
		threads,
		threadListenerList,
		trashListenerList,
	},
	...props
}) {
	const { variant, maxwidth, threads, threadListenerList, trashListenerList } = state || {}

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
			{threads?.map((info, key) => {
				const lowercaseInfo = convertKeysToLowerCase(info)
				// everything is lowercased to ensure consistency
				const { variant, name, threadid, highlighted, maxwidth, maxheight } = lowercaseInfo
				const threadState = {
					variant,
					name,
					idno: threadid || key,
					highlighted,
					maxwidth,
					maxheight,
				}
				const threadServices = {
					threadListener: () => handleLinkClick(key),
					trashListener: () => handleTrashClick(key),
				}
				return (
					<Thread
						state={threadState}
						services={threadServices}
						key={`thread-trash-icon-${key}`}
					/>
				)
			}
			)}
		</ThreadListContainer>
	)
}

export default ThreadList