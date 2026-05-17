'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWithAuth } from '../../lib/api'
import { MapPin, Tag, User, Camera } from 'lucide-react'
import Navbar from '../../components/Navbar'

export default function CompleteProfilePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [domicile, setDomicile] = useState('')
  const [hobbies, setHobbies] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const userJson = localStorage.getItem('user')
    if (userJson) {
      const user = JSON.parse(userJson)
      setName(user.name || '')
      if (user.domicile) {
        router.push('/dashboard')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const hobbyArray = hobbies.split(',').map(h => h.trim()).filter(h => h !== '')
      
      const response = await fetchWithAuth('/user/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          domicile,
          hobbies: hobbyArray
        })
      })

      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.payload))
        router.push('/dashboard')
      } else {
        setError(response.message || 'Gagal menyimpan profil')
      }
    } catch (err: any) {
      console.error('Update profile error:', err)
      setError(err.message || 'Terjadi kesalahan sistem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="w-full max-w-2xl">
          <div className="glass p-12 rounded-[48px] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
            
            <div className="mb-12 text-center">
              <h1 className="text-5xl font-black neon-text mb-4">Complete Your Identity</h1>
              <p className="text-gray-400">Sedikit lagi untuk memulai perjalananmu di Sync-Space</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-bold text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Lengkap"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 ml-1">Domicile (Region)</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                    <input
                      type="text"
                      required
                      value={domicile}
                      onChange={(e) => setDomicile(e.target.value)}
                      placeholder="Contoh: Jakarta Tengah"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400 ml-1">Hobbies (Separated by comma)</label>
                <div className="relative group">
                  <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input
                    type="text"
                    required
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                    placeholder="Gaming, Sports, Music..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
                <p className="text-[10px] text-gray-500 ml-1 italic">*Hobi digunakan untuk memberikan rekomendasi room yang cocok untukmu.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#020617] py-5 rounded-2xl font-black text-xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              >
                {loading ? (
                  <div className="w-8 h-8 border-4 border-[#020617] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>START EXPLORING</span>
                    <ArrowRight size={24} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

import { ArrowRight } from 'lucide-react'
