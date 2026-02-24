import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SafeScanIcon = () => (
  <svg width="32" height="34" viewBox="0 0 38 44" fill="none">
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="#1E6B64"/>
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="url(#sg-hp)"/>
    <path d="M8 24C10 18,14 14,19 13C24 12,30 16,33 21C33 26,30 32,26 36C22 39.5,19 41,19 41C19 41,8 34,8 24Z" fill="#3EC8BE" opacity="0.85"/>
    <path d="M13 22L17.5 27L25.5 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="sg-hp" x1="3" y1="2" x2="35" y2="43" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2A8078" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#0D4840" stopOpacity="0.2"/>
      </linearGradient>
    </defs>
  </svg>
)

const TYPES = ['Moisturizer','Serum','Cleanser','Sunscreen','Toner','Face Mask','Eye Cream','Body Lotion']

export default function HomePage() {
  const navigate = useNavigate()
  const [type, setType]         = useState('')
  const [dropOpen, setDropOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#FEFEFE' }}>

      {/* Navbar */}
      <header style={{ flexShrink:0, height:64, background:'white', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', boxShadow:'0 1px 0 rgba(0,0,0,0.06)', zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <SafeScanIcon/>
          <span style={{ fontSize:20, fontWeight:700, letterSpacing:'-0.3px' }}>
            <span style={{ color:'#1B5E57' }}>Safe</span><span style={{ color:'#3EC8BE' }}>Scan</span>
          </span>
        </div>
        <button onClick={() => setMenuOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', padding:8, display:'flex', flexDirection:'column', gap:5.5 }}>
          <span style={{ display:'block', width:24, height:2.5, background:'#1A1A1A', borderRadius:2 }}/>
          <span style={{ display:'block', width:24, height:2.5, background:'#1A1A1A', borderRadius:2 }}/>
          <span style={{ display:'block', width:24, height:2.5, background:'#1A1A1A', borderRadius:2 }}/>
        </button>
      </header>

      {/* Scrollable body */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 32px' }}>

        {/* Hero image with badge inside */}
        <div style={{ position:'relative', borderRadius:20, overflow:'hidden', height:280, marginBottom:24 }}>
          <img src="/curology.jpg" alt="product" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>

          {/* Verified Ingredients floating badge — bottom-left inside hero */}
          <div style={{
            position:'absolute', bottom:16, left:16,
            background:'white', borderRadius:14, padding:'10px 14px',
            display:'flex', alignItems:'center', gap:10,
            boxShadow:'0 4px 20px rgba(0,0,0,0.15)',
          }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'#0D645D', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:'#1A1A1A', margin:0 }}>Verified Ingredients</p>
              <p style={{ fontSize:11, color:'#808080', margin:0 }}>Clinically tested database</p>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize:30, fontWeight:800, color:'#1A1A1A', margin:'0 0 12px', lineHeight:1.2, letterSpacing:'-0.5px' }}>
          Scan your <span style={{ color:'#0D645D' }}>Products</span><br/>for safety.
        </h1>
        <p style={{ fontSize:15, color:'#484848', margin:'0 0 24px', lineHeight:1.6 }}>
          Identify toxic ingredients instantly. Set your health profile and let our AI do the clinical analysis for you.
        </p>

        {/* Product type label + dropdown */}
        <p style={{ fontSize:15, fontWeight:700, color:'#1A1A1A', margin:'0 0 10px' }}>Product type (optional)</p>
        <div style={{ position:'relative', marginBottom:20 }}>
          <button
            onClick={() => setDropOpen(o => !o)}
            style={{
              width:'100%', height:54, background:'white',
              border:'1.5px solid #D2D5DB', borderRadius:14,
              padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between',
              cursor:'pointer', fontSize:15, color: type ? '#1A1A1A' : '#AAAAAA',
              fontWeight: type ? 500 : 400,
            }}
          >
            <span>{type || 'Select Product Category'}</span>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {dropOpen && (
            <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:'white', border:'1.5px solid #E7F0EF', borderRadius:14, zIndex:20, overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.1)' }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => { setType(t); setDropOpen(false) }}
                  style={{ display:'block', width:'100%', padding:'13px 16px', background: t===type ? '#E7F0EF' : 'white', border:'none', textAlign:'left', fontSize:14, color:'#1A1A1A', cursor:'pointer', fontWeight: t===type ? 700 : 400 }}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Open Camera */}
        <button
          onClick={async () => {
            try {
              // Pre-check permission — this prompts the user if not yet decided
              await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            } catch (e) {
              // Denied or unavailable — navigate anyway, camera page will show the overlay
            }
            navigate('/scan')
          }}
          style={{ width:'100%', height:54, background:'#0D645D', color:'white', fontSize:16, fontWeight:700, border:'none', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', gap:10, cursor:'pointer', marginBottom:14 }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Open Camera
        </button>

        {/* Upload Image */}
        <button
          onClick={() => navigate('/scan')}
          style={{ width:'100%', height:54, background:'white', color:'#0D645D', fontSize:16, fontWeight:700, border:'1.5px solid #D2D5DB', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', gap:10, cursor:'pointer', marginBottom:28 }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
          </svg>
          Upload Image
        </button>

        {/* Bottom badges */}
        <div style={{ display:'flex', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'#E7F0EF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:'#1A1A1A', margin:0 }}>Instant Analysis</p>
              <p style={{ fontSize:12, color:'#808080', margin:0 }}>Results in seconds</p>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'#E7F0EF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <path d="M12 18h.01" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:'#1A1A1A', margin:0 }}>Mobile Optimized</p>
              <p style={{ fontSize:12, color:'#808080', margin:0 }}>Scan on the go</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu drawer */}
      {menuOpen && (
        <div style={{ position:'absolute', inset:0, zIndex:60 }}>
          <div onClick={() => setMenuOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)' }}/>
          <div style={{ position:'absolute', top:0, right:0, bottom:0, width:272, background:'white', boxShadow:'-4px 0 24px rgba(0,0,0,0.18)', display:'flex', flexDirection:'column' }}>
            <div style={{ padding:'20px', borderBottom:'1px solid #F0F0F0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'#B8860B', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:18, fontWeight:700, color:'white' }}>V</span>
                </div>
                <div>
                  <p style={{ fontSize:15, fontWeight:700, color:'#1A1A1A', margin:0 }}>Victoria J</p>
                  <button onClick={() => { setMenuOpen(false); navigate('/profile') }} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'#0D645D', fontWeight:600, padding:0 }}>View Profile ›</button>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#808080', padding:4 }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ flex:1 }}>
              {[['Scan','/scan'],['Lookup','/lookup'],['History','/history'],['Settings','/profile'],['Logout','/',false,true]].map(([l,p,,red]) => (
                <button key={l} onClick={() => { setMenuOpen(false); navigate(p) }}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'15px 20px', background:'none', border:'none', cursor:'pointer' }}>
                  <span style={{ fontSize:15, fontWeight:600, color: red ? '#EE443F' : '#1A1A1A' }}>{l}</span>
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
    </div>
  )
}
