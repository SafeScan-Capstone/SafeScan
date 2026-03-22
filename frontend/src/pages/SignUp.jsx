import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import AuthTitle from '../components/ui/AuthTitle'
import InputField from '../components/ui/InputField'
import { validateSignup } from '../utils/validate'
import Button from '../components/ui/Button'
import SocialAuth from '../components/ui/SocialAuth'
import { useAuth } from '../context/AuthContext'
import { staggerContainer, staggerItem, EASE_SPRING } from '../animations/variants'

export default function SignUp() {
  const [values, setValues] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  function handleChange(e) {
    const { name, value } = e.target
    const updated = { ...values, [name]: value }
    setValues(updated)
    if (submitted) setErrors(validateSignup(updated))
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateSignup(values);
    if (!consent) errs.consent = "You must agree to the Privacy Policy to continue.";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        // const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     email: values.email,
        //     password: values.password,
        //     consent_given: true
        //   })
        // });
        // const data = await res.json();
        // if (!res.ok) throw new Error(data.error);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            name: values.fullName,
            consent_given: true
          })
        });
        const text = await res.text()
        const data = text ? JSON.parse(text) : {}
        if (!res.ok) throw new Error(data.error ?? 'Registration failed')

        localStorage.setItem('userName', values.fullName)
        localStorage.setItem('userCreatedAt', data.user?.createdAt ?? new Date().toISOString())

        const loginRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: values.email, password: values.password }),
        })
        const loginData = await loginRes.json()
        if (!loginRes.ok) throw new Error(loginData.error)

        login({ email: values.email, name: values.fullName, createdAt: data.user?.createdAt ?? new Date().toISOString() }, loginData.token)
        navigate('/')
      } catch (err) {
        setErrors({ general: err.message })
        setLoading(false)
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-bg-primary overflow-hidden justify-center">
      <div className="flex w-full max-w-[1440px] h-full">

        {/* Left image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE_SPRING }}
          className="hidden md:block w-[45%] shrink-0 p-6"
        >
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80"
            alt="Skincare products"
            className="h-full w-full object-cover rounded-3xl"
          />
        </motion.div>

        {/* Form */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-1 items-center justify-center px-6 md:px-16 py-8"
        >
          <div className="w-full max-w-md">
            <motion.div variants={staggerItem}>
              <AuthTitle
                title="Create Account"
                description={<>Please Sign up to continue<br />your journey</>}
              />
            </motion.div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 mt-6">
              {['fullName', 'email', 'password', 'confirmPassword'].map((field, i) => (
                <motion.div key={field} variants={staggerItem} custom={i}>
                  <InputField
                    label={field === 'fullName' ? 'Full Name' : field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    type={field.includes('assword') ? 'password' : field === 'email' ? 'email' : 'text'}
                    placeholder={field === 'fullName' ? 'eg. Agbo Emmanuel' : field === 'email' ? 'example@gmail.com' : '••••••••••'}
                    value={values[field]}
                    onChange={handleChange}
                    error={errors[field]}
                  />
                </motion.div>
              ))}

              <motion.div variants={staggerItem} className="flex flex-col gap-1.5">
                <div className="flex items-start gap-2.5">
                  <input
                    id="consent-checkbox"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked)
                      if (submitted) setErrors((prev) => ({ ...prev, consent: undefined }))
                    }}
                    className="mt-0.5 w-4 h-4 shrink-0 border-[1.5px] border-primary rounded cursor-pointer accent-primary"
                  />
                  <label htmlFor="consent-checkbox" className="text-sm text-text-body leading-relaxed cursor-pointer select-none">
                    I have read and agree to the{' '}
                    <Link to="/privacy" target="_blank" className="text-primary font-semibold hover:underline">
                      SafeScan Privacy Policy and Disclaimer
                    </Link>
                  </label>
                </div>
                <AnimatePresence>
                  {errors.consent && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-danger ml-6 overflow-hidden"
                    >
                      {errors.consent}
                    </motion.p>
                  )}
                </AnimatePresence>
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

              <motion.div variants={staggerItem} className="flex flex-col gap-4">
                <Button text="Sign Up" type="submit" variant="primary" loading={loading} loadingText="Signing Up..." />
                <Button text="Continue as a Guest" variant="outline" onClick={() => navigate('/scan-home')} disabled={loading} />
              </motion.div>
            </form>

            <motion.div variants={staggerItem}>
              <SocialAuth auth="Sign Up" redirectTo="/login" alternateLink="Sign In" />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
