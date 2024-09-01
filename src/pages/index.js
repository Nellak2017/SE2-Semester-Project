import { useEffect, useState } from "react"
import LLMChat from "../components/templates/LLMChat/LLMChat"
import 'react-toastify/dist/ReactToastify.css'
import {
  highlightThread, indexOfCurrentlyHighlighted, updateObjInList, fetchAndUpdateThreads, fetchAndUpdateMessages,
  postMessagesWrapper, postThreadWrapper, temperatureWrapper, typingSpeedWrapper, deleteWrapper,
  apiRelevantFields,
  handleExportButtonClick,
  generatePalmMessageWrapper
} from "../utils/helpers"
import { USER_LOGOS } from "../components/utils/constants"

// TODO: Add real image assets for user and gpt
// TODO: When error, use error component
// TODO: Stop Hardcoding and use User Information when the User Logs in
export default function Home() {

  const [userID] = useState(1)
  const [messages, setMessages] = useState([])
  const [threads, setThreads] = useState([]) // unfiltered, has temperature and typing speed included
  const [threadIndex, setThreadIndex] = useState(0) // the thread we are highlighting
  const [isNewChat, setIsNewChat] = useState(false) // if it is a new chat, we need to know so we can dispatch a different Post API request
  const [threadListenerList, setThreadListenerList] = useState([]) // Event Listeners set at runtime
  const [trashListenerList, setTrashListenerList] = useState([])
  const [userInput, setUserInput] = useState('') // this gives us the ability to reset the typing area whenever we swap threads

  // --- Initial State Loaded in from DB
  useEffect(() => { initialize() }, [])

  // --- Handlers
  // User "0" = user, User "1" = gpt
  const handleOnSubmit = async (text, isNewChat = false) => {
    const rawTemperature = threads[threadIndex]?.Temperature
    const processedTemperature = !rawTemperature && rawTemperature !== 0 ? .5 : rawTemperature / 100

    if (!isNewChat) {
      const threadIDUser = threads[indexOfCurrentlyHighlighted(threads)]?.ThreadID
      const threadIDGPT = threads[threadIndex]?.ThreadID
      await postMessagesWrapper({ text, userID, threadID: threadIDUser, sentByUser: 0, setter: setMessages }) // post User's first because the endpoint is sorted in desc order: ;

      if (!rawTemperature) console.warn("Temperature seems invalid, may lead to unexpected results. Temperature = ", rawTemperature)

      const LLMResponse = await generatePalmMessageWrapper([...apiRelevantFields(messages), { author: '0', content: text }], processedTemperature)
      await postMessagesWrapper({ text: LLMResponse, userID, threadID: threadIDGPT, sentByUser: 1, setter: setMessages }) // post GPT's second
      return
    }
    const highlightIndex = threads?.length ?? 0

    const LLM_GENERATED_THREAD = await generatePalmMessageWrapper([{ author: '0', content: text + " Respond in 5 words or less with an unformatted chat title." }], processedTemperature, 'chat_title')
    const data = await postThreadSimply({ threadName: LLM_GENERATED_THREAD, userID, highlightIndex })
    const newThreadID = data[0] // data[0] = threadID
    await postMessagesWrapper({ text, userID, threadID: newThreadID, sentByUser: 0, setter: setMessages }) // post User's first because the endpoint is sorted in desc order: ;

    const LLMResponse = await generatePalmMessageWrapper([...apiRelevantFields(messages), { author: '0', content: text }], .5)
    await postMessagesWrapper({ text: LLMResponse, userID, threadID: newThreadID, sentByUser: 1, setter: setMessages }) // post GPT's second
    setIsNewChat(false)
    setThreadIndex(highlightIndex) // uses old last index
  }

  const handleNewChat = () => { setThreads(highlightThread(threads, -1)); if (noThreadsDetected([])) return }
  const handleTemperatureChange = temp => { setThreads(updateObjInList({ objList: threads, index: threadIndex, propertyName: 'Temperature', propertyValue: temp })) }
  const handleTypingSpeedChange = speed => { setThreads(updateObjInList({ objList: threads, index: threadIndex, propertyName: 'TypingSpeed', propertyValue: speed })) }
  const handleTemperatureMouseUp = async () => { await temperatureWrapper({ userID, threadID: threads[threadIndex]?.ThreadID, newTemperature: threads[threadIndex]?.Temperature, threadIndex, setter: setThreads }) }
  const handleTypingSpeedMouseUp = async () => { await typingSpeedWrapper({ userID, threadID: threads[threadIndex]?.ThreadID, newTypingSpeed: threads[threadIndex]?.TypingSpeed, threadIndex, setter: setThreads }) }

  // --- Helpers
  function noThreadsDetected(t) { if (t?.length > 0) { return false; } setThreadIndex(0); setMessages([]); setIsNewChat(true); return true }

  function assignAllListeners(userID, t) {
    setThreadListenerList(t?.map((e, i) => {
      return async () => {
        setThreadIndex(i) // so we know which is highlighted
        setIsNewChat(false) // to ensure that a new thread is not made whenever we do (+ New Chat -> Link to another thread -> Message POST)
        setUserInput('') // clear input if clicking other thread
        await fetchAndUpdateMessages({ userID, threadID: e?.ThreadID, setter: setMessages })
        await fetchAndUpdateThreads({ userID, setter: setThreads, highlightIndex: i }) // so that the temperature and typing speed are updated as expected, we must fetch new threads
      }
    }))
    setTrashListenerList(t.map(e => { return async () => { await deleteThreadSimply({ userID, threadID: e?.ThreadID }) } }))
  }

  async function postThreadSimply({ threadName, userID, highlightIndex, setter = setThreads }) {
    const data = await postThreadWrapper({ threadName, userID, highlightIndex, setter })
    assignAllListeners(userID, data[1]) // data[1] = unfiltered threads
    return data
  }

  async function deleteThreadSimply({ userID, threadID, setter = setThreads }) {
    const data = await deleteWrapper(userID, threadID, setter)
    const unfilteredThreads = data[1]
    if (noThreadsDetected(unfilteredThreads)) return
    assignAllListeners(userID, data[1]) // data[1] = unfiltered threads
    await fetchAndUpdateMessages({ userID, threadID: unfilteredThreads[0]?.ThreadID, setter: setMessages })
    return data
  }

  async function initialize() {
    const unfilteredThreads = await fetchAndUpdateThreads({ userID, setter: setThreads, highlightIndex: threadIndex })
    if (noThreadsDetected(unfilteredThreads)) return
    await fetchAndUpdateMessages({ userID, threadID: unfilteredThreads[0]?.ThreadID, setter: setMessages })
    assignAllListeners(userID, unfilteredThreads)
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
      exportHandler={() => handleExportButtonClick(messages)}
    />
  )
}