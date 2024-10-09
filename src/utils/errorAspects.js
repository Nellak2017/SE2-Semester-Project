// This file contains Error Aspects which decouple error handling from logic
import {
	highlightThread,
} from './helpers.js'

// --- Error Aspects with default functions
// Error Aspects are abbreviated to 'EA', Error Aspect bindings are abbreviated to 'EAB'

// ex: highlightThreadEA()(threadList)
const highlightThreadEA = (fn = highlightThread) => (threadList, index = 0) => {
	if (!threadList || index > threadList?.length) return []
	if (index < 0) return threadList.map(e => ({ ...e, highlighted: false }))
	return fn(threadList, index)
}

// --- Error Aspect convinent bindings with default functions

// ex: highlightThreadEAB(threadList)
const highlightThreadEAB = (threadList, index) => highlightThreadEA()(threadList, index)