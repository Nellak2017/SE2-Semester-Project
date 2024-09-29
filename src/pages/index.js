import { useEffect, useState } from 'react'
import LLMChat from '../components/templates/LLMChat/LLMChat'
import 'react-toastify/dist/ReactToastify.css'
import { USER_LOGOS } from '../components/utils/constants'
import { createLLMPageServices } from '../components/services/LLMChatPage/LLMChatServices.js'
import store from '../redux/store.js'
import { useSelector } from 'react-redux'
import { initialize } from '../redux/thunks/LLMChatPageThunks.js'

// TODO: When error, use error component
export default function Home() {
  const [userId] = useState(1)

  // --- Initial State Loaded in from DB. Update userId, fetch threads, fetch messages for 0th thread
  useEffect(() => { store.dispatch(initialize({ userId })) }, [userId])

  // ----- State aggregation for this page
  const LLMChatState = {
    sideBarState: {
      variant: useSelector(state => state.LLMChatPage.variant),
      temperature: useSelector(state => state.LLMChatPage.sideBar.temperature),
      typingSpeed: useSelector(state => state.LLMChatPage.typingSpeed),
      userID: useSelector(state => state.LLMChatPage.userId),
      isSideBarOpen: useSelector(state => state.LLMChatPage.sideBar.isSideBarOpen),
      maxwidth: 260,
      buttonText: "New Chat",
      logoutText: "Log Out",
      exportText: "Export to Text",
      threadListState: {
        variant: useSelector(state => state.LLMChatPage.variant),
        userId: useSelector(state => state.LLMChatPage.userId),
        maxwidth: 260,
        threads: useSelector(state => state.LLMChatPage.sideBar.threads),
      },
    },
    chatListState: {
      variant: useSelector(state => state.LLMChatPage.variant),
      chatHistory: useSelector(state => state.LLMChatPage.chatHistory),
      userLogos: USER_LOGOS,
      typingSpeed: useSelector(state => state.LLMChatPage.typingSpeed),
      chatInputState: {
        variant: useSelector(state => state.LLMChatPage.variant),
        placeholder: 'Write a Message...',
        name: '',
        buttonType: 'submit',
        userID: useSelector(state => state.LLMChatPage.userId),
        userInput: useSelector(state => state.LLMChatPage.chatList.userInput),
        isNewChat: useSelector(state => state.LLMChatPage.chatList.isNewChat),
        threads: useSelector(state => state.LLMChatPage.sideBar.threads),
        threadIndex: useSelector(state => state.LLMChatPage.threadIndex),
        chatHistory: useSelector(state => state.LLMChatPage.chatHistory),
        // threadId and messageId are derived from threads and chatHistory
      },
    },
  }

  return (
    <LLMChat
      state={LLMChatState}
      services={createLLMPageServices(store)}
    />
  )
}