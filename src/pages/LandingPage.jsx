import { useNavigate } from 'react-router-dom'

const SafeScanIcon = ({ size = 32 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 38 44" fill="none">
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="#1E6B64"/>
    <path d="M19 2L3 9V21C3 31 10.5 40 19 43C27.5 40 35 31 35 21V9L19 2Z" fill="url(#sg-lp)"/>
    <path d="M8 24C10 18,14 14,19 13C24 12,30 16,33 21C33 26,30 32,26 36C22 39.5,19 41,19 41C19 41,8 34,8 24Z" fill="#3EC8BE" opacity="0.85"/>
    <path d="M13 22L17.5 27L25.5 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="sg-lp" x1="3" y1="2" x2="35" y2="43" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2A8078" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#0D4840" stopOpacity="0.2"/>
      </linearGradient>
    </defs>
  </svg>
)

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="1.8">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
    title: 'Live Label Scanning',
    desc: 'Point your camera at any ingredient list. Our AI reads even the smallest text instantly.',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="1.8">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Personalized Flags',
    desc: 'Set your own sensitivities. We\'ll alert you if a product contains your specific allergens.',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Deep Search',
    desc: 'Access clinical studies and safety ratings for over 50,000 cosmetic ingredients.',
  },
]

const STATS = [
  { icon: <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" strokeLinecap="round"/></svg>, value: '50k+', label: 'INGREDIENTS INDEXED' },
  { icon: <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/></svg>, value: '12k+', label: 'CLINICAL STUDIES' },
  { icon: <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/></svg>, value: '2.4M', label: 'MONTHLY SCANS' },
  { icon: <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round"/></svg>, value: '4.9/5', label: 'SAFETY RATING' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#FEFEFE', overflowY:'auto' }}>

      {/* Navbar */}
      <header style={{ position:'sticky', top:0, zIndex:40, height:64, background:'white', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', boxShadow:'0 1px 0 rgba(0,0,0,0.06)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <SafeScanIcon size={32}/>
          <span style={{ fontSize:20, fontWeight:700, letterSpacing:'-0.3px' }}>
            <span style={{ color:'#1B5E57' }}>Safe</span><span style={{ color:'#3EC8BE' }}>Scan</span>
          </span>
        </div>
        <button onClick={() => navigate('/home')} style={{ background:'none', border:'none', cursor:'pointer', padding:8, display:'flex', flexDirection:'column', gap:5.5 }}>
          <span style={{ display:'block', width:24, height:2.5, background:'#1A1A1A', borderRadius:2 }}/>
          <span style={{ display:'block', width:24, height:2.5, background:'#1A1A1A', borderRadius:2 }}/>
          <span style={{ display:'block', width:24, height:2.5, background:'#1A1A1A', borderRadius:2 }}/>
        </button>
      </header>

      {/* Hero section */}
      <section style={{ padding:'48px 24px 40px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#E7F0EF', borderRadius:100, padding:'7px 16px', marginBottom:28 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize:12, fontWeight:600, color:'#0D645D' }}>Trusted by 1M+ health-conscious users</span>
        </div>
        <h1 style={{ fontSize:34, fontWeight:800, color:'#1A1A1A', margin:'0 0 16px', lineHeight:1.2, letterSpacing:'-1px' }}>
          Know what's <span style={{ color:'#0D645D' }}>inside</span> every bottle.
        </h1>
        <p style={{ fontSize:15, color:'#484848', margin:'0 0 32px', lineHeight:1.6 }}>
          Instantly scan product labels to identify toxic ingredients, allergens, and clinical safety ratings tailored to your unique skin profile.
        </p>
        <button onClick={() => navigate('/home')} style={{ display:'inline-flex', alignItems:'center', gap:10, height:52, padding:'0 28px', background:'#0D645D', color:'white', fontSize:16, fontWeight:700, border:'none', borderRadius:14, cursor:'pointer' }}>
          Launch Web App
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* Social proof */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginTop:24 }}>
          <div style={{ display:'flex' }}>
            {['#E8A87C','#6C9A8B','#B8860B','#8B7355'].map((c,i) => (
              <div key={i} style={{ width:32, height:32, borderRadius:'50%', background:c, border:'2px solid white', marginLeft: i>0 ? -10 : 0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:13, fontWeight:700, color:'white' }}>{['V','A','M','J'][i]}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'left' }}>
            <div style={{ display:'flex', gap:2 }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ color:'#FFAA00', fontSize:13 }}>★</span>)}
            </div>
            <span style={{ fontSize:12, color:'#808080', fontWeight:600 }}>4.9/5 RATING</span>
          </div>
        </div>
      </section>

      {/* Product image carousel area */}
      <section style={{ padding:'0 20px 40px' }}>
        <div style={{ borderRadius:20, overflow:'hidden', position:'relative', height:220, background:'#1A2F2A' }}>
          <img src="/lumi.png" alt="product" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.7 }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(13,100,93,0.3), transparent)' }}/>
          <div style={{ position:'absolute', top:16, left:16, background:'white', borderRadius:12, padding:'8px 12px', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(0,0,0,0.15)' }}>
            <div style={{ width:24, height:24, borderRadius:'50%', background:'#FDECEC', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#EE443F" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01" strokeLinecap="round"/></svg>
            </div>
            <div><p style={{ fontSize:10, fontWeight:700, color:'#1A1A1A', margin:0 }}>Flagged Ingredient</p><p style={{ fontSize:9, color:'#808080', margin:0 }}>Parabens Detected</p></div>
          </div>
          <div style={{ position:'absolute', bottom:16, right:16, background:'white', borderRadius:12, padding:'8px 12px', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(0,0,0,0.15)' }}>
            <div style={{ width:24, height:24, borderRadius:'50%', background:'#E7F0EF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#0D645D" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div><p style={{ fontSize:10, fontWeight:700, color:'#1A1A1A', margin:0 }}>98% Safety Score</p><p style={{ fontSize:9, color:'#0D645D', fontWeight:600, margin:0 }}>Clinically Approved</p></div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section style={{ padding:'0 20px 40px' }}>
        <h2 style={{ fontSize:28, fontWeight:800, color:'#1A1A1A', margin:'0 0 8px', letterSpacing:'-0.5px', lineHeight:1.2 }}>
          Everything you need for safe shopping.
        </h2>
        <p style={{ fontSize:14, color:'#808080', margin:'0 0 28px', lineHeight:1.6 }}>
          SafeScan combines AI label recognition with the world's largest clinical database.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background:'#F8FAFA', border:'1.5px solid #E7F0EF', borderRadius:20, padding:'24px 20px' }}>
              <div style={{ width:64, height:64, borderRadius:16, background:'#E7F0EF', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize:20, fontWeight:800, color:'#1A1A1A', margin:'0 0 8px', letterSpacing:'-0.3px' }}>{f.title}</h3>
              <p style={{ fontSize:14, color:'#484848', margin:0, lineHeight:1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats section */}
      <section style={{ padding:'0 20px 40px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:32, alignItems:'center', textAlign:'center' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'#E7F0EF', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {s.icon}
              </div>
              <span style={{ fontSize:52, fontWeight:800, color:'#1A1A1A', letterSpacing:'-2px', lineHeight:1 }}>{s.value}</span>
              <span style={{ fontSize:12, fontWeight:700, color:'#808080', letterSpacing:'1px' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding:'0 20px 40px' }}>
        <div style={{ background:'#0D3D36', borderRadius:24, padding:'40px 24px', textAlign:'center' }}>
          <h2 style={{ fontSize:28, fontWeight:800, color:'white', margin:'0 0 16px', lineHeight:1.25, letterSpacing:'-0.5px' }}>
            Ready to scan your first product?
          </h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', margin:'0 0 32px', lineHeight:1.6 }}>
            Join 1 million users who trust SafeScan for their daily beauty and health choices. It's free, fast, and science-backed.
          </p>
          <button onClick={() => navigate('/home')} style={{ width:'100%', height:52, background:'rgba(255,255,255,0.15)', color:'white', fontSize:16, fontWeight:700, border:'1.5px solid rgba(255,255,255,0.3)', borderRadius:14, cursor:'pointer' }}>
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid #F3F4F6', padding:'32px 24px 48px', display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <SafeScanIcon size={30}/>
          <span style={{ fontSize:20, fontWeight:700 }}>
            <span style={{ color:'#1B5E57' }}>Safe</span><span style={{ color:'#3EC8BE' }}>Scan</span>
          </span>
        </div>
        <div style={{ display:'flex', gap:24 }}>
          {['Privacy','Terms','Twitter','Instagram'].map(l => (
            <button key={l} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, fontWeight:600, color:'#484848', padding:0 }}>{l}</button>
          ))}
        </div>
        <p style={{ fontSize:12, color:'#AAAAAA', margin:0, textAlign:'center' }}>
          © 2026 SafeScan Technology. Built for a healthier world.
        </p>
      </footer>
    </div>
  )
}
