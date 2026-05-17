'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWithAuth } from '../lib/api'

interface Props {
  roomId: string
  isPrivate?: boolean
}

export default function JoinRoomButton({ roomId, isPrivate }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [joined, setJoined] = useState(false)

  const handleJoin = async () => {
    const isAuth = localStorage.getItem('token')

    if (!isAuth) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const response = await fetchWithAuth('/participants/join', {
        method: 'POST',
        body: JSON.stringify({ roomId })
      })

      if (response.success) {
        setJoined(true)
        alert(isPrivate ? 'Join request sent!' : 'Joined successfully!')
        window.location.reload()
      } else {
        alert(response.message || 'Failed to join')
      }
    } catch (err) {
      console.error('Join error:', err)
      alert('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleJoin}
      disabled={loading || joined}
      className={`px-8 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2 ${
        joined
          ? 'bg-emerald-500 text-white cursor-default'
          : 'bg-cyan-500 hover:bg-cyan-400 text-[#020617] active:scale-95'
      } disabled:opacity-50`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-[#020617] border-t-transparent rounded-full animate-spin"></div>
      ) : joined ? (
        'Joined'
      ) : isPrivate ? (
        'Request to Join'
      ) : (
        'Join Room'
      )}
    </button>
  )
}
