import { connectToDatabase } from "./utils/db"

// Serverless function handler
export const handler = async (req, res) => {
  try {
    const db = await connectToDatabase()
    const { threadID } = req.body

    if (!threadID && threadID !== 0) return res.status(400).json({ error: 'threadID is a required parameter and is missing.' })

    // Start a transaction
    await db.query('START TRANSACTION')
    try {
      await db.query('DELETE FROM Messages WHERE ThreadID = ?', [threadID])
      await db.query('DELETE FROM Threads WHERE ThreadID = ?', [threadID])
      await db.query('COMMIT')
      res.status(200).json({ message: 'Thread and associated messages deleted successfully.' })
    } catch (error) {
      // Rollback the transaction in case of an error
      await db.query('ROLLBACK')
      throw error
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal Server Error', details: e.message })
  }
}

export default handler