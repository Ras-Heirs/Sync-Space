'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWithAuth } from '../lib/api'

interface Props {
  roomId: string
  isPrivate?: boolean
}

export default function JoinRoomButton({ roomId, isPrivate }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'NONE' | 'PENDING' | 'JOINED' | 'REJECTED'>('NONE')

  const checkStatus = async () => {
    const isAuth = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (!isAuth || !userStr) return

    try {
      const user = JSON.parse(userStr)
      const response = await fetchWithAuth(`/participants/room/${roomId}`)
      if (response.success) {
        const participant = response.payload.find((p: any) => p.userId === user.id)
        if (participant) {
          setStatus(participant.status)
        }
      }
    } catch (err) {
      console.error('Check status error:', err)
    }
  }

  useEffect(() => {
    checkStatus()
    // Poll for status updates (especially for approval)
    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [roomId])

  const handleJoin = async () => {
    const isAuth = localStorage.getItem('token')

    if (!isAuth) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const response = await fetchWithAuth('/participants', {
        method: 'POST',
        body: JSON.stringify({ roomId })
      })

      if (response.success) {
        setStatus(response.payload.status)
        alert(response.payload.status === 'PENDING' ? 'Join request sent!' : 'Joined successfully!')
      } else {
        alert(response.message || 'Failed to join')
      }
    } catch (err: any) {
      console.error('Join error:', err)
      alert(err.message || 'Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  const getButtonText = () => {
    if (loading) return 'Loading...'
    switch (status) {
      case 'JOINED': return 'Joined'
      case 'PENDING': return 'Pending Approval'
      case 'REJECTED': return 'Request Rejected'
      default: return isPrivate ? 'Request to Join' : 'Join Room'
    }
  }

  const getButtonClass = () => {
    const base = 'px-8 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2'
    if (status === 'JOINED') return `${base} bg-emerald-500 text-white cursor-default`
    if (status === 'PENDING') return `${base} bg-amber-500 text-[#020617] cursor-default`
    if (status === 'REJECTED') return `${base} bg-rose-500 text-white cursor-default`
    return `${base} bg-cyan-500 hover:bg-cyan-400 text-[#020617] active:scale-95`
  }

  return (
    <button
      onClick={handleJoin}
      disabled={loading || status !== 'NONE' && status !== 'REJECTED'}
      className={`${getButtonClass()} disabled:opacity-50`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        getButtonText()
      )}
    </button>
  )
}
