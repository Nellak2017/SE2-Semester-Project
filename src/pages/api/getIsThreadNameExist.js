import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

// True if the thread name exists for the given user, False otherwise
export const handler = async (req, res) => {
	const { userID, threadName } = req.query

	// Input validation
	if (!userID && userID !== 0) return res.status(400).json({ error: 'userID is required and is missing.' })
	if (userID <= 0) return res.status(400).json({ error: 'userID must be positive and greater than 0.' })
	if (typeof parseInt(userID) !== 'number' || isNaN(userID)) return res.status(400).json({ error: 'userID must be a non-NaN number.' })
	if (!threadName || threadName.trim() === '') return res.status(400).json({ error: 'threadName is required and is missing.' })

	const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()
		const query = `
      SELECT COUNT(*) as count
      FROM Threads
      WHERE UserID = ? AND Name = ?;
    `
		const [result] = await db.query(query, [userID, threadName])

		return result[0].count > 0
			? res.status(200).json({ exists: true })
			: res.status(200).json({ exists: false })

	}, e => res.status(500).json({ error: e.message }))

	return result
}

export default handler