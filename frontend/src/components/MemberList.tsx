'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Check, X, User as UserIcon, Clock } from 'lucide-react'
import { fetchWithAuth } from '../lib/api'

export default function MemberList() {
  const params = useParams()
  const roomId = params.id as string
  const [participants, setParticipants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isMaster, setIsMaster] = useState(false)

  const fetchParticipants = async () => {
    try {
      // Get participants
      const response = await fetchWithAuth(`/participants/room/${roomId}`)
      if (response.success) {
        setParticipants(response.payload)
      }

      // Check if current user is master
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const currentUser = JSON.parse(userStr)
        const roomResponse = await fetchWithAuth(`/rooms/${roomId}`)
        if (roomResponse.success) {
          setIsMaster(roomResponse.payload.masterId === currentUser.id)
        }
      }
    } catch (err) {
      console.error('Failed to fetch members:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParticipants()
    // Optional: poll for updates
    const interval = setInterval(fetchParticipants, 5000)
    return () => clearInterval(interval)
  }, [roomId])

  const handleUpdateStatus = async (participantId: string, status: 'JOINED' | 'REJECTED') => {
    try {
      const response = await fetchWithAuth(`/participants/${participantId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
      if (response.success) {
        fetchParticipants()
      } else {
        alert(response.message || 'Failed to update status')
      }
    } catch (err) {
      console.error('Update status error:', err)
    }
  }

  if (loading) return (
    <div className="glass rounded-3xl p-6 flex justify-center">
      <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  const joinedMembers = participants.filter(p => p.status === 'JOINED')
  const pendingMembers = participants.filter(p => p.status === 'PENDING')

  return (
    <div className="space-y-6">
      {/* Pending Requests - Only visible to Master */}
      {isMaster && pendingMembers.length > 0 && (
        <div className="glass rounded-3xl p-6 border border-amber-500/30">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-amber-400">
            <Clock size={20} /> Pending Requests
          </h2>
          <div className="space-y-4">
            {pendingMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    {member.userImage ? (
                      <img src={member.userImage} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <UserIcon size={20} className="text-amber-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{member.userName}</p>
                    <p className="text-[10px] text-gray-500">{member.userEmail}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(member.id, 'JOINED')}
                    className="p-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-[#020617] transition-colors"
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(member.id, 'REJECTED')}
                    className="p-2 bg-rose-500 hover:bg-rose-400 rounded-lg text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Joined Members */}
      <div className="glass rounded-3xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold mb-5">
          Members ({joinedMembers.length})
        </h2>
        <div className="space-y-4">
          {joinedMembers.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No members yet</p>
          ) : (
            joinedMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  {member.userImage ? (
                    <img src={member.userImage} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <UserIcon size={20} className="text-cyan-500" />
                  )}
                </div>
                <div>
                  <p className="font-bold">{member.userName}</p>
                  <p className="text-xs text-gray-500">{member.userEmail}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}