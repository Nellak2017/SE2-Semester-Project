import { useEffect, useState, useRef } from "react"
import axios from "axios"
import LLMChat from "../components/templates/LLMChat/LLMChat"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  highlightThread,
  indexOfCurrentlyHighlighted,
  updateObjInList,
  generateRandomSentence
} from "../utils/helpers"
import { USER_LOGOS } from "../components/utils/constants"

// TODO: Add Lazy Loading
// TODO: Add real image assets for user and gpt
// TODO: When error, use error component
// TODO: Edge Case bug, (New Chat => Message Post => Delete thread above this => Click on thread you made => Doesn't load messages!! Uses Incorrect ThreadID)
export default function Home() {

  const [userID, setUserID] = useState(1) // TODO: Stop Hardcoding and use User Information when the User Logs in
  const [messages, setMessages] = useState([])
  const [threads, setThreads] = useState([]) // unfiltered, has temperature and typing speed included
  const [threadIndex, setThreadIndex] = useState(0) // the thread we are highlighting
  const [isNewChat, setIsNewChat] = useState(false) // if it is a new chat, we need to know so we can dispatch a different Post API request

  const [threadListenerList, setThreadListenerList] = useState([() => console.log('no listeners assigned')]) // Event Listeners set at runtime
  const [trashListenerList, setTrashListenerList] = useState([() => console.log('no listeners assigned')]) // Event Listeners set at runtime

  /*
  const [step, setStep] = useState(10) // for lazy loading
  const [prev, setPrev] = useState(0) // for lazy loading
  const [maxMessages, setMaxMessages] = useState(step) // for lazy loading
  */

  // Create a ref for initial mount
  //const initialMount = useRef(true)

  // --- Initial State Loaded in from DB
  useEffect(() => {
    // NOTE: fetch is only used because you can't use async/await in useEffect
    (async () => {
      const unfilteredThreads = await getThreads(userID, 0) // WARNING: Does side effect and returns value too
      if (unfilteredThreads?.length <= 0) {
        console.log('No threads detected. Setting it to be a new chat...')
        setIsNewChat(true)
        return
      }

      // Only fetch messages on the initial mount
      //if (!initialMount.current) {
      getMessages(userID, unfilteredThreads[0]?.ThreadID) // No Race Condition because threads is awaited above. Always 0 because initial render
      assignLinkListeners(userID, unfilteredThreads)
      assignTrashListeners(userID, unfilteredThreads)
      //setPrev(step + 1) // should be like 10 on first load. So you can tell if it is the first or not this way!
      //} else {
      //  initialMount.current = false
      //}
    })()
  }, [])

  // --- Helpers (impure)
  // Function to assign the Link Listeners and SET state
  function assignLinkListeners(userID, threads) {
    // Set the List of listener functions for each Link
    setThreadListenerList(threads.map((e, i) => {
      return () => {
        console.log('assignLinkListeners ', e?.ThreadID)
        getMessages(userID, e?.ThreadID)
        getThreads(userID, i) // so that the temperature and typing speed are updated as expected, we must fetch new threads
        setThreadIndex(i) // so we know which is highlighted
        setIsNewChat(false) // to ensure that a new thread is not made whenever we do (+ New Chat -> Link to another thread -> Message POST)
        //setPrev(step + 1) // to ensure that you can lazy load when switching threads
      }
    }))
  }

  // Function to assign the Trash Listeners and SET state
  function assignTrashListeners(userID, threads) {
    // Set the List of listener functions for each Trash icon
    setTrashListenerList(threads.map(e => {
      return () => { deleteThread(userID, e?.ThreadID) }
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
  async function getMessages(userID, threadID) { // min = 0, max = step
    try {
      console.log('Trying to get new messages...')

      const response = await axios.get('/api/getMessages', { params: { userID: userID, threadID: threadID } }) // min, max

      setMessages(
        response.data.map(e => {
          return {
            user: e?.SentByUser,
            text: e?.Text,
            messageId: e?.MessageID
          }
        }))

      // Update the maximum messages
      //setMaxMessages(prevMax => Math.max(prevMax, response.data.length))
    } catch (e) {
      if (threads.length <= 0) {
        return
      }
      console.error('Error fetching messages:', e)
      toast.error('Error fetching messages. See dev console for more info.')
    }
  }

  // POST Message - Function to post Messsage for the user and thread that is currently active AND set the state too
  async function addMessage(text, userID, threadID, sentByUser = 0) {
    try {
      console.log('attempting to post message...')
      const response = await axios.post('/api/postMessage', {
        threadID: threadID,
        userID: userID,
        text: text,
        sentByUser: sentByUser
      })
      getMessages(userID, threadID) // update messages when you add a new one
      console.log(response.data)
    } catch (e) {
      console.error('Error adding message:', e)
      toast.error('Error adding message. See dev console for more info.')
    }
  }

  // POST Thread - Function to post generated the new thread AND then addMessage following the creation AND returns ThreadID 
  async function postThread(userID, threadName, highlightIndex) {
    try {
      console.log('attempting to create thread...')
      const response = await axios.post('/api/postThread', {
        userID: userID,
        threadName: threadName,
      })
      const newThreadID = response.data.newThreadID
      const fetch = async () => {
        const unfilteredThreads = await getThreads(userID, highlightIndex) // update the display of threads when you make it AND highlight the correct one
        assignLinkListeners(userID, unfilteredThreads)
        assignTrashListeners(userID, unfilteredThreads)
      }
      fetch()

      console.log(response.data)
      return newThreadID
    } catch (e) {
      console.error('Error adding message:', e)
      toast.error('Error adding message. See dev console for more info.')
    }
  }

  // PATCH Temperature - Function to update Temperature for the thread that is currently active AND set the state too
  async function patchTemperature(userID, threadID, newTemperature, threadIndex) {
    try {
      const response = await axios.patch('/api/patchTemperature', {
        userID: userID,
        threadID: threadID,
        newTemperature: newTemperature,
      })
      getThreads(userID, threadIndex) // update the display of threads when you update it
      console.log(response.data)
    } catch (e) {
      console.error('Error updating temperature:', e)
      toast.error('Error updating temperature. See dev console for more info.')
    }
  }

  // PATCH TypingSpeed - Function to update Typing Speed for the thread that is currently active AND set the state too
  async function patchTypingSpeed(userID, threadID, newTypingSpeed, threadIndex) {
    try {
      const response = await axios.patch('/api/patchTypingSpeed', {
        userID: userID,
        threadID: threadID,
        newTypingSpeed: newTypingSpeed,
      })
      getThreads(userID, threadIndex) // update the display of threads when you update it
      console.log(response.data)
    } catch (e) {
      console.error('Error updating typing speed:', e)
      toast.error('Error updating typing speed. See dev console for more info.')
    }
  }

  // DELETE Threads - Function to delete thread and associated messages AND set the state too (resetting it to 0th thread active)
  async function deleteThread(userID, threadID) {
    try {
      console.log('Trying to delete thread...')
      const response = await axios.delete('/api/deleteThread', {
        data: {
          userID: userID,
          threadID: threadID,
        },
      })
      const unfilteredThreads = await getThreads(userID, 0) // WARNING: Does side effect and returns value too
      setThreadIndex(0)
      if (unfilteredThreads.length <= 0) {
        console.log('No threads detected. Clearing messages and setting it to be a new chat...')
        setMessages([])
        setIsNewChat(true)
        return
      }
      getMessages(userID, unfilteredThreads[0]?.ThreadID)

      console.log(response.data)
    } catch (e) {
      console.error('Error deleting thread: ', e)
      toast.error('Error deleting thread. See dev console for more info.')
    }
  }

  // --- Handlers
  const handleOnSubmit = (text, isNewChat = false) => {
    if (!isNewChat) {
      const fetch = async () => {
        // Generator should make up a message
        const RNGGeneratedMessage = generateRandomSentence({ min: 10, max: 35 })
        await addMessage(text, userID, threads[indexOfCurrentlyHighlighted(threads)]?.ThreadID, 0) // this is second because the endpoint is sorted in desc order
        await addMessage(RNGGeneratedMessage, userID, threads[threadIndex]?.ThreadID, 1)
      }
      fetch()

      return
    }
    // if it is a New Chat
    // TODO: LLM Generate Thread Name
    const fetch = async () => {
      // Gen thread name, Change highlight index, Post new thread and message, reset isNewChat, and assign listeners
      const generatedThread = generateRandomSentence({})
      const lastFutureThread = threads.length
      setThreadIndex(lastFutureThread) // uses old last index
      const newThreadID = await postThread(userID, generatedThread, lastFutureThread) // WARNING: Does side effect and returns ThreadID

      await addMessage(text, userID, newThreadID, 0) // this is second because the endpoint is sorted in desc order
      // Generator should make up a message
      const RNGGeneratedMessage = generateRandomSentence({ min: 10, max: 35 })
      await addMessage(RNGGeneratedMessage, userID, newThreadID, 1)

      setIsNewChat(false)
    }
    fetch()
  }

  const handleNewChat = () => {
    console.log("Emptying the Messages, unhighlighting threads, and setting isNewChat...")
    // highlight nothing, display no messages, set isNewChat, and assign listeners just in case
    const newThreads = highlightThread(threads, -1)
    setThreads(newThreads)
    setMessages([])
    setIsNewChat(true)
  }

  const handleTemperatureChange = temp => { setThreads(updateObjInList(threads, threadIndex, 'Temperature', temp)) }
  const handleTypingSpeedChange = speed => { setThreads(updateObjInList(threads, threadIndex, 'TypingSpeed', speed)) }
  const handleTemperatureMouseUp = () => {
    const newTemperature = threads[threadIndex]?.Temperature
    const currentThreadID = threads[threadIndex]?.ThreadID
    patchTemperature(userID, currentThreadID, newTemperature, threadIndex)
  }
  const handleTypingSpeedMouseUp = () => {
    const newTypingSpeed = threads[threadIndex]?.TypingSpeed
    const currentThreadID = threads[threadIndex]?.ThreadID
    patchTypingSpeed(userID, currentThreadID, newTypingSpeed, threadIndex)
  }

  const handleLazyLoad = e => {
    const top = e.target.scrollHeight + e.target.scrollTop <= e.target.clientHeight
    if (top) {
      console.log("top")
      /*
      // Calculate new range for pagination
      const min = maxMessages // Use the maximum messages as the starting point
      const max = min + step

      console.log('min = ', min)
      console.log('max = ', max)

      console.log('prev', prev)

      if (prev < max) {
        getMessages(userID, threads[threadIndex]?.ThreadID, false, min, max)
        setPrev(old => old + step)
      }
      */
    }
  }

  // Conditional Rendering used to ensure that default sliders get proper values
  return (
    <LLMChat
      variant='dark'
      chatHistory={messages}
      userLogos={USER_LOGOS} // placeholders only
      threads={threads}
      threadListenerList={threadListenerList}
      trashListenerList={trashListenerList}
      initialTemperature={threads[threadIndex]?.Temperature}
      initialTypingSpeed={threads[threadIndex]?.TypingSpeed}
      onNewChatClick={handleNewChat}
      onSubmitHandler={text => handleOnSubmit(text, isNewChat)}
      onTemperatureChange={temp => handleTemperatureChange(temp)}
      onTypingSpeedChange={speed => handleTypingSpeedChange(speed)}
      onTemperatureMouseUp={handleTemperatureMouseUp}
      onTypingSpeedMouseUp={handleTypingSpeedMouseUp}
      onScrollHandler={e => handleLazyLoad(e)}
      typingSpeed={threads[threadIndex]?.TypingSpeed}
    />
  )
}