import axios from 'axios'
import dotenv from 'dotenv'
import { tryCatchAsync } from '../utils/result.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Load environment variables from the .env file
dotenv.config()

const MODEL_NAME = "models/chat-bison-001"
const API_KEY = "AIzaSyDkDhb17D5YFfq3EUCrOxcPdex2w_JkXCQ" // "AIzaSyB5I4AkOR6NjDfDS3NLdr7yfj81hCLMBXg" // TODO: Environment variable won't work for some reason. 
const headers = { 'Content-Type': 'application/json' }
const apiURL = `https://generativelanguage.googleapis.com/v1beta3/models/chat-bison-001:generateMessage` // ?key=${API_KEY}

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })


// TODO: Migrate to Gemini model
// https://ai.google.dev/gemini-api/docs/text-generation?lang=node
// https://ai.google.dev/docs/migration_guide
// https://ai.google.dev/api/models#models_get-SHELL

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
	const result = tryCatchAsync(async () => axios.post(`${apiURL}?key=${API_KEY}`, requestData, headers), e => e?.response?.data?.error || e?.message)
	return result
}

/*
# PaLM -> Gemni updates:

## messages is now history with a more nested structure

### old (according to migration guide: https://ai.google.dev/docs/migration_guide)
chat.messages = [
	{'author': '0', 'content': 'Hello'},
	{'author': '1', 'content': 'Hello! How can I help you today?'},
	{'author': '0', 'content': "Just chillin'"},
	{'author': '1','content': "That's great! I'm glad you're able to relax and take some time for yourself. What are you up to today?"}
]

### new (according to migration guide: https://ai.google.dev/docs/migration_guide)
chat.history = [
	{role: "user", parts: [{ text: "Hello." }]},
	{role: "assistant", parts: [{ text: "Greetings! How may I assist you today?" }]},
	{role: "user", parts: [{ text: "Just chillin" }]},
	{role: "assistant", parts: [{ text: "That's great! I'm glad you're able to relax and take some time for yourself. What are you up to today?" }]},
]

## generationConfig is used instead of having the data at the top of the response body

### old (from decomissioned docs: https://ai.google.dev/api/palm#v1beta.models.generateMessage)
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

### new (from example: https://ai.google.dev/gemini-api/docs/text-generation?lang=rest)
const requestData = {
		contents: {
		    [
			   ...see above chat.history (note: it is contents and not history, fucking counter intuitive so shit omg)
			   no clear way to set context nor examples based on shitty docs
			],
		},
		generationConfig: {
			temperature, // number
			candidateCount, // int
			topK, // int
			topP, // number
		}
	}
*/