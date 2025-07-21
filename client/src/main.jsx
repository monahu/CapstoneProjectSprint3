import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register service worker for Firebase auth caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('RestJAM SW: Registered successfully:', registration.scope)
      })
      .catch((error) => {
        console.log('RestJAM SW: Registration failed:', error)
      })
  })
}

createRoot(document.getElementById('root')).render(<App />)
