import React from 'react'
import ReactDOM from 'react-dom/client'
import CameraPage from './pages/CameraPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div style={{ maxWidth: 430, margin: '0 auto', height: '100dvh', position: 'relative', overflow: 'hidden' }}>
      <CameraPage />
    </div>
  </React.StrictMode>
)
