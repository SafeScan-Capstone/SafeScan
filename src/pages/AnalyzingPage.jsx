import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function AnalyzingPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  useEffect(() => {
    const t = setTimeout(() => navigate('/results', { replace:true, state }), 2500)
    return () => clearTimeout(t)
  }, [navigate, state])

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#FEFEFE', alignItems:'center', justifyContent:'center', gap:16 }}>
      <div style={{ width:72, height:72 }}>
        <svg style={{ width:'100%', height:'100%', animation:'spin 1s linear infinite' }} viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="28" fill="none" stroke="#E7F0EF" strokeWidth="6"/>
          <circle cx="36" cy="36" r="28" fill="none" strokeWidth="6" strokeLinecap="round"
            stroke="url(#sg)" strokeDasharray="88 100" />
          <defs>
            <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0D645D"/>
              <stop offset="100%" stopColor="#3D837D" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h2 style={{ fontSize:24, fontWeight:700, color:'#1A1A1A', margin:0 }}>Analyzing ingredients...</h2>
      <p style={{ fontSize:16, color:'#484848', margin:0 }}>Checking clinical database</p>
      <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
    </div>
  )
}
