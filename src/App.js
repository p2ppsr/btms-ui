import React from 'react'
import Home from './pages/Home'
import Mint from './pages/Mint'
import Assets from './pages/Assets'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1E1E1E'
    },
    secondary: {
      main: '#FFFFFF'
    }
  }
})

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Router>
          <div>
            <Routes>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/mint' element={<Mint />} />
              <Route path='/assets/:assetID' element={<Assets />} />
              <Route path='*' element={<Home />} />
            </Routes>
          </div>
        </Router>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
