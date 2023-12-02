import { connectToDatabase } from "./utils/db"

// Serverless function handler
export const handler = async (req, res) => {
	try {
		// Connect to db
		const db = await connectToDatabase()

		// Extract parameters from the request query
		const { threadID, userID, text, sentByUser } = req.body

		// Check if all required parameters are provided
		if ((!threadID && threadID !== 0) ||
			(!userID && userID !== 0) ||
			(!text && text !== '') ||
			sentByUser === undefined) {
			return res.status(400).json({ error: 'threadID, userID, text, and sentByUser are required parameters.' });
		}

		// POST message operation
		const query = `
			INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) 
			VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?);
    	`

		await db.query(query, [threadID, userID, text, sentByUser])

		// Send a success response
		res.status(200).json({ success: true })
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

export default handler