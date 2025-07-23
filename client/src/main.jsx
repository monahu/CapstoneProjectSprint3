import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Handle extension-related promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes('message channel closed') ||
    event.reason?.message?.includes('Extension context invalidated') ||
    event.reason?.message?.includes(
      'listener indicated an asynchronous response'
    )
  ) {
    // Suppress extension-related errors
    event.preventDefault()
    console.warn('Suppressed extension-related error:', event.reason?.message)
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
