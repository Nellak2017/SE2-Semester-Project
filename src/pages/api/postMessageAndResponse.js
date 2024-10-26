/* eslint-disable fp/no-throw */
import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

// POST both user and LLM message atomically
export const handler = async (req, res) => {
	const { userID, threadID, userText, AIText } = req.body

	if (!userID || !threadID || !userText || !AIText) return res.status(400).json({ error: 'Missing required parameters.' })

	const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()

		// 1. Check if the messages is below the message limit and if it isn't, return an error
		// Check the number of messages for the user in the given thread
        const countQuery = `
            SELECT COUNT(*) AS messageCount
            FROM Messages
            WHERE ThreadID = ? AND UserID = ?;
        `
        const countResult = await db.query(countQuery, [threadID, userID])
        const messageCount = countResult[0][0].messageCount
        if (messageCount >= 150) return res.status(403).json({ error: 'User has reached the maximum limit of 150 messages in this thread.' })

		// 2. Do message posting transaction
		await db.query('START TRANSACTION')

		try {
			const userMessageResult = await db.query(
				'INSERT INTO Messages (Text, UserID, ThreadID, SentByUser) VALUES (?, ?, ?, ?)',
				[userText, userID, threadID, 'user']
			)
			if (!userMessageResult || userMessageResult.affectedRows === 0) throw new Error('The transaction failed because it could not insert the user message.')

			const LLMMessageResult = await db.query(
				'INSERT INTO Messages (Text, UserID, ThreadID, SentByUser) VALUES (?, ?, ?, ?)',
				[AIText, userID, threadID, 'model']
			)
			if (!LLMMessageResult || LLMMessageResult.affectedRows === 0) throw new Error('The transaction failed because it could not insert the AI message.')

			await db.query('COMMIT')
			return res.status(200).json({ userMessage: userText, LLMResponse: AIText })
		} catch (e) {
			await db.query('ROLLBACK')
			return res.status(500).json({ error: 'Messages rolled back, failed to insert User and AI messages.' }) // e.message
		}

	}, _ => res.status(500).json({ error: 'Internal Server Error.' })) // e.message

	return result
}

export default handler