// Standard React + Vite entry file
import React from 'react'
import ReactDOM from 'react-dom/client'
// Root App component that holds routing and context
import App from './App.tsx'
// Global styles (Tailwind + custom styles)
import './index.css'

// Mount the React application into the DOM element with id="root"
ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode helps catch potential issues in development
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
