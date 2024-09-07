import axios from 'axios'
import dotenv from 'dotenv'
import { tryCatchAsync } from '../utils/result.js'

// Load environment variables from the .env file
dotenv.config()

const MODEL_NAME = "models/chat-bison-001"
const API_KEY = "AIzaSyB5I4AkOR6NjDfDS3NLdr7yfj81hCLMBXg" // TODO: Environment variable won't work for some reason. 
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
		temperature,
		candidateCount,
		topK,
		topP,
		prompt: {
			context,
			examples,
			messages,
		},
	}
	return tryCatchAsync(
		async () => axios.post(`${apiURL}?key=${API_KEY}`, requestData, headers))
}