import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

export const handler = async (req, res) => {
	const { userId, threadName } = req.body
	if ((!userId && userId !== 0) || !threadName) return res.status(400).json({ error: 'Both userId and threadName are required parameters and must not be missing.' })

const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()
		// 1. Check number of threads for user
		const countQuery = `
			SELECT COUNT(*) AS threadCount
			FROM Threads
			WHERE UserID = ?;
		`
		const countResult = await db.query(countQuery, [userId])
		const threadCount = countResult[0][0].threadCount
		if (threadCount >= 10) return res.status(403).json({ error: 'User has reached the maximum limit of 10 threads.' })

		// 2. If number of threads is less than 10, insert new thread
		const query = `
			INSERT INTO Threads (Name, UserID)
			VALUES (?, ?);
    	`
		const dbResult = await db.query(query, [threadName, userId])
		const newThreadId = dbResult[0].insertId
		res.status(200).json({ message: 'Thread created successfully.', newThreadId })
		return null
	}, _ => res.status(500).json({ error: 'Internal Server Error.' })) // e.message (security vulnerability)

	return result 
}

export default handler