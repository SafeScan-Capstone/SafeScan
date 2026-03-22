import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token')
        if (!token) return null
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            if (payload.exp * 1000 < Date.now()) {
                localStorage.removeItem('token')
                return null
            }
            return {
                email: payload.email,
                name: localStorage.getItem(`userName_${payload.email}`) ?? payload.email.split('@')[0],
                createdAt: localStorage.getItem(`userCreatedAt_${payload.email}`) ?? new Date().toISOString(),
                avatar: localStorage.getItem(`userAvatar_${payload.email}`) ?? null,
            }
        } catch {
            return null
        }
    })

    const login = (userData, token) => {
        localStorage.setItem('token', token)
        localStorage.removeItem('guestScanCount')
        if (userData.name) localStorage.setItem(`userName_${userData.email}`, userData.name)
        if (userData.createdAt) localStorage.setItem(`userCreatedAt_${userData.email}`, userData.createdAt)
        if (userData.avatar) localStorage.setItem(`userAvatar_${userData.email}`, userData.avatar)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    const updateUser = (updates) => {
        setUser(prev => {
            const updated = { ...prev, ...updates }
            if (updates.name) localStorage.setItem(`userName_${prev.email}`, updates.name)
            if (updates.avatar !== undefined) {
                if (updates.avatar) localStorage.setItem(`userAvatar_${prev.email}`, updates.avatar)
                else localStorage.removeItem(`userAvatar_${prev.email}`)
            }
            return updated
        })
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
