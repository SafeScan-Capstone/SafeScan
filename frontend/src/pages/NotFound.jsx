import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { staggerContainer, staggerItem } from '../animations/variants'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center max-w-sm"
      >
        <motion.div
          variants={staggerItem}
          className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E7F0EF] text-primary mb-6"
        >
          <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>

        <motion.p variants={staggerItem} className="text-6xl font-bold text-primary mb-2">404</motion.p>
        <motion.h1 variants={staggerItem} className="text-2xl font-bold text-text-title mb-3">Page not found</motion.h1>
        <motion.p variants={staggerItem} className="text-base text-text-body mb-8">
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        <motion.div variants={staggerItem} className="w-full">
          <Button text="Go Home" variant="primary" onClick={() => navigate('/')} />
        </motion.div>
      </motion.div>
    </div>
  )
}
