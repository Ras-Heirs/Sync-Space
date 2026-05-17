'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { API_URL } from '../../lib/api'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      console.error('Google login error:', err)
      setError(err.message || 'Gagal login dengan Google')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('token', data.payload.token)
        localStorage.setItem('user', JSON.stringify(data.payload.user))
        router.push('/dashboard')
      } else {
        setError(data.message || 'Login gagal')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Koneksi ke server gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="w-full max-w-md">
          <div className="glass p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
            
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-black neon-text mb-3">Welcome Back</h1>
              <p className="text-gray-400">Masuk untuk melanjutkan petualanganmu</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border-2 border-red-500/50 text-red-500 p-5 rounded-2xl text-sm font-bold flex items-center gap-4 animate-shake">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                    <AlertCircle size={22} />
                  </div>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group p-[1px] overflow-hidden rounded-2xl flex items-center justify-center cursor-pointer transition-transform active:scale-95 mt-4"
              >
                <div className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,#22d3ee,#a855f7,transparent,transparent,#22d3ee)] opacity-100"></div>
                <div className="relative bg-[#020617] w-full rounded-[15px] py-4 flex items-center justify-center gap-3 font-bold text-white">
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </div>
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-white/10"></div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Atau</span>
              <div className="flex-1 h-[1px] bg-white/10"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full glass py-4 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-white/5 transition-all border border-white/10"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span>Sign in with Google</span>
            </button>

            <div className="mt-8 text-center text-sm text-gray-500">
              Belum punya akun?{' '}
              <Link href="/register" className="text-cyan-400 font-bold hover:underline">
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
