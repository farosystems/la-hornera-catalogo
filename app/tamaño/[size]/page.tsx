import { Metadata } from 'next'
import { Suspense } from 'react'
import TamañoCategoryClient from './TamañoCategoryClient'

interface TamañoCategoryPageProps {
  params: Promise<{
    size: string
  }>
}

export async function generateMetadata({ params }: TamañoCategoryPageProps): Promise<Metadata> {
  const { size } = await params
  const tamañoFormateado = size.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())

  return {
    title: `Cervezas Tamaño ${tamañoFormateado} - La Hornera`,
    description: `Encuentra todas las cervezas de tamaño ${tamañoFormateado} en La Hornera Cervecería Artesanal`,
  }
}

export default async function TamañoCategoryPage({ params }: TamañoCategoryPageProps) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TamañoCategoryClient params={params} />
    </Suspense>
  )
}
