import React from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

const theme = extendTheme({
  config :{
    initialColorMode: 'dark',
    useSystemColorMode: false,
  }
})

axios.defaults.baseURL = 'http://localhost:8000'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)