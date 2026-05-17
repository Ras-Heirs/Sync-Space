'use client'

import { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'

export default function ChatBox() {

  const [message, setMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)

  const [messages, setMessages] = useState([
    {
      sender: 'Abram',
      text: 'Halo guys 👋'
    },

    {
      sender: 'Kevin',
      text: 'Siap belajar 🚀'
    }
  ])

  const sendMessage = () => {

    if (!message.trim()) return

    setMessages([
      ...messages,
      {
        sender: 'You',
        text: message
      }
    ])

    setMessage('')
  }

  return (
    <div className="glass rounded-3xl p-6 h-[700px] flex flex-col">

      <h2 className="text-2xl font-bold mb-5">
        Room Chat
      </h2>

      <div className="flex-1 overflow-y-auto space-y-4">

        {messages.map((msg, index) => (

          <div
            key={index}
            className="bg-white/5 p-4 rounded-2xl"
          >

            <p className="text-cyan-400 font-semibold">
              {msg.sender}
            </p>

            <p className="mt-1">
              {msg.text}
            </p>

          </div>

        ))}

      </div>

      <div className="mt-5 relative">

        {showEmoji && (
          <div className="absolute bottom-16">

            <EmojiPicker
              onEmojiClick={(emojiData) =>
                setMessage(message + emojiData.emoji)
              }
            />

          </div>
        )}

        <div className="flex gap-3">

          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="glass px-4 rounded-xl"
          >
            😀
          </button>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-1 bg-white/10 rounded-xl px-4 outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-cyan-500 hover:bg-cyan-400 transition px-6 rounded-xl"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  )
}