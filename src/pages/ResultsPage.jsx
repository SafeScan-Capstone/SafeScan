import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const SafeScanIcon = () => (
  <svg width="32" height="34" viewBox="0 0 38 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="#1E6B64"/>
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="url(#sh-outer-r)"/>
    <path d="M8 24 C10 18, 14 14, 19 13 C24 12, 30 16, 33 21 C33 26, 30 32, 26 36 C22 39.5, 19 41, 19 41 C19 41, 8 34, 8 24Z" fill="#3EC8BE" opacity="0.85"/>
    <path d="M13 22L17.5 27L25.5 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="sh-outer-r" x1="3" y1="2" x2="35" y2="43" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2A8078" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#0D4840" stopOpacity="0.2"/>
      </linearGradient>
    </defs>
  </svg>
)

const INGREDIENTS = [
  { name:'Aqua (Water)',      status:'Safe',       desc:'Primary solvent; safe and essential for all skin types.' },
  { name:'Glycerin',          status:'Safe',       desc:'Universal humectant that draws moisture into the skin.' },
  { name:'Sodium Hyaluronate',status:'Safe',       desc:'Powerful hydrator that holds 1000× its weight in water.' },
  { name:'Ceramide NP',       status:'Safe',       desc:'Restores the skin barrier and locks in hydration.' },
  { name:'Allantoin',         status:'Safe',       desc:'Soothing agent that promotes skin cell regeneration.' },
  { name:'Citric Acid',       status:'Risky',      desc:'Can cause irritation at high concentrations, especially on sensitive skin.' },
]

const BADGE = {
  Safe:       { bg:'#ECF8EF', color:'#43B75D', border:'#C5E9CD' },
  Risky:      { bg:'#FFF7E6', color:'#FFAA00', border:'#FFE5B0' },
  Restricted: { bg:'#FDECEC', color:'#EE443F', border:'#FAC5C3' },
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const riskyCount = INGREDIENTS.filter(i => i.status === 'Risky' || i.status === 'Restricted').length
  const safeCount  = INGREDIENTS.filter(i => i.status === 'Safe').length

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

      {/* Scrollable body */}
      <div style={{ flex:1, overflowY:'auto' }}>

        {/* Hero image */}
        <div style={{ position:'relative', height:200, background:'#1A1A1A' }}>
          <img
            src={state?.image || '/lumi.png'}
            alt="scanned product"
            style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.85 }}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }}/>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'0 20px 18px' }}>
            <p style={{ color:'white', fontSize:18, fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.3px' }}>
              LUMI Hydration Boost Serum
            </p>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, margin:0 }}>Skincare · Serum</p>
          </div>
        </div>

        <div style={{ padding:'20px 20px 24px' }}>

          {/* Result card */}
          <div style={{ background: riskyCount > 0 ? '#FDECEC' : '#ECF8EF', border:`1px solid ${riskyCount > 0 ? '#FAC5C3' : '#C5E9CD'}`, borderRadius:16, padding:'16px', marginBottom:20, display:'flex', alignItems:'flex-start', gap:12 }}>
            {riskyCount > 0 ? (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#EE443F" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01" strokeLinecap="round"/></svg>
            ) : (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#43B75D" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}><path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
            <div>
              <p style={{ fontSize:15, fontWeight:700, color:'#1A1A1A', margin:'0 0 4px' }}>
                {riskyCount > 0 ? 'Contains Risky Ingredients' : 'Safe to Use'}
              </p>
              <p style={{ fontSize:13, color:'#484848', margin:0, lineHeight:1.5 }}>
                {riskyCount > 0
                  ? `${riskyCount} ingredient${riskyCount > 1 ? 's' : ''} flagged. Review details below.`
                  : 'All ingredients are safe for general use.'}
              </p>
            </div>
          </div>

          {/* Summary badges */}
          <p style={{ fontSize:15, fontWeight:700, color:'#1A1A1A', margin:'0 0 12px' }}>Summary</p>
          <div style={{ display:'flex', gap:8, marginBottom:20 }}>
            {Object.entries(BADGE).map(([s, b]) => {
              const cnt = INGREDIENTS.filter(i => i.status === s).length
              if (!cnt) return null
              return (
                <span key={s} style={{ fontSize:13, fontWeight:700, color:b.color, background:b.bg, border:`1px solid ${b.border}`, borderRadius:100, padding:'6px 14px' }}>
                  {cnt} {s}
                </span>
              )
            })}
          </div>

          {/* Ingredient analysis */}
          <p style={{ fontSize:15, fontWeight:700, color:'#1A1A1A', margin:'0 0 12px' }}>Ingredient Analysis</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {INGREDIENTS.map((ing, i) => {
              const b = BADGE[ing.status]
              return (
                <div key={i} style={{ background:'white', border:`1.5px solid ${b.border}`, borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:12 }}>
                  <span style={{ width:10, height:10, borderRadius:'50%', background:b.color, flexShrink:0, marginTop:4 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:'#1A1A1A' }}>{ing.name}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:b.color, background:b.bg, borderRadius:100, padding:'3px 10px' }}>{ing.status}</span>
                    </div>
                    <p style={{ fontSize:12, color:'#808080', margin:0, lineHeight:1.5 }}>{ing.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ flexShrink:0, padding:'12px 20px 32px', borderTop:'1px solid #F3F4F6' }}>
        <button
          onClick={() => navigate('/scan')}
          style={{ width:'100%', height:56, background:'#0D645D', color:'white', fontSize:17, fontWeight:700, border:'none', borderRadius:14, cursor:'pointer' }}
        >
          Scan Another Product
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
