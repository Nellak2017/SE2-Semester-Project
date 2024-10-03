import { useEffect } from 'react'
import LLMChat from '../components/templates/LLMChat/LLMChat'
import 'react-toastify/dist/ReactToastify.css'
import { USER_LOGOS } from '../components/utils/constants'
import { createLLMPageServices } from '../components/services/LLMChatPage/LLMChatServices.js'
import store from '../redux/store.js'
import { useSelector } from 'react-redux'
import { initialize } from '../redux/thunks/LLMChatPageThunks.js'

// TODO: When error, use error component
export const Home = () => {

  // --- Initial State Loaded in from DB. Update userId, fetch threads, fetch messages for 0th thread
  // if the userId does not exist, then we can not render this page, but another page and re-direct to home
  // We actually don't need to update the userId at all since it is managed by login/signup and by the logout feature
  // However, we need it now since we only have one page..
  useEffect(() => { store.dispatch(initialize({ credentials: {} })) }, [])

  // ----- State aggregation for this page
  // TODO: make naming conventions consistent
  // TODO: De-duplicate data
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
      threadIndex: useSelector(state => state.LLMChatPage.threadIndex),
      threads: useSelector(state => state.LLMChatPage.sideBar.threads),
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
export default Home