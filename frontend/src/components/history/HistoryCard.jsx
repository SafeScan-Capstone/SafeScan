import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { SAFETY_CONFIG } from '../../constants/ingredients'
import SafeIcon from '../../assets/icons/safe.svg?react'
import RiskyIcon from '../../assets/icons/risky.svg?react'
import DangerIcon from '../../assets/icons/danger.svg?react'
import { staggerItem } from '../../animations/variants'

const SAFETY_ICONS = {
  safe:       <SafeIcon />,
  risky:      <RiskyIcon />,
  restricted: <DangerIcon />,
}

export default function HistoryCard({ id, productName, time, ingredientCount, safety }) {
  const navigate = useNavigate()
  const config = SAFETY_CONFIG[safety]
  const icon   = SAFETY_ICONS[safety]

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(13,100,93,0.10)' }}
      transition={{ duration: 0.22 }}
      className="bg-white rounded-2xl px-4 py-3.5 border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer"
      onClick={() => navigate(`/scan-result/${id}`)}
    >
      {/* Clock icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-bg-secondary">
        <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text-title truncate">{productName}</p>
        <p className="text-xs text-text-secondary mt-0.5">
          {time} • {ingredientCount} ingredients
        </p>
      </div>

      {/* Safety badge */}
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${config.className}`}>
        {icon}
        {config.historyLabel.toUpperCase()}
      </span>

      {/* Arrow */}
      <motion.span
        whileHover={{ x: 3 }}
        transition={{ duration: 0.15 }}
        className="text-gray-400 shrink-0 ml-1"
        aria-label="View scan details"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.span>
    </motion.div>
  )
}
