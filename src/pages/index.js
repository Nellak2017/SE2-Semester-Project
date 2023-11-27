import { useEffect, useState } from "react"
import axios from "axios"
import LLMChat from "../components/templates/LLMChat/LLMChat"
import {
  PiPlaceholderDuotone,
  PiPlaceholderLight
} from 'react-icons/pi'

const markdownContent =
  `
Text Preceeding the Code Block.

\`\`\`python
def f(x):
    return x * 2

f(4)
# will be 8
\`\`\`

Text After the Code Block.

Another Code Block down here!

\`\`\`clojure
(defn hello-world [user]
	(println (str "Hello, " user "!")))
\`\`\`

Here is a longer-ish paragraph that continues on and on. and on and on and on and on and on and on and on and on.
And on and on and on and on and on and on and on and on.

Notice that the above text goes outside the box, but if styled right it instead wraps.

# Header 1
## Header 2
### Header 3

| Header 1 | Header 2 |
| ---------| ---------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`

const exampleChatHistory = [
  {
    user: 'gpt',
    text: 'first (oldest)',
    messageId: 0
  },
  {
    user: 'user',
    text: markdownContent,
    messageId: 1
  },
  {
    user: 'gpt',
    text: 'third',
    error: true, // optional parameter
    messageId: 2
  },
  {
    user: 'user',
    text: 'fourth',
    messageId: 3
  },
  {
    user: 'gpt',
    text: 'fifth',
    messageId: 4
  },
  {
    user: 'user',
    text: 'sixth',
    messageId: 5
  },
  {
    user: 'gpt',
    text: 'seventh',
    messageId: 6
  },
  {
    user: 'user',
    text: 'eigth',
    messageId: 7
  },
  {
    user: 'gpt',
    text: 'ninth',
    messageId: 8
  },
  {
    user: 'user',
    text: 'tenth',
    messageId: 9
  },
  {
    user: 'gpt',
    text: 'eleventh',
    messageId: 10
  },
  {
    user: 'user',
    text: 'twelveth (newest)',
    messageId: 11
  },
]

const exampleUserLogos = {
  'gpt': <PiPlaceholderLight />,
  'user': <PiPlaceholderDuotone />
}

const exampleThreadInfo = [
  {
    title: 'Test 1',
    highlighted: true
  },
  {
    title: 'Test 2'
  },
  {
    title: 'Test 3'
  }
]

// Dummy data for db tests
const dummyDBThread = [
  {
    title: 'Thread1_UserA',
    highlighted: true,
    threadID: 1,
  }
]

// Dummy adapters to be used until I fix the boolean todo item
const stringToBoolean = SentByUser => SentByUser === 'gpt'
const booleanToString = bool => bool ? 'gpt' : 'user'

// TODO: Stop Hardcoding and use User Information when the User Logs in
export default function Home() {

  const [userID, setUserID] = useState(1)
  const [messages, setMessages] = useState([])
  const [threads, setThreads] = useState([])

  const [threadListenerList, setThreadListenerList] = useState([() => console.log('no listeners assigned')])
  const [trashListenerList, setTrashListenerList] = useState([() => console.log('no listeners assigned')])

  useEffect(() => {

    // Function to get all the Threads for the user AND set the state too
    const getThreads = async (userID, highlightIndex = 0) => {
      try {
        // Don't hardcode this. Only use for testing
        const response = await axios.get('/api/getThreads', { params: { userID } })

        setThreads(response.data.map((e, i) => {
          return {
            title: e?.Name,
            highlighted: i === highlightIndex,
            threadID: e?.ThreadID,
          }
        }))
      } catch (e) {
        console.error('Error fetching threads:', e)
      }
    }

    // Function to get Messages for the first thread AND set the state too
    const getMessages = async (userID, threadID) => {
      try {
        // Don't hardcode this. Only use for testing
        const response = await axios.get('/api/getMessages', {
          params: { userID, threadID },
        })

        setMessages(
          response.data.map(e => {
            return {
              user: booleanToString(e?.SentByUser),
              text: e?.Text,
              messageId: e?.MessageID
            }
          })
        ) // TODO: Change this when you fix the Boolean TODO
      } catch (e) {
        console.error('Error fetching messages:', e)
      }
    }

    // Function to assign the Link Listeners to the Thread Links by setting the state
    const assignLinkListeners = userID => {

      // Set the List of listener functions for each Link
      setThreadListenerList(threads.map((e, i) => {
        return () => {
          // Get the messages for a chat and set state for messages
          getMessages(userID, e?.threadID)

          // Change thread highlight to be the new selected one
          setThreads(highlightThread(threads, i))
        }
      }))
    }

    // Call the functions in order
    getThreads(userID, 0)
    getMessages(userID, threads[0]?.threadID) // possible race condition due to accessing threads before initialization
    assignLinkListeners(userID)
  }, [])

  // helpers

  // Function to highlight a specific thread at an index
  function highlightThread(threadList, index) {
    if (!threadList || index < 0 || index > threadList.length) return []
    return threadList.map((e, i) => {
      return i === index ?
        { ...e, highlighted: true } :
        { ...e, highlighted: false }
    })
  }

  return (
    <LLMChat
      variant='dark'
      chatHistory={messages.slice().reverse()}
      userLogos={exampleUserLogos}
      threads={threads}
      threadListenerList={threadListenerList}
      trashListenerList={trashListenerList}
    />
  )
}
