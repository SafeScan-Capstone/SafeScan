import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { EASE } from '../../utils/motion'

function parseValue(str) {
    const match = str.match(/^([\d.]+)(.*)$/)
    if (!match) return { num: 0, suffix: str }
    return { num: parseFloat(match[1]), suffix: match[2] }
}

function AnimatedNumber({ value }) {
    const { num, suffix } = parseValue(value)
    const count = useMotionValue(0)
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, amount: 0.5 })
    const isDecimal = !Number.isInteger(num)

    const display = useTransform(count, (v) =>
        isDecimal ? `${v.toFixed(1)}${suffix}` : `${Math.round(v)}${suffix}`
    )

    useEffect(() => {
        if (inView) {
            animate(count, num, { duration: 1.8, ease: 'easeOut' })
        }
    }, [inView, count, num])

    return (
        <motion.p ref={ref} className="text-4xl font-bold text-text-title mb-1 lg:text-5xl lg:mb-3">
            {display}
        </motion.p>
    )
}

export default function StatItem({ icon, value, label }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-col items-center py-8 last:border-0 lg:py-14 lg:px-8"
        >
            <motion.div
                initial={{ scale: 0.75, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
                className="flex h-12 w-12 items-center justify-center rounded-[50px] bg-[#E7F0EF] text-primary mb-4 lg:h-16 lg:w-16 lg:mb-7"
            >
                <span className="lg:[&>svg]:h-7 lg:[&>svg]:w-7">{icon}</span>
            </motion.div>

            <AnimatedNumber value={value} />

            <p className="text-xs font-semibold tracking-widest text-text-secondary uppercase lg:text-sm">{label}</p>
        </motion.div>
    )
}
