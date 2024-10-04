import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

// POST both user and LLM message atomically
export const handler = async (req, res) => {
	const { userID, threadID, userText, AIText } = req.body

	if (!userID || !threadID || !userText || !AIText) return res.status(400).json({ error: 'Missing required parameters.' })

	const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()
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
			return res.status(200).json({ ok: { userMessage: userText, LLMResponse: AIText } })
		} catch (e) {
			await db.query('ROLLBACK')
			return res.status(500).json({ error: e.message })
		}

	}, e => res.status(500).json({ error: e.message }))

	return result
}

export default handler