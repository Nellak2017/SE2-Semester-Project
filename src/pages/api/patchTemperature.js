import { connectToDatabase } from "./utils/db"

// Serverless function handler
export const handler = async (req, res) => {
	try {
		const db = await connectToDatabase()
		const { threadID , newTemperature } = req.body
		if (!newTemperature) return res.status(400).json({ error: 'newTemperature is a required parameter and is missing.' })

		// PATCH update temperature operation
		const query = `
			UPDATE Threads
			SET Temperature = ?
			WHERE ThreadID = ?;
    	`
		await db.query(query, [newTemperature, threadID])

		res.status(200).json({ message: 'Temperature updated successfully.' })
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Internal Server Error', details: e.message })
	}
}

export default handler