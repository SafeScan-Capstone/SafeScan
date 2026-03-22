import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { fadeUp } from '../animations/variants'

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!email.trim()) return
        setSubmitted(true)
    }

    return (
        <div className="flex min-h-screen bg-bg-primary items-center justify-center px-4">
            <motion.div
                variants={fadeUp}
                custom={0}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md"
            >
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-1.5 text-sm font-medium text-text-title hover:text-primary transition-colors mb-8"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Sign In
                </button>

                <h1 className="text-2xl font-bold text-text-title mb-1">Reset Password</h1>
                <p className="text-sm text-text-secondary mb-8">
                    Enter your email and we'll send you a reset link.
                </p>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-bold text-text-title mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                                required
                                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-body placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-primary px-4 py-4 font-bold text-white hover:bg-teal-700 transition-colors"
                        >
                            Send Reset Link
                        </button>
                    </form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#ECF8EF] border border-[#A3D9B1] rounded-2xl p-6 text-center"
                    >
                        <svg className="h-12 w-12 text-[#43B75D] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-bold text-text-title mb-1">Check your inbox</p>
                        <p className="text-sm text-text-secondary">
                            If <span className="font-semibold">{email}</span> is registered, you'll receive a reset link shortly.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="mt-5 text-sm font-semibold text-primary hover:underline"
                        >
                            Back to Sign In
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}
