"use client"

import { MessageCircle } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/lib/products"
import { useConfiguracion } from "@/hooks/use-configuracion"
import { useZonas } from "@/hooks/use-zonas"
import ZonaSelectorDialog from "./ZonaSelectorDialog"

interface WhatsAppButtonProps {
  product: Product
}

export default function WhatsAppButton({ product }: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { telefono, loading: configLoading, error: configError } = useConfiguracion()
  const { zonas, configuracionZonas, loading: zonasLoading } = useZonas()
  const hasStock = product.tiene_stock === true // Solo true permite consultar
  
  // Función para generar el mensaje de WhatsApp
  const generateWhatsAppMessage = (product: Product): string => {
    // Debug: verificar qué tipo de producto es
    console.log('🔍 Generando mensaje para producto:', product)
    console.log('🔍 Tiene descripcion_detallada:', !!product.descripcion_detallada)
    console.log('🔍 Descripción incluye "Lista de":', product.descripcion?.includes('Lista de'))
    
    // Verificar si es un producto virtual de lista (tiene descripcion_detallada)
    if (product.descripcion_detallada && product.descripcion?.includes('Lista de')) {
      console.log('🔍 Detectado producto virtual de lista')
      let message = `Hola! 👋 Me interesa consultar sobre los siguientes productos:\n\n`
      
      // Usar la descripción detallada que contiene la lista de productos
      message += product.descripcion_detallada
      
      message += `\n\n¿Podrían brindarme más información sobre estos productos?`
      
      console.log('🔍 Mensaje generado:', message)
      return message
    }
    
    // Mensaje normal para productos individuales
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
  }

  const handleClick = () => {
    // No permitir consultar si no hay stock
    if (!hasStock) {
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
      const message = generateWhatsAppMessage(product)
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

  // Si no hay stock, mostrar un botón deshabilitado
  if (!hasStock) {
    return (
      <button
        disabled
        className="relative w-full bg-zinc-800 text-stone-500 font-semibold py-2 px-4 rounded-xl flex items-center justify-center transition-all duration-300 text-base shadow-md cursor-not-allowed border border-stone-700"
        title="Sin stock"
      >
        <Image 
          src="/WhatsApp.svg.webp" 
          alt="WhatsApp" 
          width={20} 
          height={20} 
          className="mr-2 opacity-50" 
        />
        <span>Sin Stock</span>
      </button>
    )
  }

  // Si está cargando, mostrar un botón deshabilitado
  if (configLoading || zonasLoading) {
    return (
      <button
        disabled
        className="relative w-full bg-zinc-800 text-stone-400 font-semibold py-2 px-4 rounded-xl flex items-center justify-center transition-all duration-300 text-base shadow-md cursor-not-allowed border border-stone-700"
      >
        <Image 
          src="/WhatsApp.svg.webp" 
          alt="WhatsApp" 
          width={20} 
          height={20} 
          className="mr-2 animate-pulse" 
        />
        <span>Cargando...</span>
      </button>
    )
  }

  // Si hay error en la configuración, mostrar el botón con el número por defecto
  if (configError) {
    console.warn('Error al cargar configuración, usando número por defecto:', configError)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="relative w-full bg-gradient-to-r from-emerald-900 to-green-950 hover:from-emerald-800 hover:to-green-900 text-emerald-50 font-semibold py-2 px-4 rounded-xl flex items-center justify-center transition-all duration-300 text-base shadow-lg shadow-black/30 hover:shadow-xl border border-emerald-800/50 transform hover:scale-[1.02] overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Efecto de onda */}
        <div
          className={`absolute inset-0 bg-emerald-400/15 transform transition-transform duration-500 ${
            isHovered ? "translate-x-0" : "-translate-x-full"
          }`}
        ></div>

        <Image 
          src="/WhatsApp.svg.webp" 
          alt="WhatsApp" 
          width={20} 
          height={20} 
          className={`mr-2 transition-all duration-300 ${isHovered ? "animate-bounce" : ""}`} 
        />

        <span className="relative z-10">Chatea con tu vendedor!</span>

        {/* Partículas animadas */}
        <div
          className={`absolute top-2 right-4 w-2 h-2 bg-emerald-300/90 rounded-full transition-all duration-300 ${
            isHovered ? "animate-ping" : "opacity-0"
          }`}
        ></div>
      </button>

      <ZonaSelectorDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        product={product}
      />
    </>
  )
}
