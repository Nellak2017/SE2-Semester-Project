import { useEffect } from 'react'
import LLMChat from '../components/templates/LLMChat/LLMChat'
import { createLLMPageServices } from '../components/services/LLMChatPage/LLMChatServices.js'
import store from '../redux/store.js'
import { initialize } from '../redux/thunks/LLMChatPageThunks.js'
import { useLLMChatState } from '../components/stateHooks/LLMChatPage/useLLMChatState.js'
import 'react-toastify/dist/ReactToastify.css'

// TODO: make naming conventions consistent
// TODO: Add Error Boundaries
export const Home = () => {
  useEffect(() => { store.dispatch(initialize({ credentials: {} })) }, [])
  return (<LLMChat state={useLLMChatState()} services={createLLMPageServices(store)} />)
}
export default Home