import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import ClientProviders from "@/components/ClientProviders"
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: 'Turf',
  description: 'Find your circle. Join the debate.',
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SupabaseProvider>
          <ClientProviders>
            {children}
            <Toaster />
          </ClientProviders>
        </SupabaseProvider>
      </body>
    </html>
  )
}
