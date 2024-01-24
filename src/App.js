import React from 'react'
import Home from './pages/Home'
import Mint from './pages/Mint'
import Tokens from './pages/Tokens'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1E1E1E'
    },
    secondary: {
      main: '#FFFFFF'
    }
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  }
})

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <CssBaseline>
        <Router>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/mint' component={Mint} />
            <Route path='/tokens/:tokenID' component={Tokens} />
            <Route default component={Home} />
          </Switch>
        </Router>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
