import {
	highlightThread,
	formatMessagesForExport,
} from '../helpers.js'

describe('Parameterized Test Cases', () => {
	// Test Cases for highlightThread
	test.each([
		[[{ id: 1 }, { id: 2 }, { id: 3 }], 1, [{ id: 1, highlighted: false }, { id: 2, highlighted: true }, { id: 3, highlighted: false }]],
		[[{ id: 1 }, { id: 2 }, { id: 3 }], -1, [{ id: 1, highlighted: false }, { id: 2, highlighted: false }, { id: 3, highlighted: false }]],
	])('highlightThread should highlight a specific thread at an index', (threadList, index, expected) => {
		const highlightedList = highlightThread(threadList, index)
		expect(highlightedList).toEqual(expected)
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