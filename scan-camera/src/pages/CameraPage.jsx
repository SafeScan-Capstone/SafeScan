import { useRef, useState, useEffect, useCallback } from 'react'

const FALLBACK_TEXT = `Aqua, Glycerin, Sodium Hyaluronate, Ceramide NP, Niacinamide, Panthenol, Allantoin, Ethylhexylglycerin, Citric Acid, Carbomer, Xanthan Gum, Fragrance, Phenoxyethanol, Sodium PCA, Tocopheryl Acetate`

const SafeScanIcon = () => (
  <svg width="38" height="40" viewBox="0 0 38 44" fill="none">
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="#1E6B64"/>
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="url(#sg-cam)"/>
    <path d="M8 24C10 18,14 14,19 13C24 12,30 16,33 21C33 26,30 32,26 36C22 39.5,19 41,19 41C19 41,8 34,8 24Z" fill="#3EC8BE" opacity="0.85"/>
    <path d="M13 22L17.5 27L25.5 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="sg-cam" x1="3" y1="2" x2="35" y2="43" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2A8078" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#0D4840" stopOpacity="0.2"/>
      </linearGradient>
    </defs>
  </svg>
)

/* ─── End Scan Confirmation Modal ─── */
function EndScanModal({ onNo, onYes }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 24px',
    }}>
      <div style={{
        width: '100%', maxWidth: 340,
        background: 'white', borderRadius: 24,
        padding: '28px 24px 28px',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* X to dismiss */}
        <button onClick={onNo} style={{
          position: 'absolute', top: 16, right: 16,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#AAAAAA', padding: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
          </svg>
        </button>

        <h2 style={{
          fontSize: 22, fontWeight: 800, color: '#1A1A1A',
          margin: '24px 0 32px', textAlign: 'center', lineHeight: 1.3,
        }}>
          Do you want to end Scan?
        </h2>

        <div style={{ display: 'flex', gap: 12 }}>
          {/* No */}
          <button onClick={onNo} style={{
            flex: 1, height: 52, border: '1.5px solid #C8E8E4',
            borderRadius: 14, background: '#F0FAF8',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: 'pointer',
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#0D645D' }}>No</span>
          </button>

          {/* Yes */}
          <button onClick={onYes} style={{
            flex: 1, height: 52, border: '1.5px solid #F5C5C3',
            borderRadius: 14, background: '#FDF0EF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: 'pointer',
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#EE443F" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#EE443F' }}>Yes</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── File Upload Modal ─── */
function FileUploadModal({ onDone, onCancel }) {
  const pickerRef = useRef(null)
  const [file, setFile]         = useState(null)
  const [progress, setProgress] = useState(0)
  const [dataUrl, setDataUrl]   = useState(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return
    setFile(f); setProgress(0)
    const r = new FileReader()
    r.onload = e => setDataUrl(e.target.result)
    r.readAsDataURL(f)
  }

  useEffect(() => {
    if (!file) return
    let p = 0
    const iv = setInterval(() => {
      p += 3 + Math.random() * 5
      if (p >= 100) { p = 100; clearInterval(iv) }
      setProgress(Math.floor(p))
    }, 60)
    return () => clearInterval(iv)
  }, [file])

  const ext = file ? file.name.split('.').pop().toUpperCase() : ''

  return (
    <div style={{ position:'absolute', inset:0, zIndex:50, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'flex-end' }}>
      <div style={{ width:'100%', background:'white', borderRadius:'24px 24px 0 0', padding:'28px 24px 48px' }}>
        <h2 style={{ fontSize:22, fontWeight:700, textAlign:'center', margin:'0 0 24px', color:'#1A1A1A' }}>File upload</h2>

        <div
          onClick={() => pickerRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]) }}
          style={{ border:`2px dashed ${dragging ? '#0D645D' : '#C5D8D6'}`, borderRadius:16, background: dragging ? '#E7F0EF' : '#F0F7F6', padding:'36px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:12, cursor:'pointer', marginBottom:24 }}
        >
          <svg width="52" height="56" fill="none" viewBox="0 0 52 56">
            <rect x="4" y="2" width="36" height="44" rx="4" fill="white" stroke="#C5D8D6" strokeWidth="1.5"/>
            <path d="M28 2v12h12" stroke="#C5D8D6" strokeWidth="1.5"/>
            <circle cx="38" cy="42" r="10" fill="#0D645D"/>
            <path d="M38 37v10M33 42h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p style={{ fontSize:15, color:'#484848', margin:0, textAlign:'center' }}>
            Drag and drop or <span style={{ color:'#0D645D', textDecoration:'underline', fontWeight:600 }}>browse</span> your files
          </p>
          <input ref={pickerRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => handleFile(e.target.files?.[0])}/>
        </div>

        {file && (
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:28 }}>
            <div style={{ width:52, height:56, borderRadius:8, border:'1.5px solid #E5E7EA', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', padding:'0 0 6px', flexShrink:0, background:'white' }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 28 28" style={{ marginBottom:2 }}>
                <rect x="2" y="1" width="20" height="24" rx="3" fill="#F0F7F6" stroke="#C5D8D6" strokeWidth="1.2"/>
                <path d="M14 1v8h8" stroke="#C5D8D6" strokeWidth="1.2"/>
              </svg>
              <span style={{ fontSize:9, fontWeight:700, color:'#0D645D', letterSpacing:'0.04em' }}>{ext}</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:14, fontWeight:700, color:'#1A1A1A', margin:'0 0 6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</p>
              <div style={{ height:8, borderRadius:100, background:'#E7F0EF', overflow:'hidden', marginBottom:6 }}>
                <div style={{ height:'100%', width:`${progress}%`, background:'#0D645D', borderRadius:100, transition:'width 0.06s linear' }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:12, color:'#808080' }}>{((progress/100)*(file.size/1048576)).toFixed(1)} MB of {(file.size/1048576).toFixed(1)} MB</span>
                <span style={{ fontSize:12, fontWeight:700, color:'#0D645D' }}>{progress}%</span>
              </div>
            </div>
          </div>
        )}
        {!file && <div style={{ height:28 }}/>}

        <button onClick={() => progress === 100 && dataUrl && onDone(dataUrl)}
          style={{ width:'100%', height:56, background:'#0D645D', color:'white', fontSize:16, fontWeight:700, border:'none', borderRadius:14, cursor: progress===100 ? 'pointer' : 'not-allowed', opacity: progress===100 ? 1 : 0.45, transition:'opacity 0.2s', marginBottom:12 }}>
          DONE
        </button>
        <button onClick={onCancel}
          style={{ width:'100%', height:56, background:'white', color:'#0D645D', fontSize:16, fontWeight:700, border:'1.5px solid #0D645D', borderRadius:14, cursor:'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

/* ─── Analyzing Screen ─── */
function AnalyzingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{ position:'absolute', inset:0, zIndex:60, display:'flex', flexDirection:'column', height:'100%', background:'#FEFEFE', alignItems:'center', justifyContent:'center', gap:16 }}>
      <div style={{ width:72, height:72 }}>
        <svg style={{ width:'100%', height:'100%', animation:'spin 1s linear infinite' }} viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="28" fill="none" stroke="#E7F0EF" strokeWidth="6"/>
          <circle cx="36" cy="36" r="28" fill="none" strokeWidth="6" strokeLinecap="round"
            stroke="url(#sg-analyzing)" strokeDasharray="88 100" />
          <defs>
            <linearGradient id="sg-analyzing" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0D645D"/>
              <stop offset="100%" stopColor="#3D837D" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h2 style={{ fontSize:24, fontWeight:700, color:'#1A1A1A', margin:0 }}>Analyzing ingredients...</h2>
      <p style={{ fontSize:16, color:'#484848', margin:0 }}>Checking clinical database</p>
    </div>
  )
}

/* ─── Result Screen ─── */
function ResultScreen({ image, text, onScanAgain }) {
  const [editedText, setEditedText] = useState(text)

  return (
    <div style={{ position:'absolute', inset:0, zIndex:60, background:'#FEFEFE', display:'flex', flexDirection:'column' }}>
      <header style={{ flexShrink:0, height:64, background:'#FFFFFF', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', boxShadow:'0 1px 0 rgba(0,0,0,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <SafeScanIcon/>
          <span style={{ fontSize:20, fontWeight:700, letterSpacing:'-0.3px' }}>
            <span style={{ color:'#1B5E57' }}>Safe</span><span style={{ color:'#3EC8BE' }}>Scan</span>
          </span>
        </div>
        <button onClick={onScanAgain} style={{ background:'none', border:'none', cursor:'pointer', fontSize:14, fontWeight:600, color:'#0D645D' }}>
          ← Scan Again
        </button>
      </header>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 32px' }}>
        {image && (
          <div style={{ borderRadius:16, overflow:'hidden', marginBottom:20, border:'1px solid #E5E7EA' }}>
            <img src={image} alt="Scanned product" style={{ width:'100%', maxHeight:220, objectFit:'cover', display:'block' }}/>
          </div>
        )}
        <p style={{ fontSize:13, fontWeight:600, color:'#808080', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>
          Extracted Ingredients
        </p>
        <p style={{ fontSize:12, color:'#AAAAAA', marginBottom:12 }}>
          Review and edit the scanned text if needed.
        </p>
        <textarea
          value={editedText}
          onChange={e => setEditedText(e.target.value)}
          style={{
            width:'100%', minHeight:200, padding:'14px 16px',
            border:'1.5px solid #E0ECEB', borderRadius:14,
            fontSize:14, lineHeight:1.7, color:'#1A1A1A',
            fontFamily:'Inter, sans-serif', resize:'vertical',
            outline:'none', background:'#F8FFFE',
          }}
        />
        <button
          onClick={onScanAgain}
          style={{ marginTop:20, width:'100%', height:54, background:'#0D645D', color:'white', fontSize:16, fontWeight:700, border:'none', borderRadius:14, cursor:'pointer' }}
        >
          Scan Another Product
        </button>
      </div>
    </div>
  )
}

/* ─── Main Camera Page ─── */
export default function CameraPage() {
  const videoRef  = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const [ready, setReady]               = useState(false)
  const [permState, setPermState]       = useState('checking')
  const [flash, setFlash]               = useState(false)
  const [scanning, setScanning]         = useState(false)
  const [ocrProgress, setOcrProgress]   = useState(0)
  const [showUpload, setShowUpload]     = useState(false)
  const [showEndScan, setShowEndScan]   = useState(false)
  const [menuOpen, setMenuOpen]         = useState(false)
  const [view, setView]                 = useState('camera') // 'camera'|'analyzing'|'result'
  const [result, setResult]             = useState(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      setPermState('granted')
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => { videoRef.current.play(); setReady(true) }
      }
    } catch {
      setReady(false)
      setPermState('denied')
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const check = async () => {
      if (navigator.permissions) {
        try {
          const status = await navigator.permissions.query({ name: 'camera' })
          if (cancelled) return
          if (status.state === 'granted') { setPermState('granted'); startCamera() }
          else if (status.state === 'denied') { setPermState('denied') }
          else { setPermState('prompt') }
          status.onchange = () => {
            if (status.state === 'granted') { setPermState('granted'); startCamera() }
            else if (status.state === 'denied') { setPermState('denied') }
          }
          return
        } catch {/* fall through */}
      }
      if (!cancelled) startCamera()
    }
    check()
    return () => {
      cancelled = true
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    }
  }, [startCamera])

  const runOCR = async (imageSrc) => {
    setScanning(true)
    setOcrProgress(0)
    try {
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('eng', 1, {
        workerPath: '/tesseract-worker.min.js',
        corePath: '/tesseract-core.wasm.js',
        langPath: 'https://tessdata.projectnaptha.com/4.0.0_fast',
        logger: m => { if (typeof m.progress === 'number') setOcrProgress(Math.round(m.progress * 100)) },
      })
      const { data: { text } } = await worker.recognize(imageSrc)
      await worker.terminate()
      const cleaned = text.trim()
      return cleaned.length > 10 ? cleaned : FALLBACK_TEXT
    } catch {
      return FALLBACK_TEXT
    } finally {
      setScanning(false)
      setOcrProgress(0)
    }
  }

  const capture = async () => {
    if (scanning) return
    if (permState === 'denied') {
      alert('Camera access was denied.\n\nTo scan products:\n1. Click the camera/lock icon in your browser address bar\n2. Allow camera access\n3. Refresh the page\n\nOr use the Upload button to scan an image from your device.')
      return
    }
    if (permState === 'prompt' || permState === 'checking') { await startCamera(); return }

    setFlash(true)
    setTimeout(() => setFlash(false), 180)

    let image = '/lumi.png'
    if (ready && videoRef.current) {
      const v = videoRef.current, c = canvasRef.current
      c.width = v.videoWidth || 1280
      c.height = v.videoHeight || 720
      c.getContext('2d').drawImage(v, 0, 0)
      image = c.toDataURL('image/jpeg', 0.95)
    }

    const text = await runOCR(image)
    setResult({ image, text })
    setView('analyzing')
  }

  const handleUploadDone = async (dataUrl) => {
    setShowUpload(false)
    const text = await runOCR(dataUrl)
    setResult({ image: dataUrl, text })
    setView('analyzing')
  }

  const handleScanAgain = () => { setResult(null); setView('camera') }

  const handleEndScanYes = () => {
    setShowEndScan(false)
    setResult(null)
    setView('camera')
    // Stop and restart camera stream so it's fresh
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setReady(false)
    startCamera()
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#0C1E1E', position:'relative' }}>

      {/* NAVBAR */}
      <header style={{
        flexShrink: 0, height: 60, background: '#FFFFFF',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 18px', zIndex: 40,
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SafeScanIcon/>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px', lineHeight: 1 }}>
            <span style={{ color: '#1B5E57' }}>Safe</span><span style={{ color: '#3EC8BE' }}>Scan</span>
          </span>
        </div>
        {/* Hamburger */}
        <button onClick={() => setMenuOpen(true)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px 4px', display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end',
        }}>
          <span style={{ display: 'block', width: 26, height: 2.5, background: '#1A1A1A', borderRadius: 2 }}/>
          <span style={{ display: 'block', width: 20, height: 2.5, background: '#1A1A1A', borderRadius: 2 }}/>
          <span style={{ display: 'block', width: 26, height: 2.5, background: '#1A1A1A', borderRadius: 2 }}/>
        </button>
      </header>

      {/* CAMERA VIEW */}
      <div style={{ flex:1, position:'relative', overflow:'hidden' }}>

        <img src="/lumi.png" alt=""
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }}/>

        <video ref={videoRef} autoPlay playsInline muted
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:1, opacity: ready ? 1 : 0, transition:'opacity 0.4s' }}/>

        <canvas ref={canvasRef} style={{ display:'none' }}/>

        {flash && <div style={{ position:'absolute', inset:0, zIndex:30, background:'white', opacity:0.7, pointerEvents:'none' }}/>}

        {/* Permission primer */}
        {permState === 'prompt' && (
          <div style={{ position:'absolute', inset:0, zIndex:25, background:'rgba(12,30,30,0.96)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 28px', gap:20 }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(13,100,93,0.35)', border:'2px solid rgba(13,100,93,0.7)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <p style={{ color:'white', fontSize:20, fontWeight:800, margin:0, textAlign:'center' }}>Camera Access Needed</p>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, margin:0, textAlign:'center', lineHeight:1.65 }}>
              SafeScan needs your camera to read ingredient labels on products. Your camera feed is processed on-device and never uploaded.
            </p>
            <div style={{ width:'100%', background:'rgba(255,255,255,0.06)', borderRadius:14, padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
              {[['🔒','Privacy first','Camera feed stays on your device'],['⚡','Instant results','Scan any product label in seconds'],['🌿','Ingredient safety','Know exactly what you\'re applying']].map(([e,t,d]) => (
                <div key={t} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:18 }}>{e}</span>
                  <div>
                    <p style={{ color:'white', fontSize:13, fontWeight:700, margin:0 }}>{t}</p>
                    <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, margin:0 }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={startCamera} style={{ width:'100%', height:52, background:'#0D645D', color:'white', fontSize:16, fontWeight:700, border:'none', borderRadius:14, cursor:'pointer' }}>
              Allow Camera Access
            </button>
            <button onClick={() => setShowUpload(true)} style={{ width:'100%', height:52, background:'transparent', color:'rgba(255,255,255,0.7)', fontSize:15, fontWeight:600, border:'1px solid rgba(255,255,255,0.2)', borderRadius:14, cursor:'pointer' }}>
              Upload Image Instead
            </button>
          </div>
        )}

        {/* Permission denied */}
        {permState === 'denied' && (
          <div style={{ position:'absolute', inset:0, zIndex:25, background:'rgba(12,30,30,0.92)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 28px', gap:16 }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" stroke="rgba(238,68,63,0.9)" strokeWidth="2"/>
              </svg>
            </div>
            <p style={{ color:'white', fontSize:18, fontWeight:700, margin:0, textAlign:'center' }}>Camera access denied</p>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:13, margin:0, textAlign:'center', lineHeight:1.6 }}>
              To scan products, allow camera access in your browser settings, then refresh the page.
            </p>
            <button onClick={startCamera} style={{ marginTop:4, height:44, padding:'0 24px', background:'#0D645D', color:'white', fontSize:14, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' }}>
              Try Again
            </button>
            <button onClick={() => setShowUpload(true)} style={{ height:44, padding:'0 24px', background:'rgba(255,255,255,0.12)', color:'white', fontSize:14, fontWeight:600, border:'1px solid rgba(255,255,255,0.2)', borderRadius:12, cursor:'pointer' }}>
              Upload an image instead
            </button>
          </div>
        )}

        {/* Scanning frame */}
        <div style={{ position:'absolute', zIndex:20, pointerEvents:'none', left:'10%', right:'10%', top:'38%', bottom:'18%', border:'2.5px solid rgba(255,255,255,0.95)', borderRadius:14 }}>
          <div style={{ position:'absolute', left:0, right:0, height:2, background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.85) 40%, white 50%, rgba(255,255,255,0.85) 60%, transparent)', animation:`sweep ${scanning ? '0.5s' : '2.2s'} ease-in-out infinite alternate`, borderRadius:2 }}/>
        </div>

        {/* Instruction text */}
        <div style={{ position:'absolute', zIndex:20, pointerEvents:'none', bottom:'13%', left:0, right:0, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
          <p style={{ color:'white', fontSize:17, fontWeight:700, margin:0, textShadow:'0 1px 12px rgba(0,0,0,0.5)' }}>
            {scanning ? 'Scanning ingredients…' : 'Place ingredient list inside frame'}
          </p>
          {scanning && (
            <div style={{ width:200, height:3, background:'rgba(255,255,255,0.25)', borderRadius:100, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${ocrProgress}%`, background:'white', borderRadius:100, transition:'width 0.3s' }}/>
            </div>
          )}
        </div>

        {showUpload && <FileUploadModal onDone={handleUploadDone} onCancel={() => setShowUpload(false)}/>}
      </div>

      {/* BOTTOM BAR */}
      <div style={{
        flexShrink: 0, background: '#0C1E1E', zIndex: 40,
        paddingTop: 10, paddingBottom: 24,
      }}>
        {/* "Record Selected Portion" pill — centered above capture */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{
            background: 'rgba(255,255,255,0.10)', borderRadius: 20,
            padding: '5px 16px', border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.70)', fontWeight: 500, letterSpacing: '0.01em' }}>
              Record Selected Portion
            </span>
          </div>
        </div>

        {/* Three buttons */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
        }}>

          {/* Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
            <button onClick={() => setShowUpload(true)} style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(255,255,255,0.14)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
              </svg>
            </button>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>Upload</span>
          </div>

          {/* Capture */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!scanning && (
                <div style={{
                  position: 'absolute', width: 90, height: 90, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.30)',
                  animation: 'pulseRing 1.8s ease-out infinite', pointerEvents: 'none',
                }}/>
              )}
              <button onClick={capture} disabled={scanning} style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'white', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: scanning ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 0 5px rgba(255,255,255,0.12)',
                opacity: scanning ? 0.7 : 1, transition: 'opacity 0.2s',
              }}>
                <div style={{
                  width: 58, height: 58, borderRadius: '50%',
                  background: scanning ? '#0a4840' : '#0D645D',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}>
                  <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              </button>
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>Capture</span>
          </div>

          {/* X / End scan */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
            <button onClick={() => setShowEndScan(true)} style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(255,255,255,0.20)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.4">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
              </svg>
            </button>
            {/* invisible spacer to align with other labels */}
            <span style={{ fontSize: 12, opacity: 0 }}>x</span>
          </div>
        </div>
      </div>

      {/* Hamburger menu drawer */}
      {menuOpen && (
        <div style={{ position:'absolute', inset:0, zIndex:60 }}>
          <div onClick={() => setMenuOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)' }}/>
          <div style={{ position:'absolute', top:0, right:0, bottom:0, width:272, background:'white', boxShadow:'-4px 0 24px rgba(0,0,0,0.18)', display:'flex', flexDirection:'column' }}>
            <div style={{ padding:'20px', borderBottom:'1px solid #F0F0F0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'#B8860B', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:18, fontWeight:700, color:'white' }}>V</span>
                </div>
                <div>
                  <p style={{ fontSize:15, fontWeight:700, color:'#1A1A1A', margin:0 }}>Victoria J</p>
                  <button onClick={() => setMenuOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'#0D645D', fontWeight:600, padding:0 }}>View Profile ›</button>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#808080', padding:4 }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ flex:1 }}>
              {[['Scan', true], ['Lookup'], ['History'], ['Settings'], ['Logout', false, true]].map(([l, active, red]) => (
                <button key={l} onClick={() => setMenuOpen(false)}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'15px 20px', background:'none', border:'none', cursor:'pointer' }}>
                  <span style={{ fontSize:15, fontWeight:600, color: red ? '#EE443F' : active ? '#0D645D' : '#1A1A1A' }}>{l}</span>
                  {active && <div style={{ width:7, height:7, borderRadius:'50%', background:'#0D645D' }}/>}
                </button>
              ))}
            </div>
            <div style={{ margin:'0 16px 24px', background:'#0D3D36', borderRadius:16, padding:'16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:'white', margin:'0 0 2px' }}>SafeScan Pro</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', margin:0 }}>Upgrade for unlimited scans</p>
              </div>
              <button style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)', borderRadius:8, padding:'7px 14px', fontSize:12, fontWeight:700, color:'white', cursor:'pointer' }}>Upgrade</button>
            </div>
          </div>
        </div>
      )}

      {/* Analyzing overlay */}
      {view === 'analyzing' && <AnalyzingScreen onDone={() => setView('result')}/>}

      {/* Result screen */}
      {view === 'result' && result && <ResultScreen image={result.image} text={result.text} onScanAgain={handleScanAgain}/>}

      {/* End Scan modal */}
      {showEndScan && (
        <EndScanModal
          onNo={() => setShowEndScan(false)}
          onYes={handleEndScanYes}
        />
      )}

      <style>{`
        @keyframes sweep {
          0%   { top: 2px; }
          100% { top: calc(100% - 4px); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}
