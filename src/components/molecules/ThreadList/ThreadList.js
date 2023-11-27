import { ThreadListContainer } from './ThreadList.elements'
import { VARIANTS } from '../../utils/constants'
import Thread from '../Thread/Thread.js'

function ThreadList({
	variant = VARIANTS.dark,
	color,
	maxwidth,
	threads,
	threadListenerList = [() => { }], // Pass to Parent
	trashListenerList = [() => { }],  // Pass to Parent
	...props
}) {

	const handleLinkClick = (index) => {
		threadListenerList && threadListenerList[index] && threadListenerList[index]()
	}

	const handleTrashClick = (index) => {
		trashListenerList && trashListenerList[index] && trashListenerList[index]()
	}

	// TODO: Extract this into seperate file and Unit test
	// Function to convert object keys to lowercase
	function convertKeysToLowerCase(obj) {
		return Object.keys(obj).reduce((acc, currentKey) => {
			acc[currentKey.toLowerCase()] = obj[currentKey]
			return acc
		}, {})
	}

	return (
		<ThreadListContainer variant={variant} color={color} $maxwidth={maxwidth} {...props}>
			{threads?.map((info, key) => {
				const lowercaseInfo = convertKeysToLowerCase(info)
				// everything is lowercased to ensure consistency
				return (
					<Thread
						variant={lowercaseInfo?.variant}
						color={lowercaseInfo?.color}
						name={lowercaseInfo?.name}
						idno={lowercaseInfo?.threadid || key} 
						highlighted={lowercaseInfo?.highlighted}
						maxwidth={lowercaseInfo?.maxwidth}
						maxheight={lowercaseInfo?.maxheight}
						threadListener={() => handleLinkClick(key)}
						trashListener={() => handleTrashClick(key)}
						key={`thread-trash-icon-${key}`}
					/>
				)
			}
			)}
		</ThreadListContainer>
	)
}

export default ThreadList