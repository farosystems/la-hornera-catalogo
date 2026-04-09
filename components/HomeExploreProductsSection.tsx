"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import ProductCard from "./ProductCard"
import { useProducts } from "@/hooks/use-products"
import { ctaPrimaryButtonClasses } from "@/lib/cta-button-classes"

const PAGE_SIZE = 12

export default function HomeExploreProductsSection() {
  const { products, featuredProducts, loading, error } = useProducts()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const catalogList = useMemo(() => {
    const valid = products.filter((p) => (p.precio || 0) > 0)
    const featuredIds = new Set(featuredProducts.map((p) => Number(p.id)))
    const notFeatured = valid.filter((p) => !featuredIds.has(Number(p.id)))
    const featuredRest = valid.filter((p) => featuredIds.has(Number(p.id)))
    return [...notFeatured, ...featuredRest]
  }, [products, featuredProducts])

  const visible = catalogList.slice(0, visibleCount)
  const hasMore = visibleCount < catalogList.length

  if (loading) {
    return (
      <section className="py-14 md:py-20 bg-gradient-to-b from-zinc-950 via-stone-950 to-zinc-950 border-t border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-stone-400">Cargando catálogo...</p>
        </div>
      </section>
    )
  }

  if (error || catalogList.length === 0) {
    return null
  }

  return (
    <section
      id="catalogo-inicio"
      className="py-14 md:py-20 bg-gradient-to-b from-zinc-950 via-stone-950 to-zinc-950 border-t border-stone-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-100 mb-3 bg-gradient-to-r from-amber-500 to-red-700 bg-clip-text text-transparent">
            Más productos
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto text-sm sm:text-base">
            Seguí explorando el catálogo. Podés cargar más filas o entrar a una categoría.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visible.map((product) => (
            <div key={product.id} className="animate-fade-in-up">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {hasMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className={`inline-flex items-center justify-center px-8 py-3 text-sm sm:text-base ${ctaPrimaryButtonClasses}`}
            >
              Cargar más productos
            </button>
          )}
          <Link
            href="/categorias"
            className={`inline-flex items-center justify-center px-8 py-3 text-sm sm:text-base border border-stone-600 text-stone-200 rounded-xl font-semibold hover:bg-stone-800/80 transition-colors`}
          >
            Ver todas las categorías
          </Link>
        </div>
      </div>
    </section>
  )
}
