import { connectToDatabase } from "./utils/db"

export const handler = async (req, res) => {
	try {
		const db = await connectToDatabase()
		const { userID, threadName } = req.body

		if (!userID || !threadName) return res.status(400).json({ error: 'Both userID and threadName are required parameters and must not be missing.' })

		const query = `
			INSERT INTO Threads (Name, UserID)
			VALUES (?, ?);
    	`
		const result = await db.query(query, [threadName, userID])
		const newThreadID = result[0].insertId
		res.status(200).json({ message: 'Thread created successfully.', newThreadID: newThreadID})
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Internal Server Error', details: e.message })
	}
}

export default handler