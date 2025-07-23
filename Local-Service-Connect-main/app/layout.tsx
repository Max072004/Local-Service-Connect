import type { Metadata } from 'next'
import './globals.css'
import { IconFavicon } from '@tabler/icons-react';

export const metadata: Metadata = {
  title: 'Local Service Connect',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  description: 'Created with v0',
  generator: 'v0.dev',
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
