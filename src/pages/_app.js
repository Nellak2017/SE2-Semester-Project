import GlobalStyle from '../styles/globalStyles.js'
import { ThemeProvider, StyleSheetManager } from 'styled-components'
import theme from '../styles/theme.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Head from 'next/head'
import isPropValid from '@emotion/is-prop-valid' // automatic unknown prop filtering
import { Provider } from 'react-redux'
import store from '../redux/store.js'
import React, { useCallback } from 'react'

const MyApp = ({ Component, pageProps }) => {
  const shouldForwardProp = useCallback(prop => isPropValid(prop), [])
  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <Head> <title>LLM Chatbot App</title> </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyle /><ToastContainer position="bottom-left" autoClose={3000} />
        <Provider store={store}><Component {...pageProps} /></Provider>
      </ThemeProvider>
    </StyleSheetManager>
  )
}
export default MyApp
