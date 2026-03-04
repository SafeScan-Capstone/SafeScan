import { motion } from 'framer-motion'
import ArrowIcon from '../../assets/icons/arrow-right.svg?react'

export default function Button({
    text,
    loadingText,
    onClick,
    type = "button",
    disabled = false,
    loading = false,
    variant = "primary",
    fullWidth = true,
    showArrow = false,
    className = ""
}) {
    const isDisabled = disabled || loading

    const base = "group rounded-xl p-4 text-sm font-bold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"

    const variants = {
        primary: "bg-primary text-bg-input hover:bg-teal-700",
        outline: "border-[1px] border-primary text-primary hover:bg-teal-50",
    }

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            whileHover={!isDisabled ? { scale: 1.018 } : {}}
            whileTap={!isDisabled ? { scale: 0.97 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
        >
            {loading && (
                <svg
                    className="animate-spin h-4 w-4 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
            )}
            {loading && loadingText ? loadingText : text}

            {showArrow && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full ml-1 shrink-0">
                    <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
            )}
        </motion.button>
    )
}
