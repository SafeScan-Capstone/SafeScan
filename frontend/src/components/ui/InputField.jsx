import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InputField({ label, name, type = "text", placeholder, value, onChange, error }) {
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="flex flex-col gap-2">
            <motion.label
                htmlFor={name}
                animate={{ color: focused ? '#0D645D' : '#1A1A1A' }}
                transition={{ duration: 0.2 }}
                className="text-base font-bold"
            >
                {label}
            </motion.label>
            <div className="relative">
                <motion.input
                    id={name}
                    name={name}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete={isPassword ? "current-password" : name}
                    animate={{
                        boxShadow: focused
                            ? (error ? '0 0 0 3px rgba(238,68,63,0.12)' : '0 0 0 3px rgba(13,100,93,0.12)')
                            : '0 0 0 0px transparent',
                    }}
                    transition={{ duration: 0.2 }}
                    className={`w-full rounded-xl border-[1.5px] p-3 text-xs text-text-title placeholder-text-secondary outline-none transition-colors duration-200
                        ${isPassword ? "pr-11" : ""}
                        ${error
                            ? "border-danger bg-red-50/50 focus:border-danger"
                            : "border-border bg-bg-input focus:border-primary"
                        }`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-gray-600 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.938 6.938A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.293 4.868M3 3l18 18" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-danger mt-0.5"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
