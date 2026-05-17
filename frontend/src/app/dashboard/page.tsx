'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import RoomSection from '../../components/RoomSection'
import Navbar from '../../components/Navbar'
import CreateRoomModal from '../../components/CreateRoomModal'
import { fetchWithAuth } from '../../lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [rooms, setRooms] = useState<any[]>([])
  const [showPortalAnimation, setShowPortalAnimation] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  
  // Filter States
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchRooms = useCallback(async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (search) queryParams.append('search', search)
      if (category) queryParams.append('categoryName', category)
      if (region) queryParams.append('region', region)

      const response = await fetchWithAuth(`/rooms?${queryParams.toString()}`)
      if (response.success) {
        setRooms(response.payload)
      }
    } catch (err) {
      console.error('Failed to fetch rooms:', err)
    } finally {
      setLoading(false)
    }
  }, [search, category, region])

  useEffect(() => {
    const isAuth = localStorage.getItem('token')
    if (!isAuth) {
      router.push('/')
      return
    }
    setCheckingAuth(false)
    
    // Initial fetch handled by the other useEffect or could be here
  }, [router])

  useEffect(() => {
    if (checkingAuth) return

    const delayDebounceFn = setTimeout(() => {
      fetchRooms()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [fetchRooms, checkingAuth])

  useEffect(() => {
    if (!checkingAuth) {
      setTimeout(() => {
        setShowPortalAnimation(false)
      }, 1500)
    }
  }, [checkingAuth])

  const studyRooms = rooms.filter(r => r.categoryName === 'Education')
  const gamingRooms = rooms.filter(r => r.categoryName === 'Gaming')
  const hangoutRooms = rooms.filter(r => r.categoryName === 'Social')
  const sportsRooms = rooms.filter(r => r.categoryName === 'Sports')
  const musicRooms = rooms.filter(r => r.categoryName === 'Music')
  const hobbyRooms = rooms.filter(r => r.categoryName === 'Hobbies')

  if (checkingAuth) return null

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
      
      <AnimatePresence>
        {showPortalAnimation && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-[999] bg-[#020617] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.2, rotate: 0, opacity: 0.5 }}
              animate={{ scale: [0.2, 1.5, 3], rotate: 360, opacity: [1, 1, 0] }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
              className="w-[300px] h-[300px] rounded-full border-2 border-dashed border-cyan-400 shadow-[0_0_100px_rgba(34,211,238,0.8)] flex items-center justify-center"
            >
              <div className="w-[200px] h-[200px] rounded-full border border-double border-purple-500 shadow-[0_0_80px_rgba(168,85,247,0.6)]"></div>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute text-2xl font-black tracking-[4px] neon-text uppercase"
            >
              Membuka Portal...
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showPortalAnimation ? 0 : 1, y: showPortalAnimation ? 20 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />

        <main className="max-w-7xl mx-auto p-10">
          
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8 mb-16">
            <div className="flex-1">
              <h1 className="text-5xl font-black neon-text mb-6">
                Explore Rooms
              </h1>
              
              {/* Search and Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Cari ruangan..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>

                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:border-cyan-500/50 appearance-none text-gray-300"
                  >
                    <option value="" className="bg-[#020617]">Semua Kategori</option>
                    <option value="Education" className="bg-[#020617]">📚 Study Group</option>
                    <option value="Gaming" className="bg-[#020617]">🎮 Gaming</option>
                    <option value="Social" className="bg-[#020617]">☕ Hangout</option>
                    <option value="Sports" className="bg-[#020617]">⚽ Sports</option>
                    <option value="Music" className="bg-[#020617]">🎸 Music</option>
                    <option value="Hobbies" className="bg-[#020617]">🎨 Hobbies</option>
                  </select>
                </div>

                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Filter wilayah..."
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_35px_rgba(168,85,247,0.4)] active:scale-95 cursor-pointer text-lg h-fit"
            >
              <Plus size={22} />
              Create New Table
            </button>
          </div>

          <div className="space-y-4 min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold animate-pulse">Menghubungkan Portal...</p>
              </div>
            ) : rooms.length > 0 ? (
              <>
                <RoomSection title="📚 Study Rooms" rooms={studyRooms} />
                <RoomSection title="🎮 Gaming Rooms" rooms={gamingRooms} />
                <RoomSection title="☕ Hangout Rooms" rooms={hangoutRooms} />
                <RoomSection title="⚽ Sports" rooms={sportsRooms} />
                <RoomSection title="🎸 Music" rooms={musicRooms} />
                <RoomSection title="🎨 Hobbies" rooms={hobbyRooms} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                  <Filter size={40} className="text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Tidak Ada Ruangan</h3>
                <p className="text-gray-400 max-w-md">Tidak menemukan ruangan yang cocok dengan filter kamu. Coba ubah kata kunci atau wilayah.</p>
                <button 
                  onClick={() => { setSearch(''); setCategory(''); setRegion(''); }}
                  className="mt-6 text-cyan-400 font-bold hover:underline"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </main>
      </motion.div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-5 overflow-y-auto">
          <div className="relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 z-50 text-gray-400 hover:text-white font-bold bg-white/5 w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-xl cursor-pointer"
            >
              ✕
            </button>
            <CreateRoomModal />
          </div>
        </div>
      )}
    </div>
  )
}

import { MapPin } from 'lucide-react'
