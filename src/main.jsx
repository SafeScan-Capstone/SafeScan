import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import LandingPage   from './pages/LandingPage'
import HomePage      from './pages/HomePage'
import SignInPage    from './pages/SignInPage'
import SignUpPage    from './pages/SignUpPage'
import CameraPage    from './pages/CameraPage'
import ConfirmPage   from './pages/ConfirmPage'
import AnalyzingPage from './pages/AnalyzingPage'
import ResultsPage   from './pages/ResultsPage'
import LookupPage    from './pages/LookupPage'
import ProfilePage   from './pages/ProfilePage'
import HistoryPage   from './pages/HistoryPage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <div style={{ maxWidth: 430, margin: '0 auto', height: '100dvh', position: 'relative', overflow: 'hidden', background: '#FEFEFE' }}>
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/home"      element={<HomePage />} />
          <Route path="/signin"    element={<SignInPage />} />
          <Route path="/signup"    element={<SignUpPage />} />
          <Route path="/scan"      element={<CameraPage />} />
          <Route path="/confirm"   element={<ConfirmPage />} />
          <Route path="/analyzing" element={<AnalyzingPage />} />
          <Route path="/results"   element={<ResultsPage />} />
          <Route path="/lookup"    element={<LookupPage />} />
          <Route path="/profile"   element={<ProfilePage />} />
          <Route path="/history"   element={<HistoryPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
