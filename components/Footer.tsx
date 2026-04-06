'use client'

import Link from "next/link"
import { useState } from "react"
import { Package, Zap, MapPin, Clock } from "lucide-react"

const FOOTER_LOGO = '/4.png'
const FOOTER_LOGO_FALLBACK = '/LOGO2.png'

export default function Footer() {
  const [footerLogoSrc, setFooterLogoSrc] = useState(FOOTER_LOGO)

  const scrollToProducts = () => {
    const productsSection = document.getElementById('productos')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer style={{ background: 'linear-gradient(to right, #1a0a0a, #3d1818, #2c1210, #1a0a0a)' }} className="text-stone-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

          {/* Columna 1: La Hornera */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={footerLogoSrc}
                alt="La Hornera"
                width={400}
                height={160}
                className="h-24 w-auto shrink-0 object-contain object-left sm:h-28 md:h-32 lg:h-36 max-w-[min(100%,360px)]"
                onError={() => setFooterLogoSrc(FOOTER_LOGO_FALLBACK)}
              />
              <div>
                <h3 className="text-xl font-bold">La Hornera</h3>
                <p className="text-amber-200/80 text-sm">ESPACIO CERVECERO</p>
              </div>
            </div>
            <p className="text-stone-300/90 text-sm leading-relaxed">
              Especialistas en cervezas artesanales de calidad premium. Hacemos que tus celebraciones sean inolvidables.
            </p>
            <div className="space-y-3 pt-2 border-t border-red-900/30">
              <p className="text-stone-200 text-sm flex gap-2 items-start">
                <MapPin className="size-5 shrink-0 text-amber-500/90 mt-0.5" aria-hidden />
                <span>
                  Calle 60 e/ 137 y 138. Los hornos. La Plata
                </span>
              </p>
              <p className="text-stone-200 text-sm flex gap-2 items-start">
                <Clock className="size-5 shrink-0 text-amber-500/90 mt-0.5" aria-hidden />
                <span>
                  Lunes a domingos — Horario de verano 19–24&nbsp;hs
                </span>
              </p>
            </div>
          </div>

          {/* Columna 2: Productos */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-red-900/60 pb-2">Productos</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={scrollToProducts}
                  className="text-stone-300 hover:text-amber-100 transition-colors duration-300 flex items-center"
                >
                  <Package className="mr-2 size-4" />
                  Catálogo completo
                </button>
              </li>
              <li>
                <Link href="/#destacados" className="text-stone-300 hover:text-amber-100 transition-colors duration-300 flex items-center">
                  <Zap className="mr-2 size-4" />
                  Productos destacados
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Línea separadora */}
        <div className="border-t border-red-950/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-stone-400 text-sm text-center md:text-left">
              © 2026 La Hornera. Todos los derechos reservados.
              Especialistas en cervezas artesanales.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-stone-300 hover:text-amber-100 transition-colors duration-300 text-sm">
                Inicio
              </Link>
              <button
                onClick={scrollToProducts}
                className="text-stone-300 hover:text-amber-100 transition-colors duration-300 text-sm"
              >
                Productos
              </button>
              <Link href="/#destacados" className="text-stone-300 hover:text-amber-100 transition-colors duration-300 text-sm">
                Destacados
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 