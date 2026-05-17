'use client'

import RoomCard from './RoomCard'

interface Room {
  id?: string
  title: string
  region: string
  currentParticipants: number
  maxCapacity: number
  categoryName?: string
  isPrivate?: boolean
  status?: string
}

interface Props {
  title: string
  rooms: Room[]
}

export default function RoomSection({ title, rooms }: Props) {
  if (!rooms || rooms.length === 0) return null

  const categoryText = title.replace(/[^a-zA-Z\s]/g, '').trim()

  return (
    <div className="mb-14">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, index) => (
          <RoomCard
            key={room.id || index}
            id={room.id}
            title={room.title}
            category={room.categoryName || categoryText}
            region={room.region}
            participants={room.currentParticipants}
            maxCapacity={room.maxCapacity}
            isPrivate={room.isPrivate}
            status={room.status}
          />
        ))}
      </div>
    </div>
  )
}