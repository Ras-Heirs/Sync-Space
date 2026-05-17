'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserName(user.name || user.email || 'Unknown User')
      } catch (e) {
        console.error('Error parsing user data', e)
      }
    }
  }, [])

  const handleCreateRoom = async () => {
    if (!roomTitle || !lokasiWilayah) {
      alert('Please fill in required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetchWithAuth('/rooms', {
        method: 'POST',
        body: JSON.stringify({
          title: roomTitle,
          category_name: category,
          lokasi_wilayah: lokasiWilayah,
          kuota_maksimal: kuotaMaksimal,
          description,
          is_private: isPrivate,
          activity_details: activityDetails ? { info: activityDetails } : {},
        })
      })

      if (response.success) {
        window.location.reload()
      } else {
        alert(response.message || 'Failed to create room')
      }
    } catch (err) {
      console.error('Error creating room:', err)
      alert('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="
        glass
        w-[800px]
        max-h-[90vh]
        overflow-y-auto
        rounded-[40px]
        p-10
        relative
      "
    >

      <h1 className="text-6xl font-black text-center mb-10">
        Create Room
      </h1>

      <div className="space-y-6">

        <div>

          <label className="text-gray-300 mb-2 block">
            Author
          </label>

          <input
            value={userName}
            disabled
            className="
              w-full
              bg-white/10
              rounded-2xl
              px-6
              py-5
              outline-none
              text-gray-400
            "
          />

        </div>

        <div>

          <label className="text-gray-300 mb-2 block">
            Room Title
          </label>

          <input
            value={roomTitle}
            onChange={(e) => setRoomTitle(e.target.value)}
            placeholder="Example: VALORANT Push Rank"
            className="
              w-full
              bg-white/10
              rounded-2xl
              px-6
              py-5
              outline-none
            "
          />

        </div>

        <div>

          <label className="text-gray-300 mb-2 block">
            Room Section
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="
              w-full
              bg-[#020617]
              border border-white/10
              rounded-2xl
              px-6
              py-5
              outline-none
            "
          >
            <option value="Education">📚 Study Group</option>
            <option value="Gaming">🎮 Gaming</option>
            <option value="Social">☕ Hangout</option>
            <option value="Sports">⚽ Sports</option>
            <option value="Music">🎸 Music</option>
            <option value="Hobbies">🎨 Hobbies</option>
          </select>

        </div>

        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
          />
          <label htmlFor="isPrivate" className="text-gray-300 font-medium cursor-pointer">
            Private Room (Requires approval to join)
          </label>
        </div>

        <div>

          <label className="text-gray-300 mb-2 block">
            Kuota Maksimal (Max Participants)
          </label>

          <input
            type="number"
            value={kuotaMaksimal}
            onChange={(e) => setKuotaMaksimal(Number(e.target.value))}
            className="
              w-full
              bg-white/10
              rounded-2xl
              px-6
              py-5
              outline-none
            "
          />

        </div>

        <div>

          <label className="text-gray-300 mb-2 block">
            Lokasi Wilayah
          </label>

          <input
            value={lokasiWilayah}
            onChange={(e) => setLokasiWilayah(e.target.value)}
            placeholder="Example: Depok"
            className="
              w-full
              bg-white/10
              rounded-2xl
              px-6
              py-5
              outline-none
            "
          />

        </div>

        <div>

          <label className="text-gray-300 mb-2 block">
            Activity Details (e.g., Game Rank, Venue Name)
          </label>

          <input
            value={activityDetails}
            onChange={(e) => setActivityDetails(e.target.value)}
            placeholder='Example: {"game": "Valorant", "rank": "Gold"}'
            className="
              w-full
              bg-white/10
              rounded-2xl
              px-6
              py-5
              outline-none
              font-mono text-sm
            "
          />

        </div>

        <div>

          <label className="text-gray-300 mb-2 block">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your activity..."
            rows={5}
            className="
              w-full
              bg-white/10
              rounded-2xl
              px-6
              py-5
              outline-none
              resize-none
            "
          />

        </div>

        <button
          onClick={handleCreateRoom}
          className="
            w-full
            bg-cyan-500
            hover:bg-cyan-400
            transition
            rounded-2xl
            py-5
            text-2xl
            font-bold
            mt-4
            text-[#020617]
          "
        >
          Create Room
        </button>

      </div>

    </div>
  )
}