import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

export const handler = async (req, res) => {
	const { userID, threadName } = req.body
	if ((!userID && userID !== 0) || !threadName) return res.status(400).json({ error: 'Both userID and threadName are required parameters and must not be missing.' })

	const result = await tryCatchAsyncPlain(async () => {
		const db = await connectToDatabase()
		// 1. Check number of threads for user
		const countQuery = `
			SELECT COUNT(*) AS threadCount
			FROM Threads
			WHERE UserID = ?;
		`
		const countResult = await db.query(countQuery, [userID])
		const threadCount = countResult[0][0].threadCount
		if (threadCount >= 10) return res.status(403).json({ error: 'User has reached the maximum limit of 10 threads.' })

		// 2. If number of threads is less than 10, insert new thread
		const query = `
			INSERT INTO Threads (Name, UserID)
			VALUES (?, ?);
    	`
		const result = await db.query(query, [threadName, userID])
		const newThreadID = result[0].insertId
		res.status(200).json({ message: 'Thread created successfully.', newThreadID })
	}, e => res.status(500).json({ error: 'Internal Server Error.' })) // e.message (security vulnerability)

	return result 
}

export default handler