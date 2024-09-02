import {
	addThread, // newChat
	deleteThread, // deleteThreadThunk 
	setTemperature, // temperatureUpdate
	setTypingSpeed, // typingSpeedUpdate
	setUserId, // logout potentially
	setUserInput, // userInputSubmit
	// whatever would be used for onScroll?
} from '../reducers/LLMChatPageSlice.js'

// TODO: Do these need try/catch?
// TODO: Add API calls and other required actions to these thunks

// Initial fetch of data
// TODO: Create

// initial userId update
export const initialUserIdUpdate = userId => dispatch => {
	dispatch(setUserId(userId))
}

export const newChat = ({ userId, thread }) => dispatch => {
	dispatch(addThread(thread))
	// POST requests using userId to make a new thread
}

export const deleteThreadThunk = ({ userId, index }) => dispatch => {
	dispatch(deleteThread(index))
	// DELETE requests using userId to delete a thread
}

export const temperatureUpdate = ({ userId, temperature }) => dispatch => {
	dispatch(setTemperature(temperature))
	console.log("Implement thunk for temperature")
	console.log(temperature)
	// POST requests using userId to update temperature field
}

export const typingSpeedUpdate = ({ userId, typingSpeed }) => dispatch => {
	dispatch(setTypingSpeed(typingSpeed))
	console.log("Implement thunk for typing speed")
	console.log(typingSpeed)
	// POST requests using userId to update typing field
}

// TODO: Log in thunk
// TODO: Log out thunk

export const userInputSubmit = ({ userId, userInput }) => dispatch => {
	dispatch(setUserInput(userInput))
	// POST requests to LLM using userId to get GPT response of some kind
}