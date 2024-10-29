import { connectToDatabase } from './utils/db'
import { tryCatchAsyncPlain } from '../../utils/result'

export const handler = async (req, res) => {
  const { threadId } = req.body
  if (!threadId && threadId !== 0) return res.status(400).json({ error: 'threadId is a required parameter and is missing.' })

  const result = await tryCatchAsyncPlain(async () => {
    const db = await connectToDatabase()
    await db.query('START TRANSACTION')
    try {
      await db.query('DELETE FROM Messages WHERE ThreadID = ?', [threadId])
      await db.query('DELETE FROM Threads WHERE ThreadID = ?', [threadId])
      await db.query('COMMIT')
      res.status(200).json({ message: 'Thread and associated messages deleted successfully.' })
    } catch (e) {
      // Rollback the transaction in case of an error
      await db.query('ROLLBACK')
      res.status(500).json({ error: 'Delete did not go through due to an Internal Server Error.' }) // e.message
    }
  }, _ => res.status(500).json({ error: 'Internal Server Error.' })) // e.message

  return result
}

export default handler