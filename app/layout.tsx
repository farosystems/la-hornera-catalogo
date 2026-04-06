import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ShoppingListProvider } from "@/hooks/use-shopping-list"
import { ConfiguracionWebProvider } from "@/contexts/ConfiguracionWebContext"
import GlobalStyles from "@/components/GlobalStyles"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "La Hornera - Cervecería Artesanal",
  description:
    "ESPACIO CERVECERO con los mejores planes de financiación. Cervezas premium, artesanales, IPA, lager y más.",
  keywords: "cerveza artesanal, cerveza premium, IPA, lager, cuotas, financiación, craft beer",
  generator: 'v0.dev',
  icons: {
    icon: '/4.png',
    apple: '/4.png',
  },
  metadataBase: new URL('https://lahornera-catalogo.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: '/',
    siteName: 'La Hornera',
    title: 'La Hornera - Cervecería Artesanal',
    description: 'ESPACIO CERVECERO con los mejores planes de financiación. Cervezas premium, artesanales, IPA, lager y más.',
    images: [
      {
        url: '/4.png?v=2',
        width: 400,
        height: 200,
        alt: 'La Hornera - Cervecería Artesanal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Hornera - Cervecería Artesanal',
    description: 'ESPACIO CERVECERO con los mejores planes de financiación. Cervezas premium, artesanales, IPA, lager y más.',
    images: ['/4.png?v=2'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} min-h-screen bg-background`}>
        <ConfiguracionWebProvider>
          <GlobalStyles />
          <ShoppingListProvider>
            {children}
          </ShoppingListProvider>
        </ConfiguracionWebProvider>
      </body>
    </html>
  )
}
