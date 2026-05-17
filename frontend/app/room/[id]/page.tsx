import ChatBox from '@/components/ChatBox'
import MemberList from '@/components/MemberList'
import JoinRoomButton from '@/components/JoinRoomButton'

interface Props {
  params: {
    id: string
  }
}

export default function RoomPage({ params }: Props) {

  const roomName = decodeURIComponent(params.id)

  // DETEKSI CATEGORY
  let category = 'General'
  let location = 'Indonesia'

  if (
    roomName.includes('Study') ||
    roomName.includes('Algebra') ||
    roomName.includes('Database') ||
    roomName.includes('Simulation')
  ) {
    category = 'Study Room'
    location = 'Depok'
  }

  else if (
    roomName.includes('VALORANT') ||
    roomName.includes('Minecraft') ||
    roomName.includes('CS2') ||
    roomName.includes('Mobile')
  ) {
    category = 'Gaming Room'
    location = 'Jakarta Timur'
  }

  else {
    category = 'Hangout Room'
    location = 'Jakarta Selatan'
  }

  return (
    <main className="min-h-screen p-10">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-5xl font-black neon-text">
            {roomName}
          </h1>

          <p className="text-gray-400 mt-3">
            {category} • {location}
          </p>

        </div>

        <JoinRoomButton />

      </div>

      <div className="grid grid-cols-3 gap-8 mt-10">

        <div className="col-span-1">
          <MemberList />
        </div>

        <div className="col-span-2">
          <ChatBox />
        </div>

      </div>

    </main>
  )
}