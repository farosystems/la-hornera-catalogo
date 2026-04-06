'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Categoria, Linea, Marca } from '@/lib/products'
import { getLineasWithCategorias, getCategoriasWithoutLinea, getBrands } from '@/lib/supabase-products'
import { applyFiltersExcludePet } from '@/lib/filter-filters-ui'

function generateSlug(descripcion: string) {
  return descripcion?.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function FiltersQuickBar() {
  const [lineasWithCategorias, setLineasWithCategorias] = useState<(Linea & { categorias: Categoria[] })[]>([])
  const [categoriasWithoutLinea, setCategoriasWithoutLinea] = useState<Categoria[]>([])
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [loading, setLoading] = useState(true)
  const [openSection, setOpenSection] = useState<'categoria' | 'marca' | null>(null)
  const [openLineaId, setOpenLineaId] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [lineasData, categoriasData, marcasData] = await Promise.all([
          getLineasWithCategorias(),
          getCategoriasWithoutLinea(),
          getBrands(),
        ])
        const filtered = applyFiltersExcludePet(lineasData, categoriasData, marcasData)
        setLineasWithCategorias(filtered.lineasWithCategorias)
        setCategoriasWithoutLinea(filtered.categoriasWithoutLinea)
        setMarcas(filtered.marcas)
      } catch (error) {
        console.error('Error loading filters:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggleSection = (section: 'categoria' | 'marca') => {
    setOpenSection((prev) => (prev === section ? null : section))
    setOpenLineaId(null)
  }

  const btnClass = (active: boolean) =>
    `inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors sm:px-4 sm:text-[15px] ${
      active
        ? 'border-amber-600/60 bg-red-950/70 text-amber-100 shadow-inner'
        : 'border-stone-600/80 bg-zinc-900/90 text-stone-100 hover:border-red-900/70 hover:bg-stone-800/80'
    }`

  if (loading) {
    return (
      <div className="border-t border-red-950/40 py-1.5">
        <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-1.5 px-2 sm:gap-2 sm:px-3">
          <div className="h-9 rounded-lg bg-stone-800/50 animate-pulse" />
          <div className="h-9 rounded-lg bg-stone-800/50 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-red-950/40 bg-zinc-950/50">
      <div className="py-1.5 sm:py-2">
        <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-1.5 px-2 sm:max-w-xl sm:gap-2 sm:px-3">
          <button
            type="button"
            onClick={() => toggleSection('categoria')}
            aria-expanded={openSection === 'categoria'}
            className={btnClass(openSection === 'categoria')}
          >
            Categoría
            <ChevronDown
              size={18}
              className={`shrink-0 transition-transform duration-200 ${openSection === 'categoria' ? 'rotate-180' : ''}`}
            />
          </button>
          <button
            type="button"
            onClick={() => toggleSection('marca')}
            aria-expanded={openSection === 'marca'}
            className={btnClass(openSection === 'marca')}
          >
            Marca
            <ChevronDown
              size={18}
              className={`shrink-0 transition-transform duration-200 ${openSection === 'marca' ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {openSection === 'categoria' && (
          <div className="mt-3 max-h-[min(55vh,360px)] overflow-y-auto rounded-xl border border-stone-700/80 bg-zinc-900/95 p-3 shadow-inner">
            <div className="space-y-1">
              {lineasWithCategorias.map((linea) => (
                <div
                  key={linea.id}
                  className={`rounded-lg ${
                    linea.categorias.length > 0
                      ? 'border border-amber-600/45 bg-gradient-to-r from-red-950/50 to-zinc-900/85 shadow-sm'
                      : 'border border-transparent hover:border-stone-600/60'
                  }`}
                >
                  {linea.categorias.length > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenLineaId((id) => (id === linea.id ? null : linea.id))
                        }
                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-amber-100 hover:bg-red-950/40 ${
                          openLineaId === linea.id ? 'ring-2 ring-amber-500/40' : ''
                        }`}
                      >
                        <span>{linea.descripcion}</span>
                        <span className="flex shrink-0 items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-amber-200 bg-amber-950/55 px-1.5 py-0.5 rounded border border-amber-700/45">
                            {linea.categorias.length}
                          </span>
                          <ChevronRight
                            size={16}
                            className={`text-amber-400 transition-transform ${openLineaId === linea.id ? 'rotate-90' : ''}`}
                          />
                        </span>
                      </button>
                      {openLineaId === linea.id && (
                        <div className="border-t border-stone-700/80 px-2 py-2 pl-4">
                          <div className="flex flex-col gap-0.5 border-l-2 border-red-900/50 pl-3">
                            {linea.categorias.map((category) => {
                              const slug = generateSlug(category.descripcion)
                              return (
                                <Link
                                  key={category.id}
                                  href={`/${slug}`}
                                  className="rounded-md px-2 py-1.5 text-sm text-stone-200 hover:bg-stone-800 hover:text-amber-400"
                                >
                                  {category.descripcion}
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={`/lineas/${generateSlug(linea.descripcion)}`}
                      className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-stone-100 hover:bg-stone-800/80 hover:text-amber-400"
                    >
                      {linea.descripcion}
                      <ChevronRight size={16} className="text-stone-500" />
                    </Link>
                  )}
                </div>
              ))}
              {categoriasWithoutLinea.map((category) => {
                const slug = generateSlug(category.descripcion)
                return (
                  <Link
                    key={category.id}
                    href={`/${slug}`}
                    className="flex items-center justify-between gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-stone-200 hover:border-stone-600 hover:bg-stone-800/60 hover:text-amber-400"
                  >
                    {category.descripcion}
                    <ChevronRight size={16} className="shrink-0 text-stone-500" />
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {openSection === 'marca' && (
          <div className="mt-3 max-h-[min(55vh,320px)] overflow-y-auto rounded-xl border border-stone-700/80 bg-zinc-900/95 p-3 shadow-inner">
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {marcas.map((marca) => (
                <Link
                  key={marca.id}
                  href={`/marcas/${marca.id}`}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-stone-200 hover:bg-stone-800 hover:text-amber-400"
                >
                  {marca.descripcion}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
