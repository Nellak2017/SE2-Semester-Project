import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

export const handler = async (req, res) => {
	const { userID, threadName } = req.body
	if ((!userID && userID !== 0) || !threadName) return res.status(400).json({ error: 'Both userID and threadName are required parameters and must not be missing.' })

	const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()
		const query = `
			INSERT INTO Threads (Name, UserID)
			VALUES (?, ?);
    	`
		const result = await db.query(query, [threadName, userID])
		const newThreadID = result[0].insertId
		res.status(200).json({ message: 'Thread created successfully.', newThreadID })
	}, e => res.status(500).json({ error: e.message }))

	return result 
}

export default handler