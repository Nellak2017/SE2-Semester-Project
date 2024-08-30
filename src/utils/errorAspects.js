// This file contains Error Aspects which decouple error handling from logic
import {
	highlightThread,
	updateObjInList
} from './helpers.js'

// --- Error Aspects with default functions
// Error Aspects are abbreviated to 'EA'
// Error Aspect bindings are abbreviated to 'EAB'

// ex: highlightThreadEA()(threadList)
const highlightThreadEA = (fn = highlightThread) => (threadList, index = 0) => {
	if (!threadList || index > threadList?.length) return []
	if (index < 0) return threadList.map(e => ({ ...e, highlighted: false }))
	return fn(threadList, index)
}

const updateObjInListEA = (fn = updateObjInList) => ({ objList, index, propertyName, propertyValue }) => {
	if (index < 0 || index === undefined || isNaN(index) || index > objList?.length) return objList
	return fn({ objList, index, propertyName, propertyValue })
}

// --- Error Aspect convinent bindings with default functions

// ex: highlightThreadEAB(threadList)
const highlightThreadEAB = (threadList, index) => highlightThreadEA()(threadList, index)
const updateObjInListEAB = ({ objList, index, propertyName, propertyValue }) => updateObjInListEA()({ objList, index, propertyName, propertyValue })