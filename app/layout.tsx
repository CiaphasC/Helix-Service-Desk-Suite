import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LightEffectsProvider } from "@/components/providers/light-effects-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ERP Sistema - Gestión de Servicios",
  description: "Sistema empresarial integrado para gestión de catálogo de servicios",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans antialiased dark`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LightEffectsProvider>{children}</LightEffectsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
