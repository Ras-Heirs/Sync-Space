'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
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

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = localStorage.getItem('token')
      
      if (!isAuth) {
        router.push('/')
      } else {
        setCheckingAuth(false)
        
        try {
          const response = await fetchWithAuth('/rooms')
          if (response.success) {
            setRooms(response.payload)
          }
        } catch (err) {
          console.error('Failed to fetch rooms:', err)
        }

        setTimeout(() => {
          setShowPortalAnimation(false)
        }, 1500)
      }
    }

    checkAuth()
  }, [router])

  const studyRooms = rooms.filter(r => r.category_name === 'Education')
  const gamingRooms = rooms.filter(r => r.category_name === 'Gaming')
  const hangoutRooms = rooms.filter(r => r.category_name === 'Social')
  const sportsRooms = rooms.filter(r => r.category_name === 'Sports')
  const musicRooms = rooms.filter(r => r.category_name === 'Music')
  const hobbyRooms = rooms.filter(r => r.category_name === 'Hobbies')

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
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-16">
            <div>
              <h1 className="text-5xl font-black neon-text">
                Explore Rooms
              </h1>
              <p className="text-gray-400 mt-2">Temukan atau buat meja aktivitas sosialmu hari ini.</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-6 py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_35px_rgba(168,85,247,0.4)] active:scale-95 cursor-pointer self-start sm:self-auto text-lg"
            >
              <Plus size={22} />
              Create New Table
            </button>
          </div>

          <div className="space-y-4">
            <RoomSection title="📚 Study Rooms" rooms={studyRooms} />
            <RoomSection title="🎮 Gaming Rooms" rooms={gamingRooms} />
            <RoomSection title="☕ Hangout Rooms" rooms={hangoutRooms} />
            <RoomSection title="⚽ Sports" rooms={sportsRooms} />
            <RoomSection title="🎸 Music" rooms={musicRooms} />
            <RoomSection title="🎨 Hobbies" rooms={hobbyRooms} />
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
