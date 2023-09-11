import GlobalStyle from '../styles/globalStyles.js'
import { ThemeProvider } from 'styled-components'
import theme from '../styles/theme.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ToastContainer position="bottom-left" autoClose={3000} />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
