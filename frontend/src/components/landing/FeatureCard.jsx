import { motion } from 'framer-motion'
import { EASE } from '../../utils/motion'

export default function FeatureCard({ icon, title, description }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE }}
            whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(13,100,93,0.12)', transition: { duration: 0.25 } }}
            className="rounded-3xl border border-border shadow-sm px-6 py-8 mb-4 lg:mb-0 lg:px-8 lg:py-14 cursor-default"
        >
            <motion.div
                whileHover={{ scale: 1.1, rotate: 4, transition: { duration: 0.2 } }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F0EF] text-primary mb-5 lg:h-16 lg:w-16 lg:rounded-3xl lg:mb-8"
            >
                <span className="lg:[&>svg]:h-8 lg:[&>svg]:w-8">{icon}</span>
            </motion.div>
            <h3 className="text-xl font-bold text-text-title mb-2 lg:text-2xl lg:mb-4">{title}</h3>
            <p className="text-sm text-text-body leading-relaxed lg:text-base lg:leading-loose">{description}</p>
        </motion.div>
    )
}
