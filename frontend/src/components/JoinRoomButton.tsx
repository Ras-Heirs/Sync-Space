'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JoinRoomButton() {
  const router = useRouter()
  const [joined, setJoined] = useState(false)

  const handleJoin = () => {
    const isAuth = localStorage.getItem('token')

    if (!isAuth) {
      router.push('/login')
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
          : 'bg-cyan-500 hover:bg-cyan-400 text-[#020617]'
      }`}
    >
      {joined ? 'Joined' : 'Join Room'}
    </button>
  )
}
