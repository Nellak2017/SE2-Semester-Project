import { useEffect } from 'react'
import LLMChat from '../components/templates/LLMChat/LLMChat'
import { createLLMPageServices } from '../components/services/LLMChatPage/LLMChatServices.js'
import store from '../redux/store.js'
import { initialize } from '../redux/thunks/LLMChatPageThunks.js'
import { useLLMChatState } from '../components/stateHooks/LLMChatPage/useLLMChatState.js'
import 'react-toastify/dist/ReactToastify.css'

// TODO: Make naming conventions consistent
// TODO: Discover how the messageHistory is recieved, like the Pascal or CamelCasing and fix this potential issue
// TODO: Add Error Boundaries
// TODO: Add Error and Logging aspects to service object and state selectors
// TODO: Add complete testing solutions
export const Home = () => {
  useEffect(() => { store.dispatch(initialize({ credentials: {} })) }, [])
  return (<LLMChat state={useLLMChatState()} services={createLLMPageServices(store)} />)
}
export default Home