import { useEffect, useState } from "react"
import LLMChat from "../components/templates/LLMChat/LLMChat"
import 'react-toastify/dist/ReactToastify.css'
import {
  highlightThread,
  indexOfCurrentlyHighlighted,
  updateObjInList,
  generateRandomSentence,
  fetchAndUpdateThreads,
  fetchAndUpdateMessages,
  postAndUpdateMessage,
  postAndUpdateThread,
  patchTemperatureAndUpdateThreads,
  patchTypingSpeedAndUpdateThreads,
  deleteAndUpdateThreads,
} from "../utils/helpers"
import { USER_LOGOS } from "../components/utils/constants"
import {
  getThreads,
  getMessages,
  addMessage,
  postThread,
  patchTemperature,
  patchTypingSpeed,
  deleteThread
} from '../utils/api.js'

// TODO: Add real image assets for user and gpt
// TODO: When error, use error component
export default function Home() {

  const [userID, setUserID] = useState(1) // TODO: Stop Hardcoding and use User Information when the User Logs in
  const [messages, setMessages] = useState([])
  const [threads, setThreads] = useState([]) // unfiltered, has temperature and typing speed included
  const [threadIndex, setThreadIndex] = useState(0) // the thread we are highlighting
  const [isNewChat, setIsNewChat] = useState(false) // if it is a new chat, we need to know so we can dispatch a different Post API request
  const [threadListenerList, setThreadListenerList] = useState([() => console.log('no listeners assigned')]) // Event Listeners set at runtime
  const [trashListenerList, setTrashListenerList] = useState([() => console.log('no listeners assigned')]) // Event Listeners set at runtime
  const [userInput, setUserInput] = useState('') // this gives us the ability to reset the typing area whenever we swap threads

  // --- Constants
  const gettersMessage = { 'post': addMessage, 'get': getMessages }
  const settersMessage = { 'post': (_) => { }, 'get': setMessages }

  const gettersThreads = { 'post': postThread, 'get': getThreads }
  const settersThreads = { 'post': (_) => { }, 'get': setThreads }

  const gettersTemperature = { 'patch': patchTemperature, 'get': getThreads }
  const settersTemperature = { 'patch': (_) => { }, 'get': setThreads }
  const gettersTypingSpeed = { 'patch': patchTypingSpeed, 'get': getThreads }
  const settersTypingSpeed = { 'patch': (_) => { }, 'get': setThreads }

  const gettersDeleteThread = { 'delete': deleteThread, 'get': getThreads }
  const settersDeleteThread = { 'delete': (_) => { }, 'get': setThreads }

  // --- Initial State Loaded in from DB
  useEffect(() => {
    initialize()
  }, [])

  // --- Listener Assignment
  function assignLinkListeners(userID, t) {
    setThreadListenerList(t?.map((e, i) => {
      return async () => {
        // NOTE: when setting state with awaited code, order matters. Use the sync order
        setThreadIndex(i) // so we know which is highlighted
        setIsNewChat(false) // to ensure that a new thread is not made whenever we do (+ New Chat -> Link to another thread -> Message POST)
        setUserInput('') // clear input if clicking other thread
        await fetchAndUpdateMessages(userID, e?.ThreadID, getMessages, setMessages)
        await fetchAndUpdateThreads(userID, getThreads, setThreads, i) // so that the temperature and typing speed are updated as expected, we must fetch new threads
      }
    }))
  }

  function assignTrashListeners(userID, t) {
    setTrashListenerList(t.map(e => {
      return async () => {
        await deleteThreadSimply(userID, e?.ThreadID)
      }
    }))
  }

  // --- Handlers
  const handleOnSubmit = async (text, isNewChat = false) => {
    if (!isNewChat) {
      // Generator should make up a message
      const RNGGeneratedMessage = generateRandomSentence({ min: 10, max: 35 })
      const threadIDUser = threads[indexOfCurrentlyHighlighted(threads)]?.ThreadID
      const threadIDGPT = threads[threadIndex]?.ThreadID

      await postAndUpdateMessage(text, userID, threadIDUser, gettersMessage, settersMessage, 0) // post User's first because the endpoint is sorted in desc order
      await postAndUpdateMessage(RNGGeneratedMessage, userID, threadIDGPT, gettersMessage, settersMessage, 1) // post GPT's second
      return
    }

    // if it is a New Chat
    // TODO: LLM Generate Thread Name
    // Gen thread name, Change highlight index, Post new thread and message, reset isNewChat, and assign listeners
    const generatedThread = generateRandomSentence({})
    const RNGGeneratedMessage = generateRandomSentence({ min: 10, max: 35 })
    const highlightIndex = threads.length

    const data = await postThreadSimply(generatedThread, userID, highlightIndex)
    const newThreadID = data[0] // data[0] = threadID

    await postAndUpdateMessage(text, userID, newThreadID, gettersMessage, settersMessage, 0) // post User's first because the endpoint is sorted in desc order: ;
    await postAndUpdateMessage(RNGGeneratedMessage, userID, newThreadID, gettersMessage, settersMessage, 1) // post GPT's second

    setIsNewChat(false)
    setThreadIndex(highlightIndex) // uses old last index
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
  const handleTemperatureMouseUp = async () => {
    await patchTemperatureAndUpdateThreads(
      userID,
      threads[threadIndex]?.ThreadID,
      threads[threadIndex]?.Temperature,
      threadIndex,
      gettersTemperature, settersTemperature)
  }
  const handleTypingSpeedMouseUp = async () => {
    await patchTypingSpeedAndUpdateThreads(
      userID,
      threads[threadIndex]?.ThreadID,
      threads[threadIndex]?.TypingSpeed,
      threadIndex,
      gettersTypingSpeed, settersTypingSpeed)
  }

  // --- Helpers
  async function postThreadSimply(threadName, userID, highlightIndex, getters = gettersThreads, setters = settersThreads) {
    const data = await postAndUpdateThread(threadName, userID, highlightIndex, getters, setters)
    assignLinkListeners(userID, data[1]) // data[1] = unfiltered threads
    assignTrashListeners(userID, data[1])
    return data
  }

  async function deleteThreadSimply(userID, threadID, getters = gettersDeleteThread, setters = settersDeleteThread) {
    const data = await deleteAndUpdateThreads(userID, threadID, getters, setters)
    const unfilteredThreads = data[1]
    setThreadIndex(0)
    if (unfilteredThreads.length <= 0) {
      console.log('No threads detected. Clearing messages and setting it to be a new chat...')
      setMessages([])
      setIsNewChat(true)
      return
    }
    assignLinkListeners(userID, data[1]) // data[1] = unfiltered threads
    assignTrashListeners(userID, data[1]) // Without these assigned listeners, you will have the bug where when you delete something below, it won't go to it on click
    await fetchAndUpdateMessages(userID, unfilteredThreads[0]?.ThreadID, getMessages, setMessages)
    return data
  }

  async function initialize() {
    const unfilteredThreads = await getThreads(userID)
    setThreads(highlightThread(unfilteredThreads, threadIndex)) // Set state manually, so that you can have unfiltered threads

    if (unfilteredThreads?.length <= 0) {
      console.log('No threads detected. Setting it to be a new chat...')
      setIsNewChat(true)
      return
    }

    // Only fetch messages on the initial mount
    await fetchAndUpdateMessages(userID, unfilteredThreads[0]?.ThreadID, getMessages, setMessages)
    assignLinkListeners(userID, unfilteredThreads)
    assignTrashListeners(userID, unfilteredThreads)
  }

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
      onTypingSpeedChange={speed => { handleTypingSpeedChange(speed) }}
      onTemperatureMouseUp={handleTemperatureMouseUp}
      onTypingSpeedMouseUp={handleTypingSpeedMouseUp}
      typingSpeed={threads[threadIndex]?.TypingSpeed}
      parentText={userInput}
      chatInputOnChange={inputArea => setUserInput(inputArea.target.value)}
    />
  )
}