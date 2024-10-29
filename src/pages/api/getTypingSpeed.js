import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

export const handler = async (req, res) => {
	const { userId, threadId } = req.query
	if (!userId && userId !== 0) return res.status(400).json({ error: 'userId is the required parameter and it is missing.' })
	if (userId <= 0) return res.status(400).json({ error: 'userId must be positive and greater than 0.' })
	if (typeof parseInt(userId) !== 'number' || isNaN(userId)) return res.status(400).json({ error: 'userId must be a non-NaN number.' })

	const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()
		const query =
			`SELECT TypingSpeed FROM Threads
			 WHERE UserID = ? AND ThreadID = ?;
			`
		const dbResult = await db.query(query, [userId, threadId])
		return res.status(200).json(dbResult[0])
	}, _ => res.status(500).json({ error: 'Internal Server Error.' })) // e.message

	return result
}

export default handler