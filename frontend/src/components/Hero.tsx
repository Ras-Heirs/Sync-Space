'use client'

import { useRouter } from 'next/navigation'

export default function Hero() {
  const router = useRouter()

  const handleExplore = () => {
    const isAuth = localStorage.getItem('token')

    if (!isAuth) {
      router.push('/login')
      return
    }

    router.push('/dashboard')
  }

  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
      <p className="tracking-[6px] text-cyan-400 mb-5 text-xs md:text-sm font-bold uppercase">
        Social Activity Matching Platform
      </p>

      <h1 className="text-6xl md:text-8xl font-black neon-text mb-6 pb-2 tracking-tight">
        MatchIt!
      </h1>

      <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-14 leading-relaxed font-light">
        Temukan teman di sekitarmu untuk <span className="text-white font-medium">push rank</span>, <span className="text-white font-medium">nugas bareng</span>, atau sekadar <span className="text-white font-medium">nongkrong santai</span>.
      </p>

      <div className="flex flex-col items-center gap-6">
        <button
          onClick={handleExplore}
          className="relative group p-[1px] overflow-hidden rounded-2xl flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
        >
          <div className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,#22d3ee,#a855f7,transparent,transparent,#22d3ee)] group-hover:animate-[spin_2.5s_linear_infinite]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
          <div className="relative bg-[#020617] rounded-[15px] px-12 py-5 font-bold text-xl text-white tracking-wide">
            Masuk ke Portal MatchIt!
          </div>
        </button>

        <p className="text-gray-500 text-sm">
          Belum punya akun?{' '}
          <button 
            onClick={() => router.push('/register')} 
            className="text-cyan-400 font-bold hover:underline cursor-pointer"
          >
            Daftar Sekarang
          </button>
        </p>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 rounded-full blur-[160px] -z-10 pointer-events-none"></div>
    </section>
  )
}
