import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

export const handler = async (req, res) => {
  const { threadID, newTypingSpeed } = req.body
  if (!threadID && threadID !== 0) return res.status(400).json({ error: 'threadID is a required parameter and is missing.' })
  if (!newTypingSpeed && newTypingSpeed !== 0) return res.status(400).json({ error: 'newTypingSpeed is a required parameter and is missing.' })

  const result = await tryCatchAsyncPlain(async () => {
    const db = await connectToDatabase()
    const query = `
      UPDATE Threads
      SET TypingSpeed = ?
      WHERE ThreadID = ?;
    `
    await db.query(query, [newTypingSpeed, threadID])
    res.status(200).json({ message: 'Typing speed updated successfully.' })
  }, _ => res.status(500).json({ error: 'Internal Server Error.' })) // e.message

  return result
}

export default handler