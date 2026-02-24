import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SafeScanIcon = () => (
  <svg width="32" height="34" viewBox="0 0 38 44" fill="none">
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="#1E6B64"/>
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="url(#sg-pr)"/>
    <path d="M8 24C10 18,14 14,19 13C24 12,30 16,33 21C33 26,30 32,26 36C22 39.5,19 41,19 41C19 41,8 34,8 24Z" fill="#3EC8BE" opacity="0.85"/>
    <path d="M13 22L17.5 27L25.5 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="sg-pr" x1="3" y1="2" x2="35" y2="43" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2A8078" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#0D4840" stopOpacity="0.2"/>
      </linearGradient>
    </defs>
  </svg>
)

export default function ProfilePage() {
  const navigate = useNavigate()
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

      {/* Body */}
      <div style={{ flex:1, overflowY:'auto' }}>

        {/* Profile card */}
        <div style={{ background:'#EEF3F2', margin:'24px 20px', borderRadius:20, padding:'28px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
          {/* Avatar */}
          <div style={{ position:'relative' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'#B8860B', display:'flex', alignItems:'center', justifyContent:'center', border:'3px solid white', overflow:'hidden' }}>
              <span style={{ fontSize:32, fontWeight:700, color:'white' }}>V</span>
            </div>
            <div style={{ position:'absolute', bottom:2, right:2, width:16, height:16, borderRadius:'50%', background:'#43B75D', border:'2px solid white' }}/>
          </div>
          <div style={{ textAlign:'center' }}>
            <p style={{ fontSize:20, fontWeight:700, color:'#1A1A1A', margin:'0 0 4px' }}>Victoria J</p>
            <p style={{ fontSize:13, color:'#808080', margin:'0 0 2px' }}>SafeScan Pro Member</p>
            <p style={{ fontSize:13, color:'#808080', margin:0 }}>Since Feb 2026</p>
          </div>
          <button style={{ height:40, padding:'0 24px', background:'white', border:'1.5px solid #D2D5DB', borderRadius:12, fontSize:14, fontWeight:700, color:'#1A1A1A', cursor:'pointer' }}>
            Edit profile
          </button>
        </div>

        {/* Preferences section */}
        <div style={{ padding:'0 20px 32px' }}>
          <h2 style={{ fontSize:24, fontWeight:800, color:'#1A1A1A', margin:'0 0 20px', letterSpacing:'-0.3px' }}>
            Preferences
          </h2>

          <div style={{ background:'white', border:'1.5px solid #F3F4F6', borderRadius:20, overflow:'hidden' }}>

            {/* Notifications */}
            <div style={{ display:'flex', alignItems:'center', padding:'18px 20px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'#F3F4F6', display:'flex', alignItems:'center', justifyContent:'center', marginRight:16, flexShrink:0 }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#484848" strokeWidth="1.8">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ flex:1, fontSize:15, fontWeight:600, color:'#1A1A1A' }}>Notifications</span>
              <span style={{ fontSize:14, color:'#808080' }}>Managed</span>
            </div>

            {/* Subscription */}
            <div style={{ display:'flex', alignItems:'center', padding:'18px 20px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'#F3F4F6', display:'flex', alignItems:'center', justifyContent:'center', marginRight:16, flexShrink:0 }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#484848" strokeWidth="1.8">
                  <rect x="1" y="4" width="22" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 10h22" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ flex:1, fontSize:15, fontWeight:600, color:'#1A1A1A' }}>Subscription</span>
              <span style={{ fontSize:12, fontWeight:700, color:'#0D645D', background:'#E7F0EF', borderRadius:100, padding:'4px 12px' }}>Free Plan</span>
            </div>

            {/* About */}
            <div style={{ display:'flex', alignItems:'center', padding:'18px 20px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'#F3F4F6', display:'flex', alignItems:'center', justifyContent:'center', marginRight:16, flexShrink:0 }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#484848" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ flex:1, fontSize:15, fontWeight:600, color:'#1A1A1A' }}>About SafeScan</span>
              <span style={{ fontSize:14, color:'#808080' }}>v1.0.4</span>
            </div>

            {/* Log Out */}
            <button
              onClick={() => navigate('/landing')}
              style={{ display:'flex', alignItems:'center', padding:'18px 20px', width:'100%', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'#FDECEC', display:'flex', alignItems:'center', justifyContent:'center', marginRight:16, flexShrink:0 }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#EE443F" strokeWidth="1.8">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize:15, fontWeight:700, color:'#EE443F' }}>Log Out</span>
            </button>
          </div>

          {/* Upgrade card */}
          <div style={{ marginTop:20, background:'#0D3D36', borderRadius:20, padding:'20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <p style={{ fontSize:15, fontWeight:700, color:'white', margin:'0 0 4px' }}>SafeScan Pro</p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.65)', margin:0 }}>Unlimited scans + history</p>
            </div>
            <button style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)', borderRadius:10, padding:'8px 16px', fontSize:13, fontWeight:700, color:'white', cursor:'pointer' }}>
              Upgrade
            </button>
          </div>
        </div>
      </div>

      {/* Menu drawer */}
      {menuOpen && (
        <div style={{ position:'absolute', inset:0, zIndex:60 }}>
          <div onClick={() => setMenuOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)' }}/>
          <div style={{ position:'absolute', top:0, right:0, bottom:0, width:260, background:'white', padding:'24px 0', boxShadow:'-4px 0 24px rgba(0,0,0,0.18)' }}>
            <div style={{ padding:'0 20px 18px', borderBottom:'1px solid #F0F0F0', display:'flex', alignItems:'center', gap:9 }}>
              <SafeScanIcon/>
              <span style={{ fontSize:18, fontWeight:700 }}><span style={{ color:'#1B5E57' }}>Safe</span><span style={{ color:'#3EC8BE' }}>Scan</span></span>
            </div>
            {[['Home','/home'],['Scan','/scan'],['Lookup','/lookup'],['History','/history'],['Profile','/profile']].map(([l,p]) => (
              <button key={l} onClick={() => { setMenuOpen(false); navigate(p) }}
                style={{ display:'block', width:'100%', textAlign:'left', padding:'15px 20px', background:'none', border:'none', fontSize:15, fontWeight:600, color: l==='Profile' ? '#0D645D' : '#1A1A1A', cursor:'pointer' }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
