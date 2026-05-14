import { useState, useEffect } from 'react'
import apiUrl from '../utils/apiUrl'
import { motion } from 'framer-motion'
import EmptyHistory from '../components/history/EmptyHistory'
import HistoryCard from '../components/history/HistoryCard'
import { staggerContainer, staggerItem, fadeUp } from '../animations/variants'

function HistorySkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.07 }}
          className="bg-white rounded-2xl px-4 py-3.5 border border-gray-100 shadow-sm flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-[14px] bg-gray-100 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-100 rounded-full w-2/3 animate-pulse" />
            <div className="h-2.5 bg-gray-100 rounded-full w-1/3 animate-pulse" />
          </div>
          <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
        </motion.div>
      ))}
    </div>
  )
}

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${apiUrl}/api/scans`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Failed to fetch history')

        const transformed = (data.data ?? []).map((item) => {
          const s = item.summary ?? {}
          const safety = s.restrictedCount > 0 ? 'restricted' : s.riskyCount > 0 ? 'risky' : 'safe'
          const ingredientCount = s.safeCount + s.riskyCount + s.restrictedCount + (s.unknownCount ?? 0)
          const date = item.createdAt ? new Date(item.createdAt) : null
          const time = date
            ? date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'Unknown date'
          return {
            id: item.id,
            productName: item.productCategory ?? 'Scanned Product',
            time,
            ingredientCount,
            safety,
          }
        })
        setHistory(transformed)
      } catch (err) {
        console.error('Failed to fetch history:', err)
        setHistory([])
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <motion.div
      variants={fadeUp}
      custom={0}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-md md:max-w-[1440px] px-4 py-6 md:py-10 md:px-10"
    >
      <h1 className="text-2xl font-bold text-text-title mb-5 md:mb-8">Scan History</h1>

      <div className="md:max-w-2xl md:mx-auto">
        {loading ? (
          <HistorySkeleton />
        ) : history.length === 0 ? (
          <EmptyHistory />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-4 md:mb-6"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recently Scanned
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3 md:gap-4"
            >
              {history.map((item) => (
                <HistoryCard key={item.id} {...item} />
              ))}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  )
}
