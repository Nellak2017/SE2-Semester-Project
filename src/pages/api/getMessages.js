import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

export const handler = async (req, res) => {
	const { userID, threadID } = req.query

	if ((!userID && userID !== 0) || (!threadID && threadID !== 0)) return res.status(400).json({ error: 'Both userID and threadID are required parameters.' })

	const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()
		const query = `
			SELECT Messages.* 
			FROM Messages 
			JOIN Users ON Messages.UserID = Users.UserID 
			JOIN Threads ON Messages.ThreadID = Threads.ThreadID 
			WHERE Users.UserID = ? 
			AND Threads.ThreadID = ?
			ORDER BY Messages.MessageID DESC;
	  	` // GET messages operation with pagination and chronological order
		const result = await db.query(query, [userID, threadID]) // maxNumber - minNumber + 1, minNumber
		res.status(200).json(result[0])
	}, e => res.status(500).json({ error: e.message }))

	return result
}

export default handler