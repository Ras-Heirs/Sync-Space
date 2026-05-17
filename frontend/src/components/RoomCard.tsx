'use client'

import { motion } from 'framer-motion'
import { Users, MapPin, ArrowRight, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  id?: string
  title: string
  category: string
  lokasi_wilayah: string
  participants: number
  kuota_maksimal: number
  is_private?: boolean
  status?: string
}

export default function RoomCard({
  id,
  title,
  category,
  lokasi_wilayah,
  participants,
  kuota_maksimal,
  is_private = false,
  status = 'OPEN'
}: Props) {
  const router = useRouter()

  const handleJoin = () => {
    const isAuth = localStorage.getItem('token')
    
    if (!isAuth) {
      router.push('/login')
      return
    }

    const roomIdentifier = id || encodeURIComponent(title)
    router.push(`/room/${roomIdentifier}`)
  }

  const statusColor = 
    status === 'OPEN' ? 'emerald' : 
    status === 'FULL' ? 'amber' : 
    'rose'

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative group h-full"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-[28px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative h-full flex flex-col bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="p-7 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                {category}
              </span>
              {is_private && (
                <span className="px-2 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 flex items-center justify-center" title="Private Room">
                  <Lock size={12} />
                </span>
              )}
            </div>
            
            <div className={`flex items-center gap-1.5 bg-${statusColor}-500/10 border border-${statusColor}-500/20 px-2.5 py-1 rounded-md`}>
              {status === 'OPEN' && <div className={`w-1.5 h-1.5 rounded-full bg-${statusColor}-500 animate-pulse`} />}
              <span className={`text-[10px] font-bold text-${statusColor}-400 uppercase`}>{status}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-cyan-300 transition-colors duration-300">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-slate-400 text-sm mb-8">
            <MapPin size={14} className="text-slate-500" />
            <span className="font-medium">{lokasi_wilayah}</span>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Participants</span>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-cyan-500" />
                <span className="text-lg font-bold text-white">
                  {participants}<span className="text-slate-500 text-sm font-normal">/{kuota_maksimal}</span>
                </span>
              </div>
            </div>

            <button
              onClick={handleJoin}
              disabled={status === 'CLOSED'}
              className="relative group/btn flex items-center gap-2 px-6 py-2.5 bg-[#020617] text-white font-bold rounded-xl transition-all duration-300 active:scale-95 border border-white/10 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              <div className="absolute -inset-1 bg-cyan-500/0 group-hover/btn:bg-cyan-500/20 blur-xl rounded-2xl transition-all duration-500" />
              <div className="absolute inset-0 bg-cyan-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]" />

              <span className="relative z-10 tracking-wide group-hover/btn:text-[#020617] transition-colors duration-300">
                {status === 'CLOSED' ? 'Closed' : is_private ? 'Request Join' : 'Join'}
              </span>
              <ArrowRight size={16} className="relative z-10 group-hover/btn:text-[#020617] group-hover/btn:translate-x-1 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
