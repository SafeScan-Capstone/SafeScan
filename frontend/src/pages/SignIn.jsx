import { useState } from 'react'
import apiUrl from '../utils/apiUrl'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AuthTitle from '../components/ui/AuthTitle'
import InputField from '../components/ui/InputField'
import Button from '../components/ui/Button'
import { validateLogin } from '../utils/validate'
import SocialAuth from '../components/ui/SocialAuth'
import SignInImg from '../assets/images/signIn.png'
import { useAuth } from '../context/AuthContext'
import { staggerContainer, staggerItem, EASE_SPRING } from '../animations/variants'

export default function SignIn() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  function handleChange(e) {
    const { name, value } = e.target
    const updated = { ...values, [name]: value }
    setValues(updated)
    if (submitted) setErrors(validateLogin(updated))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const errs = validateLogin(values)
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setLoading(true)
      try {
        // const res = await fetch(`${apiUrl}/api/auth/login`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email: values.email, password: values.password }),
        // })
        // const data = await res.json()
        // if (!res.ok) throw new Error(data.error)

        const res = await fetch(`${apiUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: values.email, password: values.password }),
        })
        const text = await res.text()
        const data = text ? JSON.parse(text) : {}
        if (!res.ok) throw new Error(data.error ?? 'Login failed')

        const savedName = localStorage.getItem(`userName_${values.email}`)
        login({
          email: values.email,
          name: data.user?.name ?? savedName ?? values.email.split('@')[0],
          createdAt: data.user?.createdAt ?? new Date().toISOString(),
        }, data.token)

        navigate('/scan-home')
      } catch (err) {
        setErrors({ general: err.message })
        setLoading(false)
      }
    }
  }

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden justify-center">
      <div className="flex w-full max-w-[1440px] h-full">

        {/* Left image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE_SPRING }}
          className="hidden md:block w-[45%] shrink-0 p-6"
        >
          <img src={SignInImg} alt="Skincare store" className="h-full w-full object-cover rounded-3xl" />
        </motion.div>

        {/* Form */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-1 items-center justify-center px-6 md:px-16 overflow-y-auto"
        >
          <div className="w-full max-w-md">
            <motion.div variants={staggerItem}>
              <AuthTitle title="Welcome Back!" description="Sign in to start scanning safely" />
            </motion.div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 mt-6">
              <motion.div variants={staggerItem}>
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </motion.div>

              <motion.div variants={staggerItem}>
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••••"
                  value={values.password}
                  onChange={handleChange}
                  error={errors.password}
                />
              </motion.div>

              <motion.div variants={staggerItem} className="flex justify-end -mt-2">
                <a href="/forgot-password" className="text-sm text-deep-teal hover:text-primary hover:underline transition-colors">
                  Forgot password?
                </a>
              </motion.div>

              <AnimatePresence>
                {errors.general && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-danger text-center -mt-2"
                  >
                    {errors.general}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div variants={staggerItem}>
                <Button text="Sign In" type="submit" variant="primary" loading={loading} loadingText="Signing In..." className="mt-5" />
              </motion.div>
            </form>

            <motion.div variants={staggerItem}>
              <SocialAuth auth="Sign In" redirectTo="/register" alternateLink="Sign Up" />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
