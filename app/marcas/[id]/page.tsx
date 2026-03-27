import { Metadata } from 'next'
import { Suspense } from 'react'
import MarcaCategoryClient from './MarcaCategoryClient'

interface MarcaCategoryPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: MarcaCategoryPageProps): Promise<Metadata> {
  const { id } = await params

  return {
    title: `Cervezas por Marca - La Hornera`,
    description: `Encuentra todas las cervezas de esta marca en La Hornera Cervecería Artesanal`,
  }
}

export default async function MarcaCategoryPage({ params }: MarcaCategoryPageProps) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <MarcaCategoryClient params={params} />
    </Suspense>
  )
}
