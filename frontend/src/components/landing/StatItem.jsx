import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { staggerItem } from '../../animations/variants'

function parseValue(raw) {
  const match = raw.match(/^([\d.]+)(.*)$/)
  if (!match) return { numeric: null, suffix: raw }
  return { numeric: parseFloat(match[1]), suffix: match[2] }
}

function AnimatedNumber({ value, suffix, inView }) {
  const [display, setDisplay] = useState('0')
  const { numeric } = parseValue(value + suffix)
  const hasDecimal = String(numeric).includes('.')

  useEffect(() => {
    if (!inView || numeric === null) return
    let start = 0
    const end = numeric
    const duration = 1400
    const step = 16
    const increment = (end / (duration / step))
    let current = start
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        current = end
        clearInterval(timer)
      }
      setDisplay(hasDecimal ? current.toFixed(1) : Math.floor(current).toString())
    }, step)
    return () => clearInterval(timer)
  }, [inView, numeric, hasDecimal])

  if (numeric === null) return <>{value + suffix}</>
  return <>{display}{suffix}</>
}

export default function StatItem({ icon, value, label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const { suffix } = parseValue(value)
  const numericStr = value.replace(suffix, '')

  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      className="flex flex-col items-center py-8 last:border-0 lg:py-14 lg:px-8"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-12 w-12 items-center justify-center rounded-[50px] bg-[#E7F0EF] text-primary mb-4 lg:h-16 lg:w-16 lg:mb-7"
      >
        <span className="lg:[&>svg]:h-7 lg:[&>svg]:w-7">{icon}</span>
      </motion.div>

      <p className="text-4xl font-bold text-text-title mb-1 lg:text-5xl lg:mb-3">
        <AnimatedNumber value={numericStr} suffix={suffix} inView={inView} />
      </p>
      <p className="text-xs font-semibold tracking-widest text-text-secondary uppercase lg:text-sm">{label}</p>
    </motion.div>
  )
}
