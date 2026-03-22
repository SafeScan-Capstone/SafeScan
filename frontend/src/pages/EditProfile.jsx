import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fadeUp } from '../animations/variants'

export default function EditProfile() {
    const navigate = useNavigate()
    const { user, updateUser } = useAuth()
    const [name, setName] = useState(user?.name ?? '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) { setError('Name cannot be empty'); return }
        setLoading(true)
        setError(null)
        setSuccess(false)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: name.trim() }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Failed to update profile')
            updateUser({ name: data.name })
            setSuccess(true)
            setTimeout(() => navigate('/settings'), 1000)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    function getInitials(n) {
        if (!n) return 'U'
        return n.trim().split(' ').map(p => p[0].toUpperCase()).slice(0, 2).join('')
    }

    return (
        <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-md px-4 py-8"
        >
            {/* Back button */}
            <button
                type="button"
                onClick={() => navigate('/settings')}
                className="flex items-center gap-1.5 text-sm font-medium text-text-title hover:text-primary transition-colors mb-6"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
            </button>

            <h1 className="text-2xl font-bold text-text-title mb-1">Edit Profile</h1>
            <p className="text-sm text-text-secondary mb-8">Update your display name</p>

            {/* Avatar preview */}
            <div className="flex justify-center mb-8">
                <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-3xl font-bold text-white">{getInitials(name || user?.name)}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name field */}
                <div>
                    <label className="block text-sm font-bold text-text-title mb-2">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(null); setSuccess(false) }}
                        placeholder="Enter your full name"
                        maxLength={80}
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-body placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {/* Email (read-only) */}
                <div>
                    <label className="block text-sm font-bold text-text-title mb-2">Email</label>
                    <input
                        type="email"
                        value={user?.email ?? ''}
                        disabled
                        className="w-full rounded-xl border border-border bg-gray-50 px-4 py-3 text-sm text-text-secondary cursor-not-allowed"
                    />
                    <p className="text-xs text-text-secondary mt-1">Email cannot be changed</p>
                </div>

                {error && <p className="text-sm text-danger">{error}</p>}
                {success && <p className="text-sm text-[#43B75D] font-medium">Profile updated!</p>}

                <motion.button
                    type="submit"
                    disabled={loading || !name.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full rounded-xl bg-primary px-4 py-4 font-bold text-white hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </motion.button>
            </form>
        </motion.div>
    )
}
