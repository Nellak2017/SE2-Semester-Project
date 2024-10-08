import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

// Serverless function handler
export const handler = async (req, res) => {
	const { userID } = req.query
	if (!userID && userID !== 0) return res.status(400).json({ error: 'userID is the required parameter and it is missing.' })
	if (userID <= 0) return res.status(400).json({ error: 'userID must be positive and greater than 0.' })
	if (typeof parseInt(userID) !== 'number' || isNaN(userID)) return res.status(400).json({ error: 'userID must be a non-NaN number.' })

	const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()
		// 1. If existing threads less than or equal to 10, get them 
		const query = `
			SELECT Threads.*
			FROM Threads
			WHERE Threads.UserID = ?
			LIMIT 10;
			`
		const result = await db.query(query, [userID])
		return res.status(200).json(result[0])
	}, e => res.status(500).json({ error: 'Internal Server Error.' })) // e.message

	return result
}

export default handler