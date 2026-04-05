"use client"

import { useState } from "react"
import Image from "next/image"
import { useConfiguracion } from "@/hooks/use-configuracion"
import { useZonas } from "@/hooks/use-zonas"
import ZonaSelectorDialog from "./ZonaSelectorDialog"
import { Product } from "@/lib/products"

interface WhatsAppFloatingButtonProps {
  product?: Product
}

export default function WhatsAppFloatingButton({ product }: WhatsAppFloatingButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { telefono, loading: configLoading, error: configError } = useConfiguracion()
  const { zonas, configuracionZonas, loading: zonasLoading } = useZonas()
  
  // Verificar si hay stock (solo si se pasa un producto específico)
  const hasStock = product ? product.tiene_stock === true : true // Si no hay producto específico, permitir acción
  
  // Debug: log del stock cuando hay producto
  if (product) {
    console.log('🔍 WhatsAppFloatingButton - Product:', product.descripcion, 'tiene_stock:', product.tiene_stock, 'hasStock:', hasStock)
    console.log('🔍 WhatsAppFloatingButton - Tipo de tiene_stock:', typeof product.tiene_stock)
  }
  
  // Función para generar el mensaje de WhatsApp
  const generateWhatsAppMessage = (): string => {
    if (product) {
      // Mensaje específico para producto
      const productInfo = product.descripcion || product.name || 'este producto'
      let message = `Hola! 👋 Me interesa saber más información sobre: ${productInfo}`
      
      // Agregar información de categoría y marca si están disponibles
      if (product.categoria?.descripcion || product.marca?.descripcion) {
        message += '\n\n'
        if (product.categoria?.descripcion) {
          message += `Categoría: ${product.categoria.descripcion}`
        }
        if (product.marca?.descripcion) {
          message += product.categoria?.descripcion ? ` | Marca: ${product.marca.descripcion}` : `Marca: ${product.marca.descripcion}`
        }
      }
      
      message += `\n\n¿Podrían brindarme más detalles sobre este producto?`
      return message
    } else {
      // Mensaje general
      return `Hola! 👋 Me gustaría conocer más sobre los productos que tienen disponibles. ¿Podrían ayudarme?`
    }
  }

  const handleClick = () => {
    // No permitir consultar si no hay stock (solo para productos específicos)
    if (product && !hasStock) {
      return
    }
    
    // Verificar si hay zonas configuradas
    const zonasConTelefono = zonas.filter(zona => 
      configuracionZonas.some(config => config.fk_id_zona === zona.id)
    )

    if (zonasConTelefono.length > 0) {
      // Si hay zonas configuradas, abrir el diálogo de selección
      setIsDialogOpen(true)
    } else {
      // Si no hay zonas configuradas, usar el teléfono por defecto
      const phoneNumber = telefono || "5491123365608"
      const message = generateWhatsAppMessage()
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
      
      // Detectar si es móvil para usar el método correcto
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (isMobile) {
        // En móviles, usar window.location.href para abrir la app directamente
        window.location.href = whatsappUrl
      } else {
        // En desktop, usar window.open
        window.open(whatsappUrl, '_blank')
      }
    }
  }

  // Si está cargando, no mostrar el botón
  if (configLoading || zonasLoading) {
    return null
  }

  // Si hay error en la configuración, mostrar el botón con el número por defecto
  if (configError) {
    console.warn('Error al cargar configuración, usando número por defecto:', configError)
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleClick}
          disabled={product && !hasStock}
          className={`relative overflow-hidden rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 transform group border-2 ${
            product && !hasStock
              ? 'bg-zinc-800 border-stone-600 text-stone-500 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-br from-emerald-900 to-green-950 border-emerald-700/80 text-emerald-50 hover:from-emerald-800 hover:to-green-900 hover:shadow-emerald-950/40 hover:shadow-xl hover:scale-110 active:scale-95'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          title={
            product && !hasStock 
              ? "Sin stock" 
              : product
                ? `Consultar sobre ${product.descripcion || 'este producto'}`
                : "Chatea con nosotros"
          }
        >
          <Image 
            src="/WhatsApp.svg.webp" 
            alt="WhatsApp" 
            width={32} 
            height={32} 
            className={`relative z-10 transition-all duration-300 ${isHovered ? "animate-pulse" : ""}`} 
          />
          
          {/* Efecto de ondas */}
          {!(product && !hasStock) && (
            <div className="absolute inset-0 rounded-full bg-emerald-600 animate-ping opacity-20 pointer-events-none" />
          )}
        </button>
      </div>

      <ZonaSelectorDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        product={product || null}
      />
    </>
  )
}