import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LeaderProvider } from './context/LeaderContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LeaderProvider>
        <App />
      </LeaderProvider>
    </BrowserRouter>
  </React.StrictMode>
)
