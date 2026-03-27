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
    "Tu cervecería artesanal de confianza con los mejores planes de financiación. Cervezas premium, artesanales, IPA, lager y más.",
  keywords: "cerveza artesanal, cerveza premium, IPA, lager, cuotas, financiación, craft beer",
  generator: 'v0.dev',
  icons: {
    icon: '/LOGO2.png',
  },
  metadataBase: new URL('https://lahornera-catalogo.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: '/',
    siteName: 'La Hornera',
    title: 'La Hornera - Cervecería Artesanal',
    description: 'Tu cervecería artesanal de confianza con los mejores planes de financiación. Cervezas premium, artesanales, IPA, lager y más.',
    images: [
      {
        url: '/LOGO2.png?v=2',
        width: 400,
        height: 200,
        alt: 'La Hornera - Cervecería Artesanal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Hornera - Cervecería Artesanal',
    description: 'Tu cervecería artesanal de confianza con los mejores planes de financiación. Cervezas premium, artesanales, IPA, lager y más.',
    images: ['/LOGO2.png?v=2'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
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
