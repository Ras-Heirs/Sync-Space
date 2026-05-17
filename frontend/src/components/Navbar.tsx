'use client'

import { useEffect, useState } from 'react'
import { LogIn, LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = () => {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          setProfile({ 
            nickname: user.name || user.email?.split('@')[0], 
            avatar_url: user.image 
          })
        } catch (e) {
          console.error('Error parsing user data', e)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    }

    checkUser()
    window.addEventListener('storage', checkUser)
    return () => window.removeEventListener('storage', checkUser)
  }, [])

  const handleLogin = () => {
    router.push('/login')
  }

  const handleRegister = () => {
    router.push('/register')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <nav className="flex justify-between items-center px-10 py-6 relative z-50 bg-[#020617]/40 backdrop-blur-md border-b border-white/5">
      <h1 onClick={() => router.push('/')} className="text-3xl font-black neon-text tracking-tight cursor-pointer">
        MatchIt!
      </h1>

      {!loading && (
        profile ? (
          <div className="flex items-center gap-5">
            <div 
              onClick={() => router.push('/profile')}
              className="relative group p-[1px] overflow-hidden rounded-2xl cursor-pointer transition-transform hover:-translate-y-0.5 duration-300"
            >
              <div className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,#22d3ee,#a855f7,transparent,transparent,#22d3ee)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-[#020617] rounded-[15px] px-4 py-2 flex items-center gap-3 h-full w-full">
                <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                  {profile.nickname}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="relative group p-[1px] overflow-hidden rounded-2xl flex items-center justify-center cursor-pointer transition-transform active:scale-95 hover:-translate-y-0.5 duration-300"
            >
              <div className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_0deg,#ef4444,#f97316,transparent,transparent,#ef4444)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-[#020617] rounded-[15px] px-4 py-2.5 flex items-center gap-2 font-medium text-gray-400 group-hover:text-red-400 transition-colors duration-300">
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogin}
              className="relative group p-[1px] overflow-hidden rounded-2xl flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]"
            >
              <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,#22d3ee,#a855f7,transparent,transparent,#22d3ee)] opacity-80 group-hover:opacity-100 group-hover:animate-[spin_2s_linear_infinite]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-md opacity-10 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-[#020617] rounded-[15px] px-6 py-2.5 flex items-center gap-2 font-bold text-gray-300 group-hover:text-white transition-colors duration-300">
                <LogIn size={18} className="text-cyan-400 group-hover:text-cyan-300" />
                <span>Login</span>
              </div>
            </button>

            <button
              onClick={handleRegister}
              className="relative group p-[1px] overflow-hidden rounded-2xl flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            >
              <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,#22d3ee,#a855f7,transparent,transparent,#22d3ee)] opacity-100 group-hover:animate-[spin_2s_linear_infinite]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="relative bg-[#020617] rounded-[15px] px-6 py-2.5 flex items-center gap-2 font-bold text-white transition-colors duration-300">
                <LogIn size={18} className="text-cyan-400" />
                <span>Register Now</span>
              </div>
            </button>
          </div>
        )
      )}
    </nav>
  )
}
