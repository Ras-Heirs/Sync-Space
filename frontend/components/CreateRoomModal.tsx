'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CreateRoomModal() {

  const router = useRouter()

  const [userName, setUserName] = useState('')

  const [roomTitle, setRoomTitle] = useState('')
  const [category, setCategory] = useState('Study')
  const [maxPeople, setMaxPeople] = useState(5)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [dateTime, setDateTime] = useState('')

  useEffect(() => {

    const getUser = async () => {

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (user) {
        setUserName(
          user.user_metadata.full_name ||
          user.email ||
          'Unknown User'
        )
      }
    }

    getUser()

  }, [])

  const handleCreateRoom = async () => {

    const newRoom = {
      title: roomTitle,
      category,
      location,
      participants: 1,
      maxParticipants: maxPeople,
      description,
      dateTime,
      author: userName
    }

    const existingRooms =
      JSON.parse(localStorage.getItem('customRooms') || '[]')

    existingRooms.push(newRoom)

    localStorage.setItem(
      'customRooms',
      JSON.stringify(existingRooms)
    )

    router.push('/dashboard')
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

        {/* AUTHOR */}

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

        {/* ROOM TITLE */}

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

        {/* CATEGORY */}

        <div>

          <label className="text-gray-300 mb-2 block">
            Room Section
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="
              w-full
              bg-white/10
              rounded-2xl
              px-6
              py-5
              outline-none
            "
          >

            <option value="Study">
              📚 Study
            </option>

            <option value="Gaming">
              🎮 Gaming
            </option>

            <option value="Hangout">
              ☕ Hangout
            </option>

          </select>

        </div>

        {/* MAX PEOPLE */}

        <div>

          <label className="text-gray-300 mb-2 block">
            Max Participants
          </label>

          <input
            type="number"
            value={maxPeople}
            onChange={(e) => setMaxPeople(Number(e.target.value))}
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

        {/* LOCATION */}

        <div>

          <label className="text-gray-300 mb-2 block">
            Area / Location
          </label>

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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

        {/* DESCRIPTION */}

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

        {/* DATE */}

        <div>

          <label className="text-gray-300 mb-2 block">
            Date & Time
          </label>

          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
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

        {/* BUTTON */}

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
          "
        >
          Create Room
        </button>

      </div>

    </div>
  )
}