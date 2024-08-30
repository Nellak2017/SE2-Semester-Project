import GlobalStyle from '../styles/globalStyles.js'
import { ThemeProvider, StyleSheetManager } from 'styled-components'
import theme from '../styles/theme.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Head from 'next/head'
import isPropValid from '@emotion/is-prop-valid' // automatic unknown prop filtering

function MyApp({ Component, pageProps }) {
  return (
    <StyleSheetManager shouldForwardProp={prop => isPropValid(prop)}>
      <Head>
        <title>LLM Chatbot App</title>
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ToastContainer position="bottom-left" autoClose={3000} />
        <Component {...pageProps} />
      </ThemeProvider>
    </StyleSheetManager>
  )
}

export default MyApp
