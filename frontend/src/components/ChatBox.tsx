'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import EmojiPicker from 'emoji-picker-react'
import Pusher from 'pusher-js'
import { fetchWithAuth } from '../lib/api'

export default function ChatBox() {
  const params = useParams()
  const roomId = params.id as string
  const [message, setMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap1',
    })

    const channel = pusher.subscribe(`room-${roomId}`)
    channel.bind('message', (data: any) => {
      setMessages((prev) => [...prev, data])
    })

    return () => {
      pusher.unsubscribe(`room-${roomId}`)
    }
  }, [roomId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!message.trim()) return

    try {
      await fetchWithAuth(`/rooms/${roomId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message })
      })
      setMessage('')
      setShowEmoji(false)
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  return (
    <div className="glass rounded-3xl p-6 h-[700px] flex flex-col border border-white/10">
      <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Room Chat
      </h2>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
            <p className="text-sm">Belum ada pesan.</p>
            <p className="text-[10px] uppercase tracking-widest">Mulai percakapan sekarang!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`bg-white/5 p-4 rounded-2xl border border-white/5 animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-cyan-400 font-bold text-sm">
                  {msg.sender}
                </p>
                <span className="text-[10px] text-gray-500">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              <p className="text-gray-200 leading-relaxed text-sm">
                {msg.text}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 relative">
        {showEmoji && (
          <div className="absolute bottom-full mb-4 left-0 z-50">
            <EmojiPicker
              onEmojiClick={(emojiData) =>
                setMessage(message + emojiData.emoji)
              }
              theme={'dark' as any}
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="glass w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            😀
          </button>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ketik pesan..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
          />

          <button
            onClick={sendMessage}
            className="bg-cyan-500 hover:bg-cyan-400 transition-all px-8 rounded-xl font-bold text-[#020617] active:scale-95"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  )
}