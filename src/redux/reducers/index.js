// reducers/index.js
import { combineReducers } from '@reduxjs/toolkit'
import LLMChatPage from  './LLMChatPageSlice.js'

const rootReducer = combineReducers({
	LLMChatPage,
})

export default rootReducer