'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ChatBox from '../../../components/ChatBox'
import MemberList from '../../../components/MemberList'
import JoinRoomButton from '../../../components/JoinRoomButton'
import Navbar from '../../../components/Navbar'
import { MapPin, Users, Calendar, Info, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { fetchWithAuth, API_URL } from '../../../lib/api'

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const [roomData, setRoomData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userStatus, setUserStatus] = useState<'NONE' | 'PENDING' | 'JOINED' | 'REJECTED'>('NONE')
  const [isMaster, setIsMaster] = useState(false)

  const roomId = params.id as string

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(`/rooms/${roomId}`)
        if (response.success) {
          setRoomData(response.payload)
          
          const userStr = localStorage.getItem('user')
          if (userStr) {
            const user = JSON.parse(userStr)
            setIsMaster(response.payload.masterId === user.id)
            
            const partResponse = await fetchWithAuth(`/participants/room/${roomId}`)
            if (partResponse.success) {
              const participant = partResponse.payload.find((p: any) => p.userId === user.id)
              if (participant) {
                setUserStatus(participant.status)
              }
            }
          }
        } else {
          router.push('/dashboard')
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [roomId, router])

  useEffect(() => {
    if (!roomData || !isMaster) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const handleUnload = () => {
      fetch(`${API_URL}/rooms/${roomId}`, {
        method: 'DELETE',
        keepalive: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [roomData, roomId, isMaster]);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  const canChat = isMaster || userStatus === 'JOINED'

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto p-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-bold text-cyan-400 uppercase tracking-widest">
                {roomData?.categoryName}
              </span>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase">{roomData?.status}</span>
              </div>
              {roomData?.isPrivate && (
                <span className="flex items-center gap-1 px-2 py-1 bg-rose-500/10 border border-rose-500/20 rounded-md text-[10px] font-bold text-rose-400 uppercase">
                  <Shield size={12} /> Private
                </span>
              )}
            </div>
            
            <h1 className="text-6xl font-black neon-text mb-4">
              {roomData?.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-cyan-500" />
                {roomData?.region}
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-purple-500" />
                {roomData?.currentParticipants} / {roomData?.maxCapacity} Participants
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-pink-500" />
                Started {roomData?.createdAt ? new Date(roomData.createdAt).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex-1 md:flex-none px-8 py-4 glass border border-white/10 rounded-2xl font-bold hover:bg-white/5 transition-all"
            >
              Back to Portal
            </button>
            <JoinRoomButton roomId={roomId} isPrivate={roomData?.isPrivate} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-4 space-y-10">
            
            <div className="glass p-8 rounded-[32px] border border-white/10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info size={20} className="text-cyan-400" /> Description
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {roomData?.description}
              </p>
              
              {roomData?.activityDetails && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 text-cyan-400">Activity Context</h4>
                  <div className="bg-[#020617] p-4 rounded-2xl font-mono text-sm text-gray-300">
                    {JSON.stringify(roomData.activityDetails, null, 2)}
                  </div>
                </div>
              )}
            </div>

            <MemberList />
          </div>

          <div className="lg:col-span-8">
            <ChatBox roomId={roomId} />
          </div>

        </div>

      </main>
    </div>
  )
}
