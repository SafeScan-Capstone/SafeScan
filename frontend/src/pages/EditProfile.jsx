import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fadeUp } from '../animations/variants'

export default function EditProfile() {
    const navigate = useNavigate()
    const { user, updateUser } = useAuth()
    const [name, setName] = useState(user?.name ?? '')
    const [avatar, setAvatar] = useState(user?.avatar ?? null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const fileInputRef = useRef(null)

    function getInitials(n) {
        if (!n) return 'U'
        return n.trim().split(' ').map(p => p[0].toUpperCase()).slice(0, 2).join('')
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file')
            return
        }
        if (file.size > 2 * 1024 * 1024) {
            setError('Image must be smaller than 2MB')
            return
        }
        const reader = new FileReader()
        reader.onload = (ev) => {
            setAvatar(ev.target.result)
            setError(null)
        }
        reader.readAsDataURL(file)
    }

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
                body: JSON.stringify({ name: name.trim(), avatar: avatar ?? null }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Failed to update profile')
            updateUser({ name: data.name, avatar: data.avatar })
            setSuccess(true)
            setTimeout(() => navigate('/settings'), 1000)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-md px-4 py-8"
        >
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
            <p className="text-sm text-text-secondary mb-8">Update your display name and photo</p>

            {/* Avatar upload */}
            <div className="flex flex-col items-center mb-8 gap-3">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg group focus:outline-none"
                >
                    {avatar ? (
                        <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full bg-primary flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">{getInitials(name || user?.name)}</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                </button>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Change photo
                </button>
                {avatar && (
                    <button
                        type="button"
                        onClick={() => setAvatar(null)}
                        className="text-xs text-text-secondary hover:text-danger transition-colors"
                    >
                        Remove photo
                    </button>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
