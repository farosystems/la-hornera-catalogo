'use client'

import Link from "next/link"
import { Menu, ShoppingBag, X } from "lucide-react"
import ProductSearch from "./ProductSearch"
import FiltersDropdown from "./FiltersDropdown"
import FiltersQuickBar from "./FiltersQuickBar"
import ShoppingListModal from "./ShoppingListModal"
import { useState, useEffect, type CSSProperties } from "react"
import { useShoppingList } from "@/hooks/use-shopping-list"
import { useConfiguracionWebContext } from '@/contexts/ConfiguracionWebContext'
import { useIsMobile } from '@/hooks/use-mobile'

export default function GlobalAppBar() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { itemCount } = useShoppingList()
  const { configuracion } = useConfiguracionWebContext()
  const isMobile = useIsMobile()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getLogoSize = () => {
    if (!configuracion) return { width: isMobile ? 150 : 200, height: isMobile ? 45 : 60 }
    return {
      width: isMobile ? configuracion.mobile_logo_width : configuracion.logo_width,
      height: isMobile ? configuracion.mobile_logo_height : configuracion.logo_height
    }
  }

  // Cerrar menú móvil al cambiar el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const getAppBarStyle = (): CSSProperties => {
    if (!configuracion) return {}
    return {
      borderBottomColor: configuracion.primary_color,
    }
  }

  return (
    <>
      <div 
        className="sticky top-0 z-50 border-b border-border bg-background text-stone-100 shadow-lg [&_input]:text-stone-100 [&_input]:placeholder:text-stone-500"
        style={getAppBarStyle()}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header principal */}
          <div className="flex items-center justify-between py-3 lg:py-4">
            {/* Logo - responsive */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <div className="relative">
                  {!isClient ? (
                    // Durante la carga inicial, usar tamaño seguro
                    <img
                      src="/LOGO2.png"
                      alt="La Hornera"
                      className="h-12 sm:h-16 w-auto transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : configuracion?.logo_url ? (
                    <img
                      src={configuracion.logo_url}
                      alt="Logo"
                      style={{
                        width: `${getLogoSize().width}px`,
                        height: `${getLogoSize().height}px`,
                        objectFit: 'contain'
                      }}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : isMobile ? (
                    <img
                      src="/LOGO2.png"
                      alt="La Hornera"
                      className="h-24 sm:h-28 w-auto transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src="/LOGO2.png"
                      alt="La Hornera"
                      className="lg:h-36 xl:h-40 w-auto transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                </div>
              </Link>
            </div>

            {/* Buscador móvil/tablet en header principal */}
            <div className="flex-1 max-w-5xl mx-2 mr-4 lg:hidden">
              <ProductSearch />
            </div>

            {/* Buscador desktop */}
            <div className="flex-1 max-w-4xl mx-4 hidden lg:block">
              <ProductSearch />
            </div>

            {/* Controles de la derecha - solo en móvil */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:hidden">
              {/* Indicador de estado - oculto en móvil */}
              <div
                className="hidden sm:flex items-center space-x-2 rounded-full px-2 sm:px-3 py-1 border border-stone-600/60 bg-red-950/50 backdrop-blur-sm text-stone-100"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                <span className="text-xs font-medium">
                  En línea
                </span>
              </div>
              
              {/* Botón hamburguesa */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hover:opacity-70 transition-colors duration-300 p-2 rounded-full text-white"
                style={{
                  backgroundColor: "#7f1d1d"
                }}
                aria-label="Abrir menú"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          <FiltersQuickBar />

          {/* Navegación desktop */}
          <div className="hidden lg:flex items-center justify-between py-3 border-t border-red-950/40 px-6">
            {/* Categorías */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <button
                className="hover:opacity-80 transition-colors duration-300 font-bold text-lg flex items-center text-stone-100"
              >
                <Menu className="mr-2 size-6" />
                Filtros
              </button>

              <div className="absolute top-full left-0 pt-2">
                <FiltersDropdown
                  isOpen={isCategoriesOpen}
                  onClose={() => setIsCategoriesOpen(false)}
                  isMobile={false}
                />
              </div>
            </div>

            {/* Mi Lista a la derecha - desktop */}
            <div className="flex items-center">
              <button
                onClick={() => setIsShoppingListOpen(true)}
                className="hover:opacity-80 transition-colors duration-300 font-bold text-lg flex items-center gap-2 text-stone-100"
                title="Mis Pedidos"
              >
                <ShoppingBag size={20} />
                Mis Pedidos ({itemCount})
              </button>
            </div>
          </div>

        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-zinc-950 border-t border-red-950/50">
            <div className="px-4 py-4 space-y-1">
              {/* Mi Lista móvil */}
              <button
                onClick={() => {
                  setIsShoppingListOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center px-4 py-3 hover:bg-red-950/80 rounded-lg transition-colors font-medium text-stone-100 w-full"
              >
                <ShoppingBag className="mr-3" size={20} />
                Mis Pedidos ({itemCount})
              </button>

              {/* Filtros móvil */}
              <button
                onClick={() => {
                  setIsMobileCategoriesOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center w-full px-4 py-3 hover:bg-red-950/80 rounded-lg transition-colors font-medium text-stone-100"
              >
                <div className="flex items-center">
                  <Menu className="mr-3" size={20} />
                  Filtros
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de Mi Lista */}
      <ShoppingListModal 
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
      />
      
      {/* Filters Dropdown - Mobile Full Screen */}
      <FiltersDropdown
        isOpen={isMobileCategoriesOpen}
        onClose={() => setIsMobileCategoriesOpen(false)}
        isMobile={true}
      />
    </>
  )
} 