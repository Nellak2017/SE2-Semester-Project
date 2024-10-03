import { ErrorContainer } from './ErrorMessage.elements.js'

export const ErrorMessage = ({ message = "An error occurred. Please refresh and try again." }) => (
  <ErrorContainer>{message}</ErrorContainer>
)

export default ErrorMessage