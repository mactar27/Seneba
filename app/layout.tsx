import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import "leaflet/dist/leaflet.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Seneba",
  description: "Application SENEBA - Déplacez-vous partout au Sénégal",
  icons: {
    icon: "/images/ChatGPT Image 17 janv. 2026, 16_54_53.png",
    apple: "/images/ChatGPT Image 17 janv. 2026, 16_54_53.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0066CC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased bg-muted/30 min-h-screen" suppressHydrationWarning>
        {/* On sm and below: full screen. On md+: centered card with max width */}
        <div className="mx-auto max-w-md md:my-6 md:rounded-2xl md:shadow-2xl md:ring-1 md:ring-border bg-background min-h-screen md:min-h-0 md:overflow-hidden md:relative">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
