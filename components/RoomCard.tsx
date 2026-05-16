'use client'

import { motion } from 'framer-motion'
import { Users, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Props {
  title: string
  category: string
  location: string
  participants: number
  maxParticipants: number
}

export default function RoomCard({
  title,
  category,
  location,
  participants,
  maxParticipants
}: Props) {

  const router = useRouter()

  const handleJoin = async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    // Kalau belum login Google
    if (!user) {

      await supabase.auth.signInWithOAuth({
        provider: 'google',

        options: {
          redirectTo: 'http://localhost:3000/dashboard'
        }
      })

      return
    }

    // Kalau sudah login
    router.push(`/room/${encodeURIComponent(title)}`)
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass rounded-3xl p-6 transition"
    >

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <p className="text-cyan-400 mt-1">
            {category}
          </p>

        </div>

        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
          Open
        </span>

      </div>

      <div className="mt-5 flex items-center gap-2 text-gray-300">

        <MapPin size={18} />

        <span>
          {location}
        </span>

      </div>

      <div className="mt-6 flex justify-between items-center">

        <div className="flex items-center gap-2">

          <Users size={18} />

          <span className="font-semibold">
            {participants}/{maxParticipants}
          </span>

        </div>

        <button
          onClick={handleJoin}
          className="bg-cyan-500 hover:bg-cyan-400 transition px-5 py-2 rounded-xl font-semibold"
        >
          Join
        </button>

      </div>

    </motion.div>
  )
}