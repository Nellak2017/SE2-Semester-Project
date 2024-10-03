import axios from 'axios'
import dotenv from 'dotenv'
import { tryCatchAsync } from '../utils/result.js'

// Load environment variables from the .env file
dotenv.config()

const API_KEY = process.env.NEXT_PUBLIC_PALM_API_KEY
const headers = { 'Content-Type': 'application/json' }
const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`

export async function generatePalmMessage({
	contents = [], temperature = .5, candidateCount = 1, topK = 40, topP = .95
}) {
	const requestData = {
		contents,
		generationConfig: { temperature, candidateCount, topK, topP }
	}
	// TODO: see if you can simplify this syntax or not.
	const result = await tryCatchAsync(
		async () => {
			const res = await axios.post(apiURL, requestData, headers)
			return res?.data
		},
		e => e?.response?.data?.error || e?.message)
	return result
}