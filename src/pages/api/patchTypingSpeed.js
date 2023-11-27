import { connectToDatabase } from "./utils/db"

export const handler = async (req, res) => {
  try {
    const db = await connectToDatabase()
    const { threadID, newTypingSpeed } = req.body

    if (!newTypingSpeed) return res.status(400).json({ error: 'newTypingSpeed is a required parameter and is missing.' })

    const query = `
      UPDATE Threads
      SET TypingSpeed = ?
      WHERE ThreadID = ?;
    `
    await db.query(query, [newTypingSpeed, threadID])

    res.status(200).json({ message: 'Typing speed updated successfully.' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal Server Error', details: e.message})
  }
}

export default handler