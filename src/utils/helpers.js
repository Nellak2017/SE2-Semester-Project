// Contains many pure functions used through out the application

// Function to highlight a specific thread at an index. If index is negative, it makes everything false
export function highlightThread(threadList, index = 0) {
	if (!threadList || index > threadList.length) return []
	if (index < 0) return threadList.map(e => ({ ...e, highlighted: false }))
	return threadList.map((e, i) => {
		return i === index ?
			{ ...e, highlighted: true } :
			{ ...e, highlighted: false }
	})
}

// Function to tell the index of the currently highlighted
export function indexOfCurrentlyHighlighted(threadList) { return threadList?.findIndex(el => el.highlighted === true) }

// Function to update an Object in a list given the index, property name, and property value
export function updateObjInList(objList, index, propertyName, propertyValue) {
	if (index < 0 || index === undefined || isNaN(index) || index > objList.length) return objList
	const updatedList = [...objList]
	updatedList[index] = { ...updatedList[index], [propertyName]: propertyValue }
	return updatedList
}

const top50EnglishWords = [
	'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
	'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
	'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
	'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so',
	'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me'
]

export function generateRandomSentence({words = top50EnglishWords, min = 2, max = 5}) {
	const sentenceLength = Math.floor(Math.random() * (max - min)) + min // Random length between 2 and 5 words
	const randomWords = Array.from(
		{ length: sentenceLength },
		() => { return words[Math.floor(Math.random() * words.length)] }
	)
	const sentence = randomWords.join(' ')

	// Capitalize the first letter and add a period at the end
	return sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + '.'
}