import { useEffect, useState } from "react"
import axios from "axios"
import LLMChat from "../components/templates/LLMChat/LLMChat"
import {
  PiPlaceholderDuotone,
  PiPlaceholderLight
} from 'react-icons/pi'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const exampleUserLogos = {
  'gpt': <PiPlaceholderLight />,
  'user': <PiPlaceholderDuotone />
}

// TODO: Solve the filtered/non filtered threads BULLSHIT
// TODO: Add Trash Listeners
// TODO: Add Lazy Loading
// TODO: Add real image assets for user and gpt
// TODO: When the Thread we are highlighted on is fetched, set the temperature and typing speed associated with it
export default function Home() {

  const [userID, setUserID] = useState(1) // TODO: Stop Hardcoding and use User Information when the User Logs in
  const [messages, setMessages] = useState([])
  const [threads, setThreads] = useState([]) // unfiltered, use the filterThreads function
  const [filteredThreads, setFilteredThreads] = useState([]) // filtered copy of threads
  const [temperature, setTemperature] = useState(50)
  const [typingSpeed, setTypingSpeed] = useState(50)
  const [highlightIndex, setHighlightIndex] = useState(0)

  const [threadListenerList, setThreadListenerList] = useState([() => console.log('no listeners assigned')])
  const [trashListenerList, setTrashListenerList] = useState([() => console.log('no listeners assigned')])

  // --- Initial State Loaded in from DB
  useEffect(() => {
    // NOTE: fetch is only used because you can't use async/await in useEffect
    (async () => {
      const unfilteredThreads = await getThreads(userID, 0) // WARNING: Does side effect and returns value too
      getMessages(userID, unfilteredThreads[0]?.ThreadID) // No Race Condition because threads is awaited above. Always 0 because initial render
      assignLinkListeners(userID)
    })()
  }, [])

  // --- Helpers (pure)
  // Function to highlight a specific thread at an index
  function highlightThread(threadList, index) {
    if (!threadList || index < 0 || index > threadList.length) return []
    return threadList.map((e, i) => {
      return i === index ?
        { ...e, highlighted: true } :
        { ...e, highlighted: false }
    })
  }

  // Function to tell the index of the currently highlighted
  function indexOfCurrentlyHighlighted(threadList) {
    return threadList?.findIndex(el => el.highlighted === true)
  }

  // Function to filter the threads to be consumed by the Client
  function filterThreads(threadList, highlightIndex = 0) {
    if (threadList.length <= 1 || !threadList) return []
    return threadList?.map((e, i) => {
      return {
        title: e?.Name,
        highlighted: i === highlightIndex,
        threadID: e?.ThreadID,
      }
    })
  }

  // --- Helpers (impure)
  // Function to assign the Link Listeners and SET state
  function assignLinkListeners(userID) {
    // Set the List of listener functions for each Link
    console.log("listeners are being assigned")
    console.log(filteredThreads)
    setThreadListenerList(filteredThreads.map((e, i) => {
      return () => {
        getMessages(userID, e?.threadID)
        setFilteredThreads(highlightThread(filteredThreads, i))
        setHighlightIndex(i) // potentially redundant
        console.log(i)
      }
    }))
  }

  // --- API functions. Designed to do API call then SET State above and possibly return a value
  // GET Threads - Function to get all the Threads for the user AND set the state too AND return a value
  async function getThreads(userID, highlightIndex = 0) {
    try {
      console.log('Trying to get the threads...')
      const response = await axios.get('/api/getThreads', { params: { userID } })
      setThreads(response.data)
      setFilteredThreads(filterThreads(response.data, highlightIndex))
      return response.data
    } catch (e) {
      console.error('Error fetching threads:', e)
      toast.error('Error fetching threads. See dev console for more info.')
    }
  }

  // GET Messages - Function to get Messages AND set the state too
  async function getMessages(userID, threadID) {
    try {
      console.log('Trying to get new messages...')
      const response = await axios.get('/api/getMessages', { params: { userID, threadID } })
      setMessages(
        response.data.map(e => {
          return {
            user: e?.SentByUser,
            text: e?.Text,
            messageId: e?.MessageID
          }
        }))
    } catch (e) {
      console.error('Error fetching messages:', e)
      toast.error('Error fetching messages. See dev console for more info.')
    }
  }

  // POST Message - Function to post Messsage for the user and thread that is currently active AND set the state too
  async function addMessage(text, userID, threadID, sentByUser = 0) {
    try {
      console.log('attempting to post...')
      const response = await axios.post('/api/postMessage', {
        threadID: threadID,
        userID: userID,
        text: text,
        sentByUser: sentByUser
      })
      getMessages(userID, threadID)
      console.log(response.data)
    } catch (e) {
      console.error('Error adding message:', e)
      toast.error('Error adding message. See dev console for more info.')
    }
  }

  // --- Handlers
  const handleOnSubmit = text => {
    addMessage(text, userID, threads[indexOfCurrentlyHighlighted(threads)]?.threadID, 0)
  }

  const handleNewChat = () => {
    /*
      1. highlight nothing
      2. display no text
      3. set isNewChat to true so that the next submit will be to not only add a message as usual, but to generate the name of the thread
    */
  }

  const handleTemperatureChange = temp => { setTemperature(temp) }
  const handleTypingSpeedChange = speed => { setTypingSpeed(speed) }
  const handleTemperatureMouseUp = () => {
    console.log(temperature)
    // Edit the temperature in the API Request
  }
  const handleTypingSpeedMouseUp = () => {
    console.log(typingSpeed)
    // Edit the temperature in the API Request
  }

  return (
    <>
      <button onClick={() => console.log(threadListenerList[0])}>event listeners</button>

      <LLMChat
        variant='dark'
        chatHistory={messages.slice().reverse()}
        userLogos={exampleUserLogos}
        threads={filteredThreads}
        threadListenerList={threadListenerList}
        trashListenerList={trashListenerList}
        initialTemperature={50} // TODO: Set these to proper values from getting them in API req
        initialTypingSpeed={50}
        onSubmitHandler={text => handleOnSubmit(text)}
        onTemperatureChange={temp => handleTemperatureChange(temp)}
        onTypingSpeedChange={speed => handleTypingSpeedChange(speed)}
        onTemperatureMouseUp={handleTemperatureMouseUp}
        onTypingSpeedMouseUp={handleTypingSpeedMouseUp}
      />
    </>
  )
}