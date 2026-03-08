import { motion } from 'framer-motion'
import { staggerItem } from '../../animations/variants'

export default function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(13,100,93,0.10)' }}
      transition={{ duration: 0.25, ease: [0.25, 0, 0, 1] }}
      className="rounded-3xl border border-border shadow-sm px-6 py-8 mb-4 lg:mb-0 lg:px-8 lg:py-14 bg-white cursor-default"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.25 }}
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F0EF] text-primary mb-5 lg:h-16 lg:w-16 lg:rounded-3xl lg:mb-8"
      >
        <span className="lg:[&>svg]:h-8 lg:[&>svg]:w-8">{icon}</span>
      </motion.div>
      <h3 className="text-xl font-bold text-text-title mb-2 lg:text-2xl lg:mb-4">{title}</h3>
      <p className="text-sm text-text-body leading-relaxed lg:text-base lg:leading-loose">{description}</p>
    </motion.div>
  )
}
