import {
	highlightThread,
	indexOfCurrentlyHighlighted,
	updateObjInList,
	apiRelevantFields,
	formatMessagesForExport,
} from './helpers'

describe('Parameterized Test Cases', () => {
	// Test Cases for highlightThread
	test.each([
		[[{ id: 1 }, { id: 2 }, { id: 3 }], 1, [{ id: 1, highlighted: false }, { id: 2, highlighted: true }, { id: 3, highlighted: false }]],
		[[{ id: 1 }, { id: 2 }, { id: 3 }], -1, [{ id: 1, highlighted: false }, { id: 2, highlighted: false }, { id: 3, highlighted: false }]],
	])('highlightThread should highlight a specific thread at an index', (threadList, index, expected) => {
		const highlightedList = highlightThread(threadList, index)
		expect(highlightedList).toEqual(expected)
	})

	// Test Cases for indexOfCurrentlyHighlighted
	test.each([
		[[{ id: 1, highlighted: false }, { id: 2, highlighted: true }, { id: 3, highlighted: false }], 1],
		[[{ id: 1, highlighted: false }, { id: 2, highlighted: false }, { id: 3, highlighted: false }], -1],
	])('indexOfCurrentlyHighlighted should return the index of the highlighted thread', (threadList, expected) => {
		const index = indexOfCurrentlyHighlighted(threadList)
		expect(index).toBe(expected)
	})

	// Test Cases for updateObjInList
	test.each([
		[[{ id: 1 }, { id: 2 }, { id: 3 }], 1, 'name', 'Updated', [{ id: 1 }, { id: 2, name: 'Updated' }, { id: 3 }]],
		[[{ id: 1 }, { id: 2 }, { id: 3 }], 0, 'name', 'Updated', [{ id: 1, name: 'Updated' }, { id: 2 }, { id: 3 }]],
	// eslint-disable-next-line max-params
	])('updateObjInList should update an object in a list', (objList, index, propertyName, propertyValue, expected) => {
		const updatedList = updateObjInList({ objList, index, propertyName, propertyValue })
		expect(updatedList).toEqual(expected)
	})

	// Test Cases for apiRelevantFields
	test.each([
		[[{ author: 'user1', content: 'Hello', irrelevant: 'info' }, { author: 'user2', content: 'Hi' }], [{ author: 'user2', content: 'Hi' }, { author: 'user1', content: 'Hello' }]],
		[[{ author: 'user1', content: 'Hello' }, { author: 'user2', irrelevant: 'info' }], [{ author: 'user2', content: undefined }, { author: 'user1', content: 'Hello' }]],
		[[], []],
	])('apiRelevantFields should return only lists of objects with "author" and "content" fields. It should also reverse order.', (arrayOfObjects, expected) => {
		const relevantFields = apiRelevantFields(arrayOfObjects)
		expect(relevantFields).toEqual(expected)
	})

	// Test Cases for formatMessagesForExport
	test.each([
		[[{ author: 'user1', content: 'Hello' }, { author: 'user2', content: 'Hi' }], 'user2: Hi\nuser1: Hello'],
		[[], ''],
	])('formatMessagesForExport should format messages for export', (messages, expected) => {
		const formattedMessages = formatMessagesForExport(messages)
		expect(formattedMessages).toBe(expected)
	})
})