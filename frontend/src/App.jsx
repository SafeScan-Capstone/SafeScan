import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE } from './utils/motion'
import './themes/variables.css'
import './styles/global.css'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Navbar from './components/layout/Navbar'
import ScrollToTop from './utils/ScrollToTop'
import Lookup from './pages/Lookup'
import PrivateRoute from './utils/PrivateRoute'
import History from './pages/History'
import Results from './pages/Results'
import Settings from './pages/Settings'
import ScanLanding from './pages/ScanLanding'
import Landing from './pages/Landing'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import About from './pages/About'
import OCRReview from './pages/OCRReview'
import ConfirmIngredients from './components/camera/ConfirmIngredients'
import Analyzing from './components/camera/Analyzing'
import NotFound from './pages/NotFound'
import ForgotPassword from './pages/ForgotPassword'

const AUTH_PAGES = ['/register', '/login', '/scan-result']

function AppLayout() {
  const { pathname } = useLocation()
  const hideNavbar = AUTH_PAGES.some(path => pathname.startsWith(path))

  return (
    <div className="min-h-screen bg-bg-primary">
      <ScrollToTop />
      {!hideNavbar && <Navbar />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          <Routes location={{ pathname }} key={pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/scan-home" element={<ScanLanding />} />
            <Route path="/lookup" element={<Lookup />} />
            <Route path="/ocr-review" element={<OCRReview />} />
            <Route path="/history" element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            } />
            <Route path="/scan-result/:id" element={
              <PrivateRoute>
                <Results />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/about" element={<About />} />
            <Route path="/confirm" element={
              <PrivateRoute>
                <ConfirmIngredients />
              </PrivateRoute>
            } />
            <Route path="/analyzing" element={
              <PrivateRoute>
                <Analyzing />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  )
}

export default App
