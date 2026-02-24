import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#FEFEFE', overflowY:'auto' }}>
      <div style={{ flex:1, padding:'56px 24px 32px' }}>

        <h1 style={{ fontSize:32, fontWeight:800, color:'#1A1A1A', margin:'0 0 8px', letterSpacing:'-0.5px' }}>
          Welcome Back!
        </h1>
        <p style={{ fontSize:15, color:'#808080', margin:'0 0 36px' }}>
          Sign in to start scanning safely
        </p>

        {/* Email */}
        <label style={{ fontSize:14, fontWeight:700, color:'#1A1A1A', display:'block', marginBottom:8 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="example@gmail.com"
          style={{
            width:'100%', height:52, borderRadius:14,
            border:'1.5px solid #E7F0EF', background:'#FEFEFE',
            padding:'0 16px', fontSize:14, color:'#1A1A1A',
            outline:'none', boxSizing:'border-box', marginBottom:20,
          }}
        />

        {/* Password */}
        <label style={{ fontSize:14, fontWeight:700, color:'#1A1A1A', display:'block', marginBottom:8 }}>Password</label>
        <div style={{ position:'relative', marginBottom:8 }}>
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••••••••"
            style={{
              width:'100%', height:52, borderRadius:14,
              border:'1.5px solid #E7F0EF', background:'#FEFEFE',
              padding:'0 48px 0 16px', fontSize:14, color:'#1A1A1A',
              outline:'none', boxSizing:'border-box',
            }}
          />
          <button onClick={() => setShowPw(v => !v)}
            style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#808080', padding:4, display:'flex' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {showPw
                ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/></>
                : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
              }
            </svg>
          </button>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:28 }}>
          <button style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, fontWeight:600, color:'#3D837D', padding:0 }}>
            Forgot Password?
          </button>
        </div>

        {/* Sign In button */}
        <button
          onClick={() => navigate('/home')}
          style={{ width:'100%', height:52, background:'#0D645D', color:'white', fontSize:16, fontWeight:700, border:'none', borderRadius:14, cursor:'pointer', marginBottom:28 }}
        >
          Sign In
        </button>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <div style={{ flex:1, height:1, background:'#E7F0EF' }}/>
          <span style={{ fontSize:13, color:'#808080', whiteSpace:'nowrap' }}>or Sign In with</span>
          <div style={{ flex:1, height:1, background:'#E7F0EF' }}/>
        </div>

        {/* Social */}
        <div style={{ display:'flex', justifyContent:'center', gap:16, marginBottom:32 }}>
          {[
            <svg key="apple" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>,
            <svg key="google" width="24" height="24" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
            <svg key="fb" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          ].map((icon, i) => (
            <button key={i} style={{ width:56, height:56, borderRadius:14, border:'1.5px solid #E7F0EF', background:'white', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#1A1A1A' }}>
              {icon}
            </button>
          ))}
        </div>

        {/* Sign up link */}
        <p style={{ textAlign:'center', fontSize:14, color:'#808080', margin:0 }}>
          Don&apos;t have an account?{' '}
          <button onClick={() => navigate('/signup')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:14, fontWeight:700, color:'#0D645D', padding:0 }}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}
