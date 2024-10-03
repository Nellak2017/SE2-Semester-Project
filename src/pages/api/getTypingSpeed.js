import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

export const handler = async (req, res) => {
	const { userID, threadID } = req.query
	if (!userID && userID !== 0) return res.status(400).json({ error: 'userID is the required parameter and it is missing.' })
	if (userID <= 0) return res.status(400).json({ error: 'userID must be positive and greater than 0.' })
	if (typeof parseInt(userID) !== 'number' || isNaN(userID)) return res.status(400).json({ error: 'userID must be a non-NaN number.' })

	const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()
		const query =
			`SELECT TypingSpeed FROM Threads
			 WHERE UserID = ? AND ThreadID = ?;
			`
		const result = await db.query(query, [userID, threadID])
		return res.status(200).json(result[0])
	}, e => res.status(500).json({ error: e.message }))

	return result
}

export default handler