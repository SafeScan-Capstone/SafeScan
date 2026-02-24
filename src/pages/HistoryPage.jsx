import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SafeScanIcon = () => (
  <svg width="32" height="34" viewBox="0 0 38 44" fill="none">
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="#1E6B64"/>
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="url(#sg-hi)"/>
    <path d="M8 24C10 18,14 14,19 13C24 12,30 16,33 21C33 26,30 32,26 36C22 39.5,19 41,19 41C19 41,8 34,8 24Z" fill="#3EC8BE" opacity="0.85"/>
    <path d="M13 22L17.5 27L25.5 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="sg-hi" x1="3" y1="2" x2="35" y2="43" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2A8078" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#0D4840" stopOpacity="0.2"/>
      </linearGradient>
    </defs>
  </svg>
)

const HISTORY = [
  { name:'LUMI Hydration Boost Serum', type:'Serum', date:'Feb 24, 2026', status:'Risky',      img:'/lumi.png' },
  { name:'CeraVe Moisturizing Cream',  type:'Moisturizer', date:'Feb 22, 2026', status:'Safe', img:null },
  { name:'La Roche-Posay SPF 50+',     type:'Sunscreen', date:'Feb 20, 2026', status:'Safe',   img:null },
  { name:'The Ordinary Retinol 1%',    type:'Serum', date:'Feb 18, 2026', status:'Risky',      img:null },
  { name:'Neutrogena Deep Moisture',   type:'Body Lotion', date:'Feb 15, 2026', status:'Safe', img:null },
]

const BADGE = {
  Safe:  { bg:'#ECF8EF', color:'#43B75D' },
  Risky: { bg:'#FDECEC', color:'#EE443F' },
}

export default function HistoryPage() {
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
      <div style={{ flex:1, overflowY:'auto', padding:'28px 20px 24px' }}>
        <h1 style={{ fontSize:28, fontWeight:800, color:'#1A1A1A', margin:'0 0 6px', letterSpacing:'-0.5px' }}>
          Scan History
        </h1>
        <p style={{ fontSize:14, color:'#808080', margin:'0 0 24px' }}>Your recently scanned products</p>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {HISTORY.map((item, i) => {
            const b = BADGE[item.status]
            return (
              <button
                key={i}
                onClick={() => navigate('/results')}
                style={{ display:'flex', alignItems:'center', gap:14, background:'white', border:'1.5px solid #F3F4F6', borderRadius:16, padding:'14px 16px', cursor:'pointer', textAlign:'left', width:'100%' }}
              >
                {/* Thumbnail */}
                <div style={{ width:56, height:56, borderRadius:12, background:'#E7F0EF', flexShrink:0, overflow:'hidden' }}>
                  {item.img
                    ? <img src={item.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="10" r="3"/><path d="M3 21c0-4 3.6-7 9-7s9 3 9 7" strokeLinecap="round"/></svg>
                      </div>
                  }
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:14, fontWeight:700, color:'#1A1A1A', margin:'0 0 3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</p>
                  <p style={{ fontSize:12, color:'#808080', margin:'0 0 6px' }}>{item.type} · {item.date}</p>
                  <span style={{ fontSize:11, fontWeight:700, color:b.color, background:b.bg, borderRadius:100, padding:'3px 10px' }}>
                    {item.status}
                  </span>
                </div>

                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#C0C0C0" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )
          })}
        </div>

        {/* Scan more CTA */}
        <button
          onClick={() => navigate('/scan')}
          style={{ width:'100%', height:52, background:'#0D645D', color:'white', fontSize:15, fontWeight:700, border:'none', borderRadius:14, cursor:'pointer', marginTop:24, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Scan Another Product
        </button>
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
                style={{ display:'block', width:'100%', textAlign:'left', padding:'15px 20px', background:'none', border:'none', fontSize:15, fontWeight:600, color: l==='History' ? '#0D645D' : '#1A1A1A', cursor:'pointer' }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
