import { useState, useCallback } from 'react'

export default function useUpload({ onSuccess, onError } = {}) {
  const [uploading,   setUploading]   = useState(false)
  const [progress,    setProgress]    = useState(0)
  const [uploadError, setUploadError] = useState(null)

  const upload = useCallback(async (file, url, headers = {}) => {
    setUploading(true)
    setProgress(0)
    setUploadError(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch(url, { method: 'POST', headers, body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setProgress(100)
      onSuccess?.(data)
      return data
    } catch (err) {
      setUploadError(err.message)
      onError?.(err)
      throw err
    } finally {
      setUploading(false)
    }
  }, [onSuccess, onError])

  return { uploading, progress, uploadError, upload }
}
