"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Heart, Share2 } from "lucide-react"
import { Marca, Product } from "@/lib/products"
import { useShoppingList } from "@/hooks/use-shopping-list"

interface ProductImageGalleryProps {
  images?: string[]
  productName: string
  isFeatured?: boolean
  brand?: Marca
  product: Product
}

export default function ProductImageGallery({ images, productName, isFeatured = false, brand, product }: ProductImageGalleryProps) {
  const { addItem, removeItem, isInList } = useShoppingList()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [isSliding, setIsSliding] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const isInFavorites = isInList(Number(product.id))
  const hasStock = product.tiene_stock === true // Solo true permite agregar

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInFavorites) {
      removeItem(Number(product.id))
    } else {
      addItem(product)
    }
  }

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Construir la URL del producto o combo
    const baseUrl = window.location.origin
    const productCategory = product.categoria?.descripcion || 'Sin categoría'

    let productUrl = ''
    let title = ''
    let text = ''

    // Detectar si es un combo
    if ((product as any).isCombo || productCategory.toLowerCase() === 'combos') {
      productUrl = `${baseUrl}/combos/${product.id}?share=v8`
      title = product.descripcion || 'Combo Especial'
      text = `¡Mira este combo especial! ${product.descripcion || 'Combo'} con descuento increíble`
    } else {
      // Lógica original para productos
      productUrl = product.categoria && product.categoria.descripcion &&
        !product.categoria.descripcion.toLowerCase().includes('categor') &&
        product.categoria.descripcion.trim() !== '' ?
        `${baseUrl}/${productCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/${product.id}` :
        `${baseUrl}/varios/${product.id}`
      title = product.descripcion || 'Producto'
      text = `¡Mira este producto! ${product.descripcion || 'Producto'}`
    }

    const shareData = {
      title: title,
      text: text,
      url: productUrl,
    }

    try {
      // Usar Web Share API si está disponible
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copiar al portapapeles
        await navigator.clipboard.writeText(productUrl)
        alert('¡Enlace copiado al portapapeles!')
      }
    } catch (error) {
      console.error('Error al compartir:', error)
      // Fallback final: copiar manualmente
      try {
        await navigator.clipboard.writeText(productUrl)
        alert('¡Enlace copiado al portapapeles!')
      } catch (clipboardError) {
        console.error('Error al copiar al portapapeles:', clipboardError)
      }
    }
  }

  // Filtrar imágenes que no estén vacías o sean null/undefined y trimear espacios
  const validImages = (images || [])
    .filter(img => img && img.trim() !== '')
    .map(img => img.trim())
  
  // Debug: Log para verificar las imágenes
  //console.log('🔍 ProductImageGallery - Imágenes recibidas:', images)
  //console.log('🔍 ProductImageGallery - Imágenes válidas:', validImages)
  //console.log('🔍 ProductImageGallery - Índice actual:', currentImageIndex)

  if (validImages.length === 0) {
    return (
      <div className="relative group">
        <div className="bg-zinc-900/90 border border-stone-700 rounded-2xl shadow-xl shadow-black/40 p-6 sm:p-8 overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src="/placeholder.svg"
              alt={productName}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            
            {/* Logo de la marca */}
            {brand?.logo && (
              <div className="absolute top-4 left-4">
                <img
                  src={brand.logo}
                  alt={`Logo ${brand.descripcion}`}
                  className="h-20 w-auto max-w-32 object-contain drop-shadow-lg"
                />
              </div>
            )}

          </div>
        </div>
      </div>
    )
  }

  const nextImage = (withAnimation = false) => {
    if (withAnimation) {
      setSlideDirection('left')
      setIsSliding(true)
    }
    
    //console.log('🔍 nextImage - Antes:', currentImageIndex, 'Total:', validImages.length)
    setCurrentImageIndex((prev) => {
      const next = (prev + 1) % validImages.length
      //console.log('🔍 nextImage - Después:', next)
      return next
    })

    if (withAnimation) {
      setTimeout(() => {
        setIsSliding(false)
        setSlideDirection(null)
      }, 300)
    }
  }

  const prevImage = (withAnimation = false) => {
    if (withAnimation) {
      setSlideDirection('right')
      setIsSliding(true)
    }
    
    //console.log('🔍 prevImage - Antes:', currentImageIndex, 'Total:', validImages.length)
    setCurrentImageIndex((prev) => {
      const prevIndex = (prev - 1 + validImages.length) % validImages.length
      //console.log('🔍 prevImage - Después:', prevIndex)
      return prevIndex
    })

    if (withAnimation) {
      setTimeout(() => {
        setIsSliding(false)
        setSlideDirection(null)
      }, 300)
    }
  }

  const goToImage = (index: number) => {
    //console.log('🔍 goToImage - Ir a índice:', index)
    setCurrentImageIndex(index)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return
    
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchStartX.current - touchEndX
    const deltaY = touchStartY.current - touchEndY
    
    // Solo procesar si es más horizontal que vertical (evitar interferir con scroll)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0 && validImages.length > 1) {
        nextImage(true) // Swipe hacia la izquierda = siguiente imagen con animación
      } else if (deltaX < 0 && validImages.length > 1) {
        prevImage(true) // Swipe hacia la derecha = imagen anterior con animación
      }
    }
    
    touchStartX.current = null
    touchStartY.current = null
  }

  const openZoom = () => {
    setIsZoomOpen(true)
  }

  const closeZoom = () => {
    setIsZoomOpen(false)
  }

  return (
    <div className="relative group">
      <div className="bg-zinc-900/90 border border-stone-700 rounded-2xl shadow-xl shadow-black/40 p-6 sm:p-8 overflow-hidden">
        <div 
          className="relative aspect-square cursor-pointer overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={openZoom}
        >
          <div className={`relative w-full h-full transition-transform duration-300 ${
            isSliding ? (slideDirection === 'left' ? '-translate-x-full' : 'translate-x-full') : 'translate-x-0'
          }`}>
            <Image
              src={validImages[currentImageIndex]}
              alt={`${productName} - Imagen ${currentImageIndex + 1}`}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={currentImageIndex === 0}
              loading={currentImageIndex === 0 ? 'eager' : 'lazy'}
            />
          </div>
          
          {/* Icono de Favoritos - Esquina superior derecha (solo si hay stock) */}
          {hasStock && (
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-2 right-2 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-20 ${
                isInFavorites
                  ? 'text-white'
                  : 'bg-stone-900/95 text-stone-300 hover:bg-stone-800 border border-stone-600'
              }`}
              style={isInFavorites ? { backgroundColor: '#ec3036' } : {}}
              onMouseEnter={(e) => {
                if (!isInFavorites) {
                  e.currentTarget.style.color = '#ec3036'
                }
              }}
              onMouseLeave={(e) => {
                if (!isInFavorites) {
                  e.currentTarget.style.color = ''
                }
              }}
              title={isInFavorites ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart 
                className={`w-5 h-5 transition-all duration-300 ${
                  isInFavorites ? 'fill-current' : ''
                }`} 
              />
            </button>
          )}

          {/* Botón de Compartir - Esquina inferior derecha */}
          <button
            onClick={handleShareClick}
            className="absolute bottom-2 right-2 p-2 bg-stone-900/95 text-amber-500/90 hover:bg-stone-800 hover:text-amber-400 rounded-full shadow-lg border border-stone-600 transition-all duration-300 hover:scale-110 z-20"
            title="Compartir producto"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Botones de navegación - solo mostrar si hay más de una imagen */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-stone-900/95 backdrop-blur-sm rounded-full p-3 shadow-lg border border-stone-600 hover:bg-stone-800 transition-all duration-300 z-10 cursor-pointer"
                aria-label="Imagen anterior"
                type="button"
              >
                <ChevronLeft size={20} className="text-amber-100" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-stone-900/95 backdrop-blur-sm rounded-full p-3 shadow-lg border border-stone-600 hover:bg-stone-800 transition-all duration-300 z-10 cursor-pointer"
                aria-label="Imagen siguiente"
                type="button"
              >
                <ChevronRight size={20} className="text-amber-100" />
              </button>
            </>
          )}

          {/* Indicador de imagen actual */}
          {validImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-950/70 backdrop-blur-sm text-amber-100 px-3 py-1 rounded-full text-sm font-medium border border-stone-600/80">
              {currentImageIndex + 1} / {validImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails - solo mostrar si hay más de una imagen y no es móvil */}
        {validImages.length > 1 && (
          <div className="hidden md:flex justify-center mt-6 space-x-3">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  goToImage(index)
                }}
                className={`w-20 h-20 bg-zinc-950 rounded-xl flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
                  index === currentImageIndex 
                    ? 'border-2 border-amber-600 scale-105 ring-1 ring-amber-700/50' 
                    : 'border border-stone-600 hover:border-amber-700/70 hover:scale-105'
                }`}
                aria-label={`Ver imagen ${index + 1}`}
                type="button"
              >
                <Image 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`} 
                  width={50} 
                  height={50} 
                  className="object-contain rounded-lg" 
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Zoom */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 bg-zinc-950/92 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeZoom}
        >
          <div className="relative max-w-full max-h-full">
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 bg-stone-900/95 backdrop-blur-sm rounded-full p-2 shadow-lg border border-stone-600 hover:bg-stone-800 transition-all duration-300 z-10"
              aria-label="Cerrar zoom"
            >
              <X size={24} className="text-amber-100" />
            </button>
            
            <div className="relative w-[90vw] h-[90vh] max-w-4xl max-h-[90vh]">
              <Image
                src={validImages[currentImageIndex]}
                alt={`${productName} - Imagen ampliada ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            
            {/* Navegación en zoom para múltiples imágenes */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-stone-900/95 backdrop-blur-sm rounded-full p-3 shadow-lg border border-stone-600 hover:bg-stone-800 transition-all duration-300 z-10"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={24} className="text-amber-100" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-stone-900/95 backdrop-blur-sm rounded-full p-3 shadow-lg border border-stone-600 hover:bg-stone-800 transition-all duration-300 z-10"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight size={24} className="text-amber-100" />
                </button>
                
                {/* Indicador en zoom */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-950/75 backdrop-blur-sm text-amber-100 px-4 py-2 rounded-full text-sm font-medium border border-stone-600/80">
                  {currentImageIndex + 1} / {validImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
