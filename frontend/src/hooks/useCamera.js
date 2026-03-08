import { useRef, useState, useCallback } from 'react'

export default function useCamera() {
  const videoRef = useRef(null)
  const [stream, setStream]   = useState(null)
  const [error, setError]     = useState(null)
  const [active, setActive]   = useState(false)

  const start = useCallback(async (facingMode = 'environment') => {
    setError(null)
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      setStream(s)
      setActive(true)
      if (videoRef.current) {
        videoRef.current.srcObject = s
        await videoRef.current.play()
      }
    } catch (err) {
      setError(err.message || 'Camera access denied')
    }
  }, [])

  const stop = useCallback(() => {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setActive(false)
  }, [stream])

  const capture = useCallback(() => {
    if (!videoRef.current) return null
    const canvas = document.createElement('canvas')
    canvas.width  = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.92)
  }, [])

  return { videoRef, active, error, start, stop, capture }
}
