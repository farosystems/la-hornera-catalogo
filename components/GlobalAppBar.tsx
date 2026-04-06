'use client'

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import ProductSearch from "./ProductSearch"
import FiltersQuickBar from "./FiltersQuickBar"
import ShoppingListModal from "./ShoppingListModal"
import { useState, type CSSProperties } from "react"
import { useShoppingList } from "@/hooks/use-shopping-list"
import { useConfiguracionWebContext } from '@/contexts/ConfiguracionWebContext'

const HEADER_LOGO_PATH = '/2.png'
const HEADER_LOGO_FALLBACK = '/LOGO2.png'

export default function GlobalAppBar() {
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false)
  const [headerLogoSrc, setHeaderLogoSrc] = useState(HEADER_LOGO_PATH)
  const { itemCount } = useShoppingList()
  const { configuracion } = useConfiguracionWebContext()

  const getAppBarStyle = (): CSSProperties => {
    if (!configuracion) return {}
    return {
      borderBottomColor: configuracion.primary_color,
    }
  }

  const renderLogoBadge = () => (
    <Link
      href="/"
      className="group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-xl"
      aria-label="Ir al inicio"
    >
      <div className="rounded-xl bg-gradient-to-b from-white via-amber-50/98 to-amber-100/85 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:py-1 lg:px-2.5 lg:py-1 shadow-md shadow-black/35 ring-1 ring-amber-500/40 transition-all duration-200 group-hover:shadow-lg group-hover:ring-amber-400/65">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={headerLogoSrc}
          alt="La Hornera"
          width={320}
          height={120}
          decoding="async"
          fetchPriority="high"
          className="h-9 w-auto sm:h-10 lg:h-[2.75rem] max-w-[124px] sm:max-w-[152px] lg:max-w-[188px] object-contain object-center"
          onError={() => setHeaderLogoSrc(HEADER_LOGO_FALLBACK)}
        />
      </div>
    </Link>
  )

  return (
    <>
      <div
        className="sticky top-0 z-50 border-b border-stone-800/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.45)]"
        style={getAppBarStyle()}
      >
        {/* Franja mínima — identidad, sin altura extra */}
        <div className="border-b border-stone-800/80 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-center gap-2 sm:justify-between sm:gap-4">
            <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500">
              <span className="mr-1.5 inline-block h-1 w-1 rounded-full bg-amber-500 align-middle" aria-hidden />
              <span className="text-amber-200/90">ESPACIO CERVECERO</span>
              <span className="mx-1.5 text-stone-700 hidden sm:inline" aria-hidden>·</span>
              <span className="text-stone-500 normal-case tracking-normal hidden sm:inline font-normal">
                La Hornera — Cerveza artesanal
              </span>
            </p>
          </div>
        </div>

        {/* Barra principal: logo resaltado + búsqueda + pedidos (compacta) */}
        <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950">
          <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2 sm:py-2.5">
            {/* Escritorio */}
            <div className="hidden items-center gap-3 lg:flex lg:gap-4">
              {renderLogoBadge()}
              <div className="h-10 w-px shrink-0 bg-stone-700/90 hidden xl:block self-center" aria-hidden />
              <div className="min-w-0 flex-1">
                <ProductSearch variant="prominent" />
              </div>
              <button
                type="button"
                onClick={() => setIsShoppingListOpen(true)}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-amber-500/55 bg-amber-400 px-3.5 py-2 text-sm font-bold text-zinc-900 shadow-sm transition-colors hover:bg-amber-300"
                title="Mis Pedidos"
              >
                <ShoppingBag className="size-5" />
                Mis Pedidos ({itemCount})
              </button>
            </div>

            {/* Móvil / tablet */}
            <div className="flex flex-col gap-2 lg:hidden">
              <div className="flex items-center gap-2 sm:gap-3">
                {renderLogoBadge()}
                <div className="min-w-0 flex-1">
                  <ProductSearch variant="prominent" />
                </div>
                <div
                  className="hidden sm:flex shrink-0 flex-col items-end gap-0.5 rounded-lg border border-stone-700/90 bg-stone-900/50 px-2 py-1 text-stone-400"
                  title="Tienda en línea"
                >
                  <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-emerald-400/95">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    En línea
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShoppingListOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-500/55 bg-amber-400 py-2 px-3 text-sm font-bold text-zinc-900 shadow-sm transition-colors hover:bg-amber-300"
                title="Mis Pedidos"
                aria-label={`Mis Pedidos, ${itemCount} producto${itemCount !== 1 ? 's' : ''}`}
              >
                <ShoppingBag size={20} className="shrink-0" />
                <span>Mis pedidos{itemCount > 0 ? ` (${itemCount})` : ''}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-red-950/30 bg-background text-stone-100 [&_input]:text-stone-100 [&_input]:placeholder:text-stone-500">
          <div className="max-w-7xl mx-auto px-3 sm:px-5">
            <FiltersQuickBar />
          </div>
        </div>
      </div>

      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
      />
    </>
  )
}
