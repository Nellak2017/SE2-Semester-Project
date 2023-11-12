import React from 'react'
import { ErrorContainer } from './ErrorMessage.elements.js'

function ErrorMessage({
	message = "An error occurred. Please refresh and try again."
}) {
  return (
	<ErrorContainer>{message}</ErrorContainer>
  )
}

export default ErrorMessage