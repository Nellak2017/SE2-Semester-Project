import { Alert, Title, ErrorMessage, RetryButton } from './LLMChatPageErrorBoundary.elements.js'
export const LLMChatPageErrorBoundary = ({ error, resetErrorBoundary }) => (<Alert role="alert"><Title>Something went wrong</Title><ErrorMessage>{error.message}</ErrorMessage><RetryButton onClick={resetErrorBoundary}>Try again</RetryButton></Alert>)
export default LLMChatPageErrorBoundary