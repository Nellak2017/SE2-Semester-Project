import "core-js/features/array/to-reversed"; import "core-js/features/array/to-sorted"; import "core-js/features/array/to-spliced"
import { dictMap, getNestedState } from '../businessRuleHelpers.js'
import * as fc from 'fast-check'

// --- helpers and constants
const nestedObjectWithPaths = fc.letrec(rec => fc.object({ nestedObjectWithPaths: fc.oneof(fc.string(), fc.integer(), fc.boolean(), rec('nested')) }))
const buildPathAndValue = (obj, randomSeed, depth = 0) => {
	const randomKey = Object.keys(obj)[randomSeed % Object.keys(obj).length], value = obj[randomKey]
	if (Object.keys(obj).length === 0 || randomKey.includes('.') || randomKey.trim() === '') return { path: '', value: undefined }
	if (typeof value === 'object' && value !== null) {
		const { path: nestedPath, value: nestedValue } = buildPathAndValue(value, randomSeed + 1, depth + 1)
		return { path: `${randomKey}.${nestedPath}`, value: nestedValue }
	} else { return { path: randomKey, value } }
}
const flattenObject = (obj, prefix = '') => Object.entries(obj).reduce((acc, [key, value]) => (typeof value === 'object' && value !== null)
	? { ...acc, ...flattenObject(value, prefix ? `${prefix}.${key}` : key) } : { ...acc, [key]: value }, {})
// --- property tests
describe('dictMap', () => {
	const objArb = fc.object(), funcArb = fc.func(fc.anything())
	it('1. dictMap should correctly transform all values in the dictionary based on the given function', () => {
		fc.assert(fc.property(objArb, funcArb,
			(dict, fx) => { Object.keys(dict).forEach(key => expect(dictMap(dict, fx)?.[key]).toBe(fx(dict[key]))) }
		))
	})
	it('2. dictMap should retain the same keys in the returned dictionary after applying the mapping', () => {
		fc.assert(fc.property(objArb, funcArb,
			(dict, fx) => { expect(Object.keys(dict)).toEqual(Object.keys(dictMap(dict, fx))) }
		))
	})
	it('3. dictMap should return an empty object when the input dictionary is empty', () => {
		fc.assert(fc.property(funcArb,
			(fx) => { expect(dictMap({}, fx)).toEqual({}) }
		))
	})
})

describe('getNestedState', () => {
	it('1. getNestedState should retrieve the correct value from a valid path or undefined if it has spaces in it', () => {
		fc.assert(fc.property(nestedObjectWithPaths, fc.nat(),
			(state, seed) => {
				const { path, value } = buildPathAndValue(state, seed)
				expect(getNestedState(state, path)).toEqual(value)
			}))
	})
	it('2. getNestedState should return undefined for blank paths', () => {
		fc.assert(fc.property(nestedObjectWithPaths, fc.nat({ max: 100 }),
			(state, repeat) => {
				const path = ' .'.repeat(repeat)
				expect(getNestedState(state, path)).toEqual(undefined)
			}))
	})
	it('3. getNestedState should return undefined for empty object and non-object types being accessed', () => {
		fc.assert(fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), fc.anything(),
			(primitive, any) => {
				expect(getNestedState(primitive, any)).toBe(undefined)
				expect(getNestedState({}, any)).toBe(undefined)
			}
		))
	})
})