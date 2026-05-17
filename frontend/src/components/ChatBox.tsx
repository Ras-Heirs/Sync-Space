'use client'

import { useState, useEffect, useRef } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { fetchWithAuth } from '../lib/api'
import Pusher from 'pusher-js'

interface Message {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
    image?: string
  }
}

export default function ChatBox({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get current user from local storage
    const userJson = localStorage.getItem('user')
    if (userJson) {
      setCurrentUser(JSON.parse(userJson))
    }

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await fetchWithAuth(`/messages/${roomId}`)
        if (response.success) {
          setMessages(response.payload)
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err)
      }
    }

    fetchMessages()

    // Setup Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap1',
    })

    const channel = pusher.subscribe(`room-${roomId}`)
    channel.bind('new-message', (data: Message) => {
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

    const content = message
    setMessage('')
    setShowEmoji(false)

    try {
      await fetchWithAuth(`/messages/${roomId}`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  return (
    <div className="glass rounded-3xl p-6 h-[700px] flex flex-col">
      <h2 className="text-2xl font-bold mb-5">Room Chat</h2>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No messages yet. Say hello!
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-2xl max-w-[80%] ${
              msg.user.id === currentUser?.id
                ? 'bg-cyan-500/20 ml-auto border border-cyan-500/30'
                : 'bg-white/5 mr-auto'
            }`}
          >
            <p className={`text-xs font-bold mb-1 ${
              msg.user.id === currentUser?.id ? 'text-cyan-400' : 'text-purple-400'
            }`}>
              {msg.user.id === currentUser?.id ? 'You' : msg.user.name}
            </p>
            <p className="text-sm">{msg.content}</p>
            <p className="text-[10px] text-gray-500 mt-1 text-right">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 relative">
        {showEmoji && (
          <div className="absolute bottom-16 z-50">
            <EmojiPicker
              onEmojiClick={(emojiData) => setMessage((prev) => prev + emojiData.emoji)}
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="glass px-4 rounded-xl hover:bg-white/10 transition-colors"
          >
            😀
          </button>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type message..."
            className="flex-1 bg-white/10 rounded-xl px-4 outline-none border border-white/5 focus:border-cyan-500/50"
          />

          <button
            onClick={sendMessage}
            className="bg-cyan-500 hover:bg-cyan-400 transition-all px-6 rounded-xl font-bold text-black"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  )
}
