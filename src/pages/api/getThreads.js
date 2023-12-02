import { connectToDatabase } from "./utils/db"

// Serverless function handler
export const handler = async (req, res) => {
	try {
		// Connect to db
		const db = await connectToDatabase()

		// Extract parameters from the request query
		const { userID } = req.query

		// Check if both userID and name are provided
		if (!userID && userID !== 0) {
			return res.status(400).json({ error: 'userID is the required parameter and it is missing.' })
		}

		// GET messages operation
		const query = `
			SELECT Threads.*
			FROM Threads
			WHERE Threads.UserID = ?;
			`

		const result = await db.query(query, [userID])

		// Send the result as a JSON response
		res.status(200).json(result[0]) //result.rows
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

export default handler