import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'
import ClientProviders from '@/components/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DreamLayer',
  description: 'DreamLayer - Digital Dreams Network',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersObj = await headers()
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
