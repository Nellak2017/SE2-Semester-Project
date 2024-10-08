import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

// Serverless function handler
export const handler = async (req, res) => {
	const { threadID, newTemperature } = req.body
	if (!threadID && threadID !== 0) return res.status(400).json({ error: 'threadID is a required parameter and is missing.' })
	if (!newTemperature && newTemperature !== 0) return res.status(400).json({ error: 'newTemperature is a required parameter and is missing.' })

	const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()
		const query = `
			UPDATE Threads
			SET Temperature = ?
			WHERE ThreadID = ?;
    	`
		await db.query(query, [newTemperature, threadID])
		res.status(200).json({ message: 'Temperature updated successfully.' })
	}, e => res.status(500).json({ error: 'Internal Server Error.' })) // e.message

	return result
}

export default handler