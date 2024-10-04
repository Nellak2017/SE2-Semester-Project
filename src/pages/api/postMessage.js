import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

// Serverless function handler
export const handler = async (req, res) => {
	const { threadID, userID, text, sentByUser } = req.body
	if ((!threadID && threadID !== 0) ||
		(!userID && userID !== 0) ||
		(!text && text !== '') ||
		sentByUser === undefined) {
		return res.status(400).json({ error: 'threadID, userID, text, and sentByUser are required parameters.' })
	}
	const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()
		const query = `
			INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) 
			VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?);
    	`
		await db.query(query, [threadID, userID, text, sentByUser])
		res.status(200).json({ success: true })
	}, e => res.status(500).json({ error: e.message }))

	return result 
}

export default handler