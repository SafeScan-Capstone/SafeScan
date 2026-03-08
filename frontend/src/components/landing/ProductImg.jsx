import { motion } from 'framer-motion'
import ProductImage from '../../assets/images/productImg.png'
import FlaggedIcon from '../../assets/icons/flagged.svg?react'
import { EASE_SPRING } from '../../animations/variants'

export default function ProductImg() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease: EASE_SPRING, delay: 0.1 }}
      className="flex justify-center relative mb-10 lg:mb-0 lg:justify-end"
    >
      <div className="relative">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
          className="p-4 bg-white rounded-[28px] shadow-xl/20"
        >
          <div className="rounded-3xl overflow-hidden">
            <img
              src={ProductImage}
              alt="Skincare products"
              className="w-[281px] h-[352px] object-cover lg:w-[420px] lg:h-[520px]"
              loading="eager"
            />
          </div>
        </motion.div>

        {/* Flagged ingredient badge */}
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0,   scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_SPRING, delay: 0.55 }}
          className="absolute top-18 -left-5 flex items-center gap-2.5 bg-white rounded-2xl px-3 py-2.5 shadow-xl/20 h-[75px] w-[194px] lg:h-[88px] lg:w-[230px] lg:-left-10 lg:top-24"
        >
          <FlaggedIcon />
          <div>
            <p className="text-xs font-bold text-text-title lg:text-sm">Flagged Ingredient</p>
            <p className="text-xs text-text-secondary lg:text-sm">Parabens Detected</p>
          </div>
        </motion.div>

        {/* Safety score badge */}
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0,  scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_SPRING, delay: 0.7 }}
          className="absolute bottom-28 -right-6 flex items-center gap-2 bg-primary rounded-2xl px-3 py-2.5 shadow-xl/20 h-[63px] w-[168px] lg:h-[76px] lg:w-[200px] lg:-right-10 lg:bottom-40"
        >
          <svg className="h-4 w-4 text-white shrink-0 lg:h-5 lg:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="text-xs font-bold text-white lg:text-sm">98% Safety Score</p>
            <p className="text-xs text-white/70 lg:text-sm">Clinically Approved</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
