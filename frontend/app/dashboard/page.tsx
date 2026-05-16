'use client'

import { useEffect, useState } from 'react'
import RoomSection from '@/components/RoomSection'

export default function DashboardPage() {

  const [customRooms, setCustomRooms] = useState<any[]>([])

  useEffect(() => {

    const rooms =
      JSON.parse(localStorage.getItem('customRooms') || '[]')

    setCustomRooms(rooms)

  }, [])

  const studyRooms: any[] = [
    {
      title: 'FTUI Network Simulation',
      location: 'Depok',
      participants: 4,
      maxParticipants: 5
    },

    {
      title: 'Math Study Group',
      location: 'Jakarta Selatan',
      participants: 2,
      maxParticipants: 6
    },

    {
      title: 'Linear Algebra Discussion',
      location: 'Bekasi',
      participants: 3,
      maxParticipants: 5
    },

    {
      title: 'Calculus Marathon',
      location: 'Tangerang',
      participants: 5,
      maxParticipants: 7
    }
  ]

  const gamingRooms: any[] = [
    {
      title: 'VALORANT Push Rank',
      location: 'Jakarta Barat',
      participants: 4,
      maxParticipants: 5
    },

    {
      title: 'Mobile Legends Squad',
      location: 'Depok',
      participants: 3,
      maxParticipants: 5
    },

    {
      title: 'Minecraft SMP',
      location: 'Jakarta Timur',
      participants: 6,
      maxParticipants: 10
    },

    {
      title: 'Apex Legends Ranked',
      location: 'Bogor',
      participants: 2,
      maxParticipants: 3
    }
  ]

  const hangoutRooms: any[] = [
    {
      title: 'Cafe Hunting',
      location: 'Jakarta Pusat',
      participants: 5,
      maxParticipants: 8
    },

    {
      title: 'Movie Night',
      location: 'Bekasi',
      participants: 4,
      maxParticipants: 6
    },

    {
      title: 'Basket Bareng',
      location: 'Depok',
      participants: 7,
      maxParticipants: 10
    },

    {
      title: 'Weekend Chill',
      location: 'Tangerang',
      participants: 3,
      maxParticipants: 5
    }
  ]

  customRooms.forEach((room) => {

    if (room.category === 'Study') {
      studyRooms.push(room)
    }

    else if (room.category === 'Gaming') {
      gamingRooms.push(room)
    }

    else {
      hangoutRooms.push(room)
    }
  })

  return (
    <main className="min-h-screen p-10">

      <h1 className="text-6xl font-black neon-text mb-14">
        Explore Rooms
      </h1>

      <RoomSection
        title="📚 Study"
        rooms={studyRooms}
      />

      <RoomSection
        title="🎮 Gaming"
        rooms={gamingRooms}
      />

      <RoomSection
        title="☕ Hangout"
        rooms={hangoutRooms}
      />

    </main>
  )
}