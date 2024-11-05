import { useEffect } from 'react'
import LLMChat from '../components/templates/LLMChat/LLMChat'
import { createLLMPageServices } from '../components/services/LLMChatPage/LLMChatServices.js'
import store from '../redux/store.js'
import { initialize, resetPage } from '../redux/thunks/LLMChatPageThunks.js'
import { useLLMChatState } from '../components/stateHooks/LLMChatPage/useLLMChatState.js'
import 'react-toastify/dist/ReactToastify.css'
import { ErrorBoundary } from 'react-error-boundary'
import LLMChatPageErrorBoundary from '../components/templates/ErrorBoundary/LLMChatPageErrorBoundary.js'

// TODO: Add complete testing solutions
export const Home = () => {
  useEffect(() => { store.dispatch(initialize({ credentials: {} })) }, [])
  return (
    <ErrorBoundary FallbackComponent={LLMChatPageErrorBoundary} onReset={() => { store.dispatch(resetPage({ credentials: {} })) }}>
      <LLMChat state={useLLMChatState()} services={createLLMPageServices(store)} />
    </ErrorBoundary>)
}
export default Home