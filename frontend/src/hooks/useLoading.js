import { useState, useCallback } from 'react'

export default function useLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState)
  const [error,   setError]   = useState(null)

  const withLoading = useCallback(async (fn) => {
    setLoading(true)
    setError(null)
    try {
      return await fn()
    } catch (err) {
      setError(err.message || 'Something went wrong')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, setError, withLoading }
}
