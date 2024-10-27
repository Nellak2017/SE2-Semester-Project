import axios from 'axios'
import dotenv from 'dotenv'
import { tryCatchAsync } from '../utils/result.js' // skipcq: JS-C1001
dotenv.config() // TODO: Make a model drop down component that lets you choose any of the available models
const headers = { 'Content-Type': 'application/json' }, apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent?key=${process.env.NEXT_PUBLIC_PALM_API_KEY}`
export const generatePalmMessage = async ({ contents = [], temperature = 0.5, candidateCount = 1, topK = 40, topP = 0.95 }) => {
	const requestData = { contents, generationConfig: { temperature, candidateCount, topK, topP } }
	const result = await tryCatchAsync(
		async () => {
			const res = await axios.post(apiURL, requestData, headers)
			return res?.data
		},
		e => e?.response?.data?.error || e?.message)
	return result
}