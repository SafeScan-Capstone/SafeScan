import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthTitle from '../components/ui/AuthTitle'
import InputField from '../components/ui/InputField'
import Button from '../components/ui/Button'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        if (!email) {
            setError('Email is required.')
            return
        }
        setError('')
        setLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            // Show success regardless of whether email exists (prevents enumeration)
            setSubmitted(true)
        } catch {
            setSubmitted(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-bg-primary items-center justify-center px-6">
            <div className="w-full max-w-md">
                <AuthTitle
                    title="Forgot Password"
                    description="Enter your email and we'll send you a reset link."
                />

                {submitted ? (
                    <div className="mt-6 rounded-2xl bg-[#ECF8EF] border border-[#A3D9B1] px-5 py-4 text-sm text-[#43B75D] font-medium text-center">
                        If that email is registered, a reset link has been sent.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 mt-6">
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={error}
                        />
                        <Button
                            text="Send Reset Link"
                            type="submit"
                            variant="primary"
                            loading={loading}
                            loadingText="Sending..."
                        />
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-text-secondary">
                    Remember your password?{' '}
                    <Link to="/login" className="text-deep-teal font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}
