import axios from 'axios'
import dotenv from 'dotenv'

// Load environment variables from the .env file
dotenv.config()

const MODEL_NAME = "models/chat-bison-001"
const API_KEY = "AIzaSyB5I4AkOR6NjDfDS3NLdr7yfj81hCLMBXg" // Environment variable won't work for some reason. 
const headers = { 'Content-Type': 'application/json' }
const apiURL = `https://generativelanguage.googleapis.com/v1beta3/models/chat-bison-001:generateMessage` // ?key=${API_KEY}

// Define a function to generate messages
export async function generatePalmMessage({
	context = "", examples = [], messages = [],
	temperature = .5, candidateCount = 1, topK = 40,
	topP = .95
}) {
	const requestData = {
		model: MODEL_NAME,
		temperature: temperature,
		candidateCount: candidateCount,
		topK: topK,
		topP: topP,
		prompt: {
			context: context,
			examples: examples,
			messages: messages,
		},
	}
	console.log('Request Body:', requestData)
	console.log('Request Headers:', headers)
	try {
		const result = await axios.post(`${apiURL}?key=${API_KEY}`, requestData, headers)
		return result
	} catch (e) {
		console.error('Error generating Palm message: ', e)
		throw e
	}
}