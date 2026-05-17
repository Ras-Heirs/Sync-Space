'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { fetchWithAuth } from '../lib/api'

export default function CreateRoomModal() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [roomTitle, setRoomTitle] = useState('')
  const [category, setCategory] = useState('Education')
  const [kuotaMaksimal, setKuotaMaksimal] = useState(5)
  const [lokasiWilayah, setLokasiWilayah] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [activityDetails, setActivityDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserName(user.name || user.email || 'User')
      } catch (e) {
        console.error('Error parsing user data', e)
      }
    }
  }, [])

  const handleCreateRoom = async () => {
    if (!roomTitle || !lokasiWilayah) {
      setError('Judul ruangan dan lokasi wajib diisi')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetchWithAuth('/rooms', {
        method: 'POST',
        body: JSON.stringify({
          title: roomTitle,
          categoryName: category,
          region: lokasiWilayah,
          maxCapacity: kuotaMaksimal,
          description,
          isPrivate: isPrivate,
          activityDetails: activityDetails ? { info: activityDetails } : {},
        })
      })

      if (response.success) {
        window.location.reload()
      } else {
        setError(response.message || 'Gagal membuat ruangan')
      }
    } catch (err: any) {
      console.error('Error creating room:', err)
      setError(err.message || 'Gagal terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass w-[800px] max-h-[90vh] overflow-y-auto rounded-[40px] p-10 relative">
      <h1 className="text-6xl font-black text-center mb-10">Buat Ruangan</h1>

      <div className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/50 text-red-500 p-5 rounded-2xl text-sm font-bold flex items-center gap-4 animate-shake">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
              <AlertCircle size={22} />
            </div>
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="text-gray-300 mb-2 block">Pembuat</label>
          <input value={userName} disabled className="w-full bg-white/10 rounded-2xl px-6 py-5 outline-none text-gray-400" />
        </div>

        <div>
          <label className="text-gray-300 mb-2 block">Judul Ruangan</label>
          <input value={roomTitle} onChange={(e) => setRoomTitle(e.target.value)} placeholder="Contoh: VALORANT Push Rank" className="w-full bg-white/10 rounded-2xl px-6 py-5 outline-none" />
        </div>

        <div>
          <label className="text-gray-300 mb-2 block">Kategori Ruangan</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-5 outline-none">
            <option value="Education">📚 Study Group</option>
            <option value="Gaming">🎮 Gaming</option>
            <option value="Social">☕ Hangout</option>
            <option value="Sports">⚽ Sports</option>
            <option value="Music">🎸 Music</option>
            <option value="Hobbies">🎨 Hobbies</option>
          </select>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
          <input type="checkbox" id="isPrivate" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="w-5 h-5 accent-cyan-500 rounded cursor-pointer" />
          <label htmlFor="isPrivate" className="text-gray-300 font-medium cursor-pointer">Ruangan Privat (Butuh persetujuan untuk masuk)</label>
        </div>

        <div>
          <label className="text-gray-300 mb-2 block">Kuota Maksimal (Jumlah Peserta)</label>
          <input type="number" value={kuotaMaksimal} onChange={(e) => setKuotaMaksimal(Number(e.target.value))} className="w-full bg-white/10 rounded-2xl px-6 py-5 outline-none" />
        </div>

        <div>
          <label className="text-gray-300 mb-2 block">Lokasi Wilayah</label>
          <input value={lokasiWilayah} onChange={(e) => setLokasiWilayah(e.target.value)} placeholder="Contoh: Depok" className="w-full bg-white/10 rounded-2xl px-6 py-5 outline-none" />
        </div>

        <div>
          <label className="text-gray-300 mb-2 block">Deskripsi</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Jelaskan aktivitasmu..." rows={5} className="w-full bg-white/10 rounded-2xl px-6 py-5 outline-none resize-none" />
        </div>

        <button onClick={handleCreateRoom} disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 transition rounded-2xl py-5 text-2xl font-bold mt-4 text-[#020617] disabled:opacity-50">
          {loading ? 'Sedang Membuat...' : 'Buat Ruangan'}
        </button>
      </div>
    </div>
  )
}
