import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MatchIt! - Social Activity Matching',
  description: 'Temukan ruang aktivitasmu sekarang.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="bg-[#020617] text-white antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}