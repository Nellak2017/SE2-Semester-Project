import { connectToDatabase } from "./utils/db"

// Serverless function handler
export const handler = async (req, res) => {
	try {
		// Connect to db
		const db = await connectToDatabase()

		// Extract parameters from the request query
		const { userID, threadID } = req.query

		// Check if both userID and name are provided
		if ((!userID && userID !== 0) || (!threadID && threadID !== 0)) {
			return res.status(400).json({ error: 'Both userID and threadID are required parameters.' })
		}

		// GET messages operation with pagination and chronological order
		const query = `
			SELECT Messages.* 
			FROM Messages 
			JOIN Users ON Messages.UserID = Users.UserID 
			JOIN Threads ON Messages.ThreadID = Threads.ThreadID 
			WHERE Users.UserID = ? 
			AND Threads.ThreadID = ?
			ORDER BY Messages.MessageID DESC;
	  	`
		// LIMIT ? OFFSET ?

		const result = await db.query(query, [userID, threadID]) // maxNumber - minNumber + 1, minNumber

		// Send the result as a JSON response
		res.status(200).json(result[0])
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

export default handler