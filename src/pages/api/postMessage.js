import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

// Serverless function handler
export const handler = async (req, res) => {
	const { threadId, userId, text, sentByUser } = req.body
	if ((!threadId && threadId !== 0) ||
		(!userId && userId !== 0) ||
		(!text && text !== '') ||
		sentByUser === undefined) {
		return res.status(400).json({ error: 'threadId, userId, text, and sentByUser are required parameters.' })
	}
const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()
		// 1. Check number of messages for user and given thread
		const countQuery = `
			SELECT COUNT(*) AS messageCount
			FROM Messages
			WHERE ThreadID = ? AND UserID = ?;
		`
		const countResult = await db.query(countQuery, [threadId, userId])
		const messageCount = countResult[0][0].messageCount
		if (messageCount >= 150) return res.status(403).json({ error: 'User has reached the maximum limit of 150 threads.' })

		// 2. If the number of messages is less than the limit, then POST
		const query = `
			INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) 
			VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?);
    	`
		await db.query(query, [threadId, userId, text, sentByUser])
		res.status(200).json({ message: 'Message added successfully.' })
		return null
	}, _ => res.status(500).json({ error: 'Internal Server Error.' })) // e.message

	return result 
}

export default handler