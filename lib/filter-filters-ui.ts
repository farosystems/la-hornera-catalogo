import type { Categoria, Linea, Marca } from '@/lib/products'

/** Nombre contiene "PET" (sin distinguir mayúsculas). */
export function labelContainsPet(text: string | undefined | null): boolean {
  if (!text) return false
  return text.toUpperCase().includes('PET')
}

/** Quita PET de líneas, categorías y marcas para los filtros del sitio. */
export function applyFiltersExcludePet(
  lineas: (Linea & { categorias: Categoria[] })[],
  categoriasSinLinea: Categoria[],
  marcas: Marca[]
) {
  const lineasWithCategorias = lineas
    .filter((l) => !labelContainsPet(l.descripcion))
    .map((l) => ({
      ...l,
      categorias: l.categorias.filter((c) => !labelContainsPet(c.descripcion)),
    }))

  const categoriasWithoutLinea = categoriasSinLinea.filter(
    (c) => !labelContainsPet(c.descripcion)
  )
  const marcasFiltered = marcas.filter((m) => !labelContainsPet(m.descripcion))

  return { lineasWithCategorias, categoriasWithoutLinea, marcas: marcasFiltered }
}
