import { ErrorContainer } from './ErrorMessage.elements.js'

export default function ErrorMessage({ message = "An error occurred. Please refresh and try again." }) {
  return (
	<ErrorContainer>{message}</ErrorContainer>
  )
}