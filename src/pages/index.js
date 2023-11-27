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
// TODO: When error, use error component
export default function Home() {

  const [userID, setUserID] = useState(1) // TODO: Stop Hardcoding and use User Information when the User Logs in
  const [messages, setMessages] = useState([])
  const [threads, setThreads] = useState([]) // unfiltered, has temperature and typing speed included
  const [threadIndex, setThreadIndex] = useState(0) // the thread we are highlighting

  const [threadListenerList, setThreadListenerList] = useState([() => console.log('no listeners assigned')]) // Event Listeners set at runtime
  const [trashListenerList, setTrashListenerList] = useState([() => console.log('no listeners assigned')]) // Event Listeners set at runtime

  // --- Initial State Loaded in from DB
  useEffect(() => {
    // NOTE: fetch is only used because you can't use async/await in useEffect
    (async () => {
      const unfilteredThreads = await getThreads(userID, 0) // WARNING: Does side effect and returns value too
      getMessages(userID, unfilteredThreads[0]?.ThreadID) // No Race Condition because threads is awaited above. Always 0 because initial render
      assignLinkListeners(userID, unfilteredThreads)
    })()
  }, [])

  // --- Helpers (pure)
  // Function to highlight a specific thread at an index
  function highlightThread(threadList, index = 0) {
    if (!threadList || index < 0 || index > threadList.length) return []
    return threadList.map((e, i) => {
      return i === index ?
        { ...e, highlighted: true } :
        { ...e, highlighted: false }
    })
  }

  // Function to tell the index of the currently highlighted
  function indexOfCurrentlyHighlighted(threadList) { return threadList?.findIndex(el => el.highlighted === true) }

  // Function to update an Object in a list given the index, property name, and property value
  function updateObjInList(objList, index, propertyName, propertyValue) {
    if (index < 0 || index === undefined || isNaN(index) || index > objList.length) return objList
    const updatedList = [...objList]
    updatedList[index] = { ...updatedList[index], [propertyName]: propertyValue }
    return updatedList
  }

  // --- Helpers (impure)
  // Function to assign the Link Listeners and SET state
  function assignLinkListeners(userID, threads) {
    // Set the List of listener functions for each Link
    setThreadListenerList(threads.map((e, i) => {
      return () => {
        getMessages(userID, e?.ThreadID)
        setThreads(highlightThread(threads, i))
        setThreadIndex(i) // so we know which is highlighted
      }
    }))
  }

  // --- API functions. Designed to do API call then SET State above and possibly return a value
  // GET Threads - Function to get all the Threads for the user AND set the state too AND return a value
  async function getThreads(userID, highlightIndex = 0) {
    try {
      console.log('Trying to get the threads...')
      const response = await axios.get('/api/getThreads', { params: { userID } })
      setThreads(highlightThread(response.data, highlightIndex)) // highlight nth thread
      return highlightThread(response.data, highlightIndex)
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
  const handleOnSubmit = text => { addMessage(text, userID, threads[indexOfCurrentlyHighlighted(threads)]?.threadID, 0) }

  const handleNewChat = () => {
    /*
      1. highlight nothing
      2. display no text
      3. set isNewChat to true so that the next submit will be to not only add a message as usual, but to generate the name of the thread
    */
  }

  const handleTemperatureChange = temp => { setThreads(updateObjInList(threads, threadIndex, 'Temperature', temp)) }
  const handleTypingSpeedChange = speed => { setThreads(updateObjInList(threads, threadIndex, 'TypingSpeed', speed)) }
  const handleTemperatureMouseUp = () => {
    console.log(threads[threadIndex]?.Temperature)
    // Edit the temperature in the API Request
  }
  const handleTypingSpeedMouseUp = () => {
    console.log(threads[threadIndex]?.TypingSpeed)
    // Edit the typingspeed in the API Request
  }

  return (
    <>
      <button onClick={() => console.log(threadListenerList[0])}>event listeners</button>
      <button onClick={() => console.log(threads)}>threads</button>
      <LLMChat
        variant='dark'
        chatHistory={messages.slice().reverse()}
        userLogos={exampleUserLogos}
        threads={threads}
        threadListenerList={threadListenerList}
        trashListenerList={trashListenerList}
        initialTemperature={50} // TODO: Set these to proper values from getting them in API req
        initialTypingSpeed={50} // TODO: Set these to proper values from getting them in API req
        onSubmitHandler={text => handleOnSubmit(text)}
        onTemperatureChange={temp => handleTemperatureChange(temp)}
        onTypingSpeedChange={speed => handleTypingSpeedChange(speed)}
        onTemperatureMouseUp={handleTemperatureMouseUp}
        onTypingSpeedMouseUp={handleTypingSpeedMouseUp}
      />
    </>
  )
}