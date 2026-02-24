import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SafeScanIcon = () => (
  <svg width="32" height="34" viewBox="0 0 38 44" fill="none">
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="#1E6B64"/>
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="url(#sg-lu)"/>
    <path d="M8 24C10 18,14 14,19 13C24 12,30 16,33 21C33 26,30 32,26 36C22 39.5,19 41,19 41C19 41,8 34,8 24Z" fill="#3EC8BE" opacity="0.85"/>
    <path d="M13 22L17.5 27L25.5 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="sg-lu" x1="3" y1="2" x2="35" y2="43" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2A8078" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#0D4840" stopOpacity="0.2"/>
      </linearGradient>
    </defs>
  </svg>
)

const ALL_INGREDIENTS = [
  { name:'Retinol',           status:'Risky',      desc:'A derivative of Vitamin A used for anti-aging. Can cause sensitivity to sunlight.' },
  { name:'Hyaluronic Acid',   status:'Safe',       desc:'A naturally occurring substance in the skin that helps retain moisture.' },
  { name:'Sulphates',         status:'Restricted', desc:'Harsh cleansing agents that can strip skin of natural oils and cause irritation.' },
  { name:'Niacinamide',       status:'Safe',       desc:'Vitamin B3 that brightens skin tone, reduces pores, and strengthens the barrier.' },
  { name:'Fragrance',         status:'Risky',      desc:'Can cause allergic reactions and skin sensitization in certain individuals.' },
  { name:'Ceramides',         status:'Safe',       desc:'Lipids that restore and maintain the natural skin barrier function.' },
  { name:'Parabens',          status:'Restricted', desc:'Preservatives linked to hormone disruption in long-term studies.' },
  { name:'Glycerin',          status:'Safe',       desc:'Humectant that draws moisture into the skin from the environment.' },
  { name:'Alcohol Denat.',    status:'Risky',      desc:'Drying alcohol that disrupts skin barrier with repeated use.' },
  { name:'Vitamin C (L-AA)', status:'Safe',       desc:'Powerful antioxidant that brightens and protects against UV damage.' },
]

const BADGE = {
  Safe:       { bg:'#ECF8EF', color:'#43B75D', border:'#C5E9CD' },
  Risky:      { bg:'#FFF7E6', color:'#FFAA00', border:'#FFE5B0' },
  Restricted: { bg:'#FDECEC', color:'#EE443F', border:'#FAC5C3' },
}

export default function LookupPage() {
  const navigate = useNavigate()
  const [query, setQuery]     = useState('')
  const [expanded, setExpanded] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const filtered = ALL_INGREDIENTS.filter(i =>
    i.name.toLowerCase().includes(query.toLowerCase()) ||
    i.desc.toLowerCase().includes(query.toLowerCase())
  )

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
        <h1 style={{ fontSize:28, fontWeight:800, color:'#1A1A1A', margin:'0 0 24px', letterSpacing:'-0.5px' }}>
          Ingredient Lookup
        </h1>

        {/* Search bar */}
        <div style={{ position:'relative', marginBottom:28 }}>
          <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#AAAAAA" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
            </svg>
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search chemical name or ingredient...."
            style={{ width:'100%', height:50, borderRadius:14, border:'1.5px solid #E7F0EF', background:'#FEFEFE', padding:'0 16px 0 44px', fontSize:14, color:'#1A1A1A', outline:'none', boxSizing:'border-box' }}
          />
        </div>

        {/* Section header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#484848" strokeWidth="2"><rect x="3" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/><rect x="14" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/><rect x="14" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize:15, fontWeight:700, color:'#1A1A1A' }}>Common Ingredients</span>
          </div>
          <span style={{ fontSize:13, color:'#808080' }}>{filtered.length} found</span>
        </div>

        {/* Ingredient cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map((ing, i) => {
            const b = BADGE[ing.status]
            const isOpen = expanded === i
            return (
              <div key={i} style={{ background:'white', border:`1.5px solid ${b.border}`, borderRadius:16, padding:'16px 18px', boxShadow:'0 1px 6px rgba(0,0,0,0.04)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:16, fontWeight:700, color:'#1A1A1A' }}>{ing.name}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:b.color, background:b.bg, border:`1px solid ${b.border}`, borderRadius:100, padding:'4px 12px' }}>
                    {ing.status}
                  </span>
                </div>
                <p style={{ fontSize:13, color:'#484848', margin:'0 0 12px', lineHeight:1.55 }}>{ing.desc}</p>
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, padding:0 }}
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize:13, fontWeight:600, color:'#0D645D' }}>View Clinical Data</span>
                </button>
                {isOpen && (
                  <div style={{ marginTop:12, padding:'12px 14px', background:'#F8FAFA', borderRadius:12, border:'1px solid #E7F0EF' }}>
                    <p style={{ fontSize:12, color:'#484848', margin:'0 0 6px', fontWeight:700 }}>Clinical Notes</p>
                    <p style={{ fontSize:12, color:'#808080', margin:0, lineHeight:1.6 }}>
                      Based on 12+ peer-reviewed studies. Safety classification: <strong style={{ color:b.color }}>{ing.status}</strong>. Regulatory status varies by country. Always consult a dermatologist if you have sensitive skin.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'40px 20px', color:'#AAAAAA' }}>
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#CCCCCC" strokeWidth="1.5" style={{ display:'block', margin:'0 auto 12px' }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
              </svg>
              <p style={{ margin:0, fontSize:14 }}>No ingredients found</p>
            </div>
          )}
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
                style={{ display:'block', width:'100%', textAlign:'left', padding:'15px 20px', background:'none', border:'none', fontSize:15, fontWeight:600, color: l==='Lookup' ? '#0D645D' : '#1A1A1A', cursor:'pointer' }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
