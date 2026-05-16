'use client'

import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export default function JoinRoomButton() {

  const [joined, setJoined] = useState(false)

  const handleJoin = async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {

      await supabase.auth.signInWithOAuth({
        provider: 'google'
      })

      return
    }

    setJoined(true)
  }

  return (
    <button
      onClick={handleJoin}
      className={`px-6 py-3 rounded-2xl font-semibold transition ${
        joined
          ? 'bg-green-500'
          : 'bg-cyan-500 hover:bg-cyan-400'
      }`}
    >
      {joined ? 'Joined' : 'Join Room'}
    </button>
  )
}