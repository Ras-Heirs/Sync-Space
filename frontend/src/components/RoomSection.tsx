'use client'

import RoomCard from './RoomCard'

interface Room {
  id?: string
  title: string
  lokasi_wilayah: string
  participants: number
  kuota_maksimal: number
  category?: string
  is_private?: boolean
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
            category={room.category || categoryText}
            lokasi_wilayah={room.lokasi_wilayah}
            participants={room.participants}
            kuota_maksimal={room.kuota_maksimal}
            is_private={room.is_private}
            status={room.status}
          />
        ))}
      </div>
    </div>
  )
}