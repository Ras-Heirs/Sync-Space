'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User as UserIcon, MapPin, Heart, Mail, Hash, Camera, Plus, X, Check, AlertCircle } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { fetchWithAuth } from '../../lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newHobby, setNewHobby] = useState('')
  const [hobbies, setHobbies] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [domicile, setDomicile] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchWithAuth('/user/profile')
        if (response.success) {
          const data = response.payload
          setProfile(data)
          setName(data.name || '')
          setDomicile(data.domicile || '')
          setHobbies(data.hobbies || [])
        } else {
          router.push('/login')
        }
      } catch (err) {
        console.error('Fetch profile error:', err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const addHobby = () => {
    if (newHobby.trim() && !hobbies.includes(newHobby)) {
      setHobbies([...hobbies, newHobby])
      setNewHobby('')
    }
  }

  const removeHobby = (hobbyToRemove: string) => {
    setHobbies(hobbies.filter(h => h !== hobbyToRemove))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError('')
    try {
      const response = await fetchWithAuth('/user/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          domicile,
          hobbies,
          image: profile?.image
        })
      })

      if (response.success) {
        setShowSuccessPopup(true)
        setTimeout(() => {
          setShowSuccessPopup(false)
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(response.message || 'Gagal menyimpan profil')
      }
    } catch (err: any) {
      console.error('Save profile error:', err)
      setError(err.message || 'Gagal terhubung ke server')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#020617] text-white relative">
      <Navbar />

      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass p-10 rounded-[40px] border border-cyan-500/30 text-center max-w-sm w-full"
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <Check size={40} className="text-[#020617]" />
              </div>
              <h2 className="text-3xl font-black mb-2">Tersimpan!</h2>
              <p className="text-gray-400">Profil berhasil diperbarui. Kembali ke portal...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-4xl mx-auto p-10 mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[40px] p-10 border border-white/10"
        >
          {error && (
            <div className="mb-8 bg-red-500/10 border-2 border-red-500/50 text-red-500 p-5 rounded-2xl text-sm font-bold flex items-center gap-4 animate-shake">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle size={22} />
              </div>
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 p-1">
                <div className="w-full h-full rounded-full bg-[#020617] overflow-hidden flex items-center justify-center">
                  {profile?.image ? (
                    <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={80} className="text-gray-600" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 p-3 bg-cyan-500 rounded-full hover:scale-110 transition-transform shadow-lg">
                <Camera size={20} className="text-[#020617]" />
              </button>
            </div>

            <div className="text-center md:text-left flex-1">
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-5xl font-black neon-text mb-2 bg-transparent outline-none border-b border-white/0 focus:border-cyan-500 w-full"
              />
              <p className="text-gray-400 text-xl font-medium">{profile?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 text-cyan-400 mb-2">
                  <Hash size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">User ID</span>
                </div>
                <p className="font-mono text-sm text-gray-300 break-all">{profile?.id}</p>
              </div>

              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 text-purple-400 mb-2">
                  <Mail size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Alamat Email</span>
                </div>
                <p className="text-lg font-medium">{profile?.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                  <MapPin size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Domisili</span>
                </div>
                <input 
                  type="text" 
                  value={domicile}
                  onChange={(e) => setDomicile(e.target.value)}
                  placeholder="Contoh: Depok"
                  className="bg-transparent w-full text-lg font-medium outline-none border-b border-white/0 focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 text-pink-400 mb-2">
                  <Heart size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Bio Pribadi</span>
                </div>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ceritakan tentang dirimu..."
                  className="bg-transparent w-full text-gray-300 outline-none resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-[32px] border border-white/5">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Plus size={24} className="text-cyan-400" /> Hobi & Minat Saya
            </h2>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {hobbies.map((hobby) => (
                <span 
                  key={hobby} 
                  className="group flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 font-bold hover:bg-cyan-500 hover:text-[#020617] transition-all cursor-default"
                >
                  {hobby}
                  <button onClick={() => removeHobby(hobby)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <select 
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                className="flex-1 bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 transition-colors text-gray-300"
              >
                <option value="">Pilih Kategori...</option>
                <option value="Study Group">📚 Study Group</option>
                <option value="Gaming">🎮 Gaming</option>
                <option value="Hangout">☕ Hangout</option>
                <option value="Music">🎵 Music</option>
                <option value="Sports">🏀 Sports</option>
              </select>
              <button 
                onClick={addHobby}
                className="px-8 bg-white text-[#020617] font-bold rounded-2xl hover:bg-cyan-400 transition-colors"
              >
                Tambah
              </button>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full mt-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl text-xl font-bold hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </motion.div>
      </main>
    </div>
  )
}
