'use client'

import { LogIn } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {

  const handleLogin = async () => {

    await supabase.auth.signInWithOAuth({

      provider: 'google',

      options: {
        redirectTo: 'http://localhost:3000/auth/callback'
      }

    })

  }

  return (

    <nav className="
      flex
      justify-between
      items-center
      px-10
      py-6
    ">

      <h1 className="
        text-3xl
        font-black
        neon-text
      ">
        MatchIt!
      </h1>

      <button
        onClick={handleLogin}
        className="
          flex
          items-center
          gap-3
          bg-cyan-500
          hover:bg-cyan-400
          transition
          px-8
          py-4
          rounded-2xl
          text-xl
          font-semibold
        "
      >

        <LogIn size={26} />

        Login Google

      </button>

    </nav>

  )
}