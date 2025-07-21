import { createRoot } from 'react-dom/client'
import './index.css'

// Use dynamic import for App to enable better code splitting
const loadApp = async () => {
  const { default: App } = await import('./App.jsx')
  return App
}

// Initialize app with performance optimizations
const initializeApp = async () => {
  const root = createRoot(document.getElementById('root'))

  // Start loading the app while showing initial critical styles
  const AppComponent = await loadApp()

  // Use concurrent features for better performance
  root.render(<AppComponent />)
}

// Start app initialization
initializeApp().catch(console.error)
