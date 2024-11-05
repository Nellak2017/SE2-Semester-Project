import { noop, highlightThread, convertMessagesToGemini, formatMessagesForExport, } from '../helpers.js'
import * as fc from 'fast-check'

const oldMessageArbitrary = fc.array(fc.record({ sentByUser: fc.boolean(), text: fc.string() }))

describe('noop', () => {
	it('1. noop should return undefined for any input', () => {
		fc.assert(fc.property(fc.anything(), input => { expect(noop(input)).toBe(undefined) }))
	})
})

describe('highlightThread', () => {
	it('1. highlightThread should highlight only one thread at the specified index', () => {
		fc.assert(fc.property(
			fc.array(fc.object(), { minLength: 1 }), fc.nat(),
			(threadList, index) => { expect(highlightThread(threadList, index % threadList.length).filter(t => t.highlighted === true)).toHaveLength(1) }
		))
	})
	it('2. highlightThread should have the same length for the input and output threadList', () => {
		fc.assert(fc.property(
			fc.array(fc.object(), { minLength: 1 }), fc.nat(),
			(threadList, index) => { expect(highlightThread(threadList, index % threadList.length)).toHaveLength(threadList.length) }
		))
	})
	it('3. highlightThread should be true at the specified index for the output list', () => {
		fc.assert(fc.property(
			fc.array(fc.object(), { minLength: 1 }), fc.nat(),
			(threadList, index) => { expect(highlightThread(threadList, index % threadList.length)[index % threadList.length].highlighted).toBe(true) }
		))
	})
})

describe('convertMessagesToGemini', () => {
	it('1. convertMessagesToGemini should result in a list that is the same length as the input', () => {
		fc.assert(fc.property(
			oldMessageArbitrary,
			(oldMessages) => { expect(convertMessagesToGemini(oldMessages)).toHaveLength(oldMessages.length) }
		))
	})
	it('2. convertMessagesToGemini should result in a list that has the correct structure', () => {
		fc.assert(fc.property(
			oldMessageArbitrary,
			(oldMessages) => {
				convertMessagesToGemini(oldMessages).forEach((message, index) => {
					expect(message).toHaveProperty('role', oldMessages[index].sentByUser)
					expect(message).toHaveProperty('parts')
					expect(message.parts).toHaveLength(1)
					expect(message.parts[0]).toHaveProperty('text', oldMessages[index].text)
				})
			}
		))
	})
	it('3. convertMessagesToGemini should result in a list that has the order preserved', () => {
		fc.assert(fc.property(
			oldMessageArbitrary,
			(oldMessages) => {
				convertMessagesToGemini(oldMessages).forEach((message, index) => {
					expect(message.role).toBe(oldMessages[index].sentByUser)
					expect(message.parts[0].text).toBe(oldMessages[index].text)
				})
			}
		))
	})
})

describe('formatMessagesForExport', () => {
	it('1. formatMessagesForExport should result in a string that is the same amount of lines as the input list length', () => {
		fc.assert(fc.property(
			oldMessageArbitrary,
			(messages) => { expect(formatMessagesForExport(messages).split('\n').filter(el => el !== '')).toHaveLength(messages.length) }
		))
	})
	it('2. formatMessagesForExport should result in a string that is the same amount of lines as the input list length', () => {
		fc.assert(fc.property(
			oldMessageArbitrary,
			(messages) => {
				messages.forEach((_, index) => {
					const resultLines = formatMessagesForExport(messages).split('\n')
					const reversedIndex = messages.length - 1 - index
					const expectedLine = `${messages[reversedIndex].sentByUser}: ${messages[reversedIndex].text}`
					expect(resultLines[index]).toBe(expectedLine)
				})
			}
		))
	})
})