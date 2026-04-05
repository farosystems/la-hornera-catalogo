'use client'

interface FormattedProductDescriptionProps {
  description: string
}

export default function FormattedProductDescription({ description }: FormattedProductDescriptionProps) {
  // Función para sanitizar HTML básico y permitir estilos seguros
  const sanitizeHtml = (html: string) => {
    // Permitir tags HTML básicos y estilos de color
    return html
      .replace(/style="([^"]*font-family[^"]*)"/gi, '') // Eliminar font-family para mantener consistencia
      .replace(/javascript:/gi, '') // Seguridad básica
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Eliminar scripts
  }

  // Verificar si el texto contiene HTML
  const containsHtml = /<\/?[a-z][\s\S]*>/i.test(description)

  if (containsHtml) {
    // Si contiene HTML, renderizar como HTML con dangerouslySetInnerHTML
    const sanitizedHtml = sanitizeHtml(description)
    
    return (
      <div 
        className="prose prose-gray max-w-none
        prose-h1:text-2xl prose-h1:font-bold prose-h1:text-emerald-700 prose-h1:mb-4
        prose-h2:text-xl prose-h2:font-bold prose-h2:text-amber-600 prose-h2:mb-3
        prose-h3:text-lg prose-h3:font-semibold prose-h3:text-gray-800 prose-h3:mb-2
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
        prose-strong:text-gray-900 prose-strong:font-semibold
        prose-em:text-gray-600
        prose-ul:my-4 prose-li:my-1 prose-li:text-gray-700
        prose-ol:my-4
        [&_*]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    )
  } else {
    // Si no contiene HTML, usar el formateo automático anterior (fallback)
    return (
      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
        {description}
      </div>
    )
  }
}