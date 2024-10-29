import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

export const handler = async (req, res) => {
	const { userId, threadId } = req.query
	if ((!userId && userId !== 0) || (!threadId && threadId !== 0)) return res.status(400).json({ error: 'Both userId and threadId are required parameters.' })
	const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()
		// 1. If existing messages less than or equal to 150, get them
		const query = `
			SELECT Messages.* 
			FROM Messages 
			JOIN Users ON Messages.UserID = Users.UserID 
			JOIN Threads ON Messages.ThreadID = Threads.ThreadID 
			WHERE Users.UserID = ? 
			AND Threads.ThreadID = ?
			ORDER BY Messages.MessageID DESC
			LIMIT 150;
	  	` // GET messages operation with pagination and chronological order
		const dbResult = await db.query(query, [userId, threadId]) // maxNumber - minNumber + 1, minNumber
		res.status(200).json(dbResult[0])
	}, _ => res.status(500).json({ error: 'Internal Server Error.' })) // e.message
	return result
}

export default handler