import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import BabbagePrompt from '@babbage/react-prompt'

ReactDOM.render(
  <BabbagePrompt
    customPrompt
    appName='BTMS MVP'
    author='Project Babbage'
    authorUrl='https://projectbabbage.com'
    description='Mint, present, and redeem loyalty points and various other types of tokens on the Bitcoin SV blockchain. Powered by Project Babbage'
    appIcon='/favicon.ico'
    appImages={[
      '/icon.png'
    ]}
  >
    <App />
  </BabbagePrompt>,
  document.getElementById('root')
)