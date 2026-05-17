'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function CompleteProfilePage() {

  const router = useRouter()

  const [nickname, setNickname] = useState('')
  const [fullName, setFullName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)

  const handleSave = async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    let avatarUrl = ''

    if (photo) {

      const fileName =
        `${user.id}-${Date.now()}`

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, photo)

      if (!error) {

        const {
          data: publicUrl
        } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)

        avatarUrl = publicUrl.publicUrl
      }
    }

    await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        nickname,
        full_name: fullName,
        whatsapp,
        avatar_url: avatarUrl
      })

    router.push('/dashboard')
  }

  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      p-10
    ">

      <div className="
        glass
        w-[700px]
        rounded-[40px]
        p-10
      ">

        <h1 className="
          text-5xl
          font-black
          mb-10
          text-center
        ">
          Complete Your Profile
        </h1>

        <div className="space-y-6">

          <div>

            <label className="block mb-2">
              Profile Photo
            </label>

            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) =>
                setPhoto(
                  e.target.files?.[0] || null
                )
              }
              className="w-full"
            />

          </div>

          <div>

            <label className="block mb-2">
              Nickname
            </label>

            <input
              value={nickname}
              onChange={(e) =>
                setNickname(e.target.value)
              }
              className="
                w-full
                bg-white/10
                rounded-2xl
                px-6
                py-5
              "
            />

          </div>

          <div>

            <label className="block mb-2">
              Full Name
            </label>

            <input
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              className="
                w-full
                bg-white/10
                rounded-2xl
                px-6
                py-5
              "
            />

          </div>

          <div>

            <label className="block mb-2">
              WhatsApp Number
            </label>

            <input
              value={whatsapp}
              onChange={(e) =>
                setWhatsapp(e.target.value)
              }
              className="
                w-full
                bg-white/10
                rounded-2xl
                px-6
                py-5
              "
            />

          </div>

          <button
            onClick={handleSave}
            className="
              w-full
              bg-cyan-500
              rounded-2xl
              py-5
              text-2xl
              font-bold
            "
          >
            Complete Setup
          </button>

        </div>

      </div>

    </main>
  )
}