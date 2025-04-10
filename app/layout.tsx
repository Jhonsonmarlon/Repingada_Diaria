import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Repingada Diária',
  description: 'Created with JJdev',
  generator: 'JJdev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
