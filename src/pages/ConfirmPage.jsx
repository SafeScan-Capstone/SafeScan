import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const SafeScanIcon = () => (
  <svg width="32" height="34" viewBox="0 0 38 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="#1E6B64"/>
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="url(#sh-outer-c)"/>
    <path d="M8 24 C10 18, 14 14, 19 13 C24 12, 30 16, 33 21 C33 26, 30 32, 26 36 C22 39.5, 19 41, 19 41 C19 41, 8 34, 8 24Z" fill="#3EC8BE" opacity="0.85"/>
    <path d="M13 22L17.5 27L25.5 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="sh-outer-c" x1="3" y1="2" x2="35" y2="43" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2A8078" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#0D4840" stopOpacity="0.2"/>
      </linearGradient>
    </defs>
  </svg>
)

export default function ConfirmPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [text, setText] = useState(state?.text || '')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#FEFEFE' }}>

      {/* Navbar */}
      <header style={{
        flexShrink: 0, height: 64,
        background: '#FFFFFF',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
        zIndex: 10,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <SafeScanIcon />
          <span style={{ fontSize:20, fontWeight:700, letterSpacing:'-0.3px', lineHeight:1 }}>
            <span style={{ color:'#1B5E57' }}>Safe</span>
            <span style={{ color:'#3EC8BE' }}>Scan</span>
          </span>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Menu"
          style={{ background:'none', border:'none', cursor:'pointer', padding:8,
                   display:'flex', flexDirection:'column', justifyContent:'center', gap:5 }}
        >
          <span style={{ display:'block', width:24, height:2.5, background:'#333', borderRadius:2 }}/>
          <span style={{ display:'block', width:24, height:2.5, background:'#333', borderRadius:2 }}/>
          <span style={{ display:'block', width:24, height:2.5, background:'#333', borderRadius:2 }}/>
        </button>
      </header>

      {/* Scrollable content */}
      <div style={{ flex:1, overflowY:'auto', padding:'32px 20px 0' }}>
        <h1 style={{ fontSize:28, fontWeight:800, color:'#1A1A1A', margin:'0 0 8px', letterSpacing:'-0.5px' }}>
          Confirm Ingredients
        </h1>
        <p style={{ fontSize:15, color:'#808080', margin:'0 0 28px', lineHeight:1.5 }}>
          Review and edit the extracted text if needed
        </p>

        <p style={{ fontSize:15, fontWeight:700, color:'#1A1A1A', margin:'0 0 12px' }}>
          Ingredient List
        </p>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter or edit ingredients..."
          rows={10}
          style={{
            width: '100%',
            padding: '18px',
            background: '#FEFEFE',
            border: '1.5px solid #E7F0EF',
            borderRadius: 20,
            fontSize: 14,
            color: '#1A1A1A',
            resize: 'none',
            outline: 'none',
            lineHeight: 1.7,
            boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
        />
        <p style={{ fontSize:13, color:'#808080', margin:'10px 0 24px' }}>
          Separate ingredients with commas
        </p>

        <button
          onClick={() => navigate('/scan')}
          style={{
            width: '100%', height: 52,
            background: 'white',
            border: '1.5px solid #D2D5DB',
            color: '#1A1A1A',
            fontSize: 15, fontWeight: 700,
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: 'pointer',
            marginBottom: 12,
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Re-scan
        </button>
      </div>

      {/* Sticky bottom CTA */}
      <div style={{ flexShrink:0, padding:'12px 20px 32px', borderTop:'1px solid #F3F4F6' }}>
        <button
          onClick={() => navigate('/analyzing', { state: { image: state?.image, text } })}
          style={{
            width: '100%', height: 56,
            background: '#0D645D',
            color: 'white',
            fontSize: 17, fontWeight: 700,
            border: 'none', borderRadius: 14,
            cursor: 'pointer',
            letterSpacing: '-0.1px',
          }}
        >
          Continue Analysis
        </button>
      </div>

      {/* Menu drawer */}
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
