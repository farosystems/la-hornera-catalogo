'use client'

import { useState, useEffect, useMemo, memo } from 'react'
import { PlanFinanciacion, Product } from '@/lib/products'
import { getPlanesProducto, calcularCuota, formatearPrecio, getTipoPlanesProducto, calcularAnticipo } from '@/lib/supabase-products'
import { useShoppingList } from '@/hooks/use-shopping-list'

interface FinancingPlansLargeProps {
  productoId: string
  precio: number
  showDebug?: boolean
  hasStock?: boolean
  product?: Product
}

const FinancingPlansLarge = memo(function FinancingPlansLarge({ productoId, precio, showDebug = false, hasStock = true, product }: FinancingPlansLargeProps) {
  const [planes, setPlanes] = useState<PlanFinanciacion[]>([])
  const [loading, setLoading] = useState(true)
  const [tipoPlanes, setTipoPlanes] = useState<'especiales' | 'default' | 'todos' | 'ninguno'>('ninguno')
  const { isInList, selectedPlans, setSelectedPlan, addItem } = useShoppingList()

  const inList = isInList(Number(productoId))
  const planActual = selectedPlans[productoId]

  const handlePlanClick = (plan: PlanFinanciacion, cuotaMensual: number) => {
    if (!inList && product) {
      addItem(product)
    }
    if (planActual?.planId === plan.id) {
      setSelectedPlan(productoId, null)
    } else {
      setSelectedPlan(productoId, {
        planId: plan.id,
        nombre: plan.nombre,
        cuotas: plan.cuotas,
        cuotaMensual
      })
    }
  }

  // Memoizar cálculos costosos y ordenar de menor a mayor precio
  const calculatedPlanes = useMemo(() => {
    // Filtrar planes por monto_minimo y monto_maximo
    // Consideramos "sin mínimo" valores muy pequeños como 0.01
    const UMBRAL_SIN_MINIMO = 1

    const planesQueCalifican = planes.filter(plan => {
      // El plan de 1 cuota (contado) se muestra SIEMPRE
      if (plan.cuotas === 1) return true

      // Si el plan no tiene monto_minimo significativo (< 1), incluirlo siempre
      if (!plan.monto_minimo || plan.monto_minimo < UMBRAL_SIN_MINIMO) return true

      // Si tiene monto_minimo significativo, verificar que el precio lo cumpla
      const cumpleMinimo = precio >= plan.monto_minimo
      const cumpleMaximo = !plan.monto_maximo || plan.monto_maximo === 0 || precio <= plan.monto_maximo

      return cumpleMinimo && cumpleMaximo
    })

    // Mostrar todos los planes que califican (sin priorización)
    const planesFiltrados = planesQueCalifican

    // DEDUPLICACIÓN FINAL: eliminar duplicados por ID antes de mapear
    const planesFinalesFiltrados = planesFiltrados.filter((plan, index, self) =>
      index === self.findIndex((p) => p.id === plan.id)
    )

    return planesFinalesFiltrados.map(plan => {
      const calculo = calcularCuota(precio, plan)
      const anticipo = calcularAnticipo(precio, plan)
      return { plan, calculo, anticipo }
    })
    .filter(item => item.calculo)
    .sort((a, b) => {
      // Ordenar por cuota mensual EF de menor a mayor
      return a.calculo!.cuota_mensual - b.calculo!.cuota_mensual
    })
  }, [planes, precio])

  useEffect(() => {
    async function loadPlanes() {
      try {
        setLoading(true)
        const [planesData, tipoData] = await Promise.all([
          getPlanesProducto(productoId),
          getTipoPlanesProducto(productoId)
        ])
        //console.log('Planes cargados para producto', productoId, ':', planesData)
        //console.log('Tipo de planes para producto', productoId, ':', tipoData)

        // Deduplicar planes por ID como medida de seguridad adicional
        const planesUnicos = planesData.filter((plan, index, self) =>
          index === self.findIndex((p) => p.id === plan.id)
        )

        setPlanes(planesUnicos)
        setTipoPlanes(tipoData)
      } catch (error) {
        console.error('Error loading financing plans:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPlanes()
  }, [productoId])

  if (loading) {
    return (
      <div className="mt-3 p-2 bg-zinc-900/80 rounded border border-stone-800">
        <div className="animate-pulse h-4 bg-stone-700 rounded"></div>
      </div>
    )
  }

  if (planes.length === 0) {
    return null
  }

  // Función para obtener el texto descriptivo del tipo de planes
  const getTipoPlanesText = (tipo: string) => {
    switch (tipo) {
      case 'especiales':
        return 'Planes Especiales'
      case 'default':
        return 'Planes por Defecto'
      case 'todos':
        return 'Todos los Planes'
      default:
        return 'Sin Planes'
    }
  }

  const colores = ['bg-red-950/50 text-amber-200', 'bg-stone-800 text-stone-200', 'bg-amber-950/40 text-amber-100', 'bg-orange-950/40 text-orange-200']

  return (
    <div className={`bg-zinc-900/90 border border-stone-700 rounded-lg p-4 sm:p-6 shadow-sm transition-all duration-300 ${
      !hasStock ? 'opacity-50 grayscale' : ''
    }`}>
      <div className="flex items-center gap-2 mb-1 sm:mb-2">
        <h3 className="text-lg sm:text-xl font-bold text-stone-100">Planes de Financiación</h3>
        {!hasStock && (
          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full font-semibold">
            NO DISPONIBLE
          </span>
        )}
      </div>

      <p className="text-xs text-amber-500/90 font-semibold mb-3">Seleccioná el plan de pago:</p>

      {/* Información de debug */}
      {showDebug && (
        <div className="text-xs text-stone-500 mb-2 p-2 bg-zinc-900 rounded border border-stone-800">
          <strong>Tipo de planes:</strong> {getTipoPlanesText(tipoPlanes)} | <strong>Total:</strong> {planes.length} planes
        </div>
      )}

      <div className="space-y-2 sm:space-y-3">
        {calculatedPlanes.map(({ plan, calculo, anticipo }, index) => {
          const sinInteres = plan.recargo_fijo === 0 && plan.recargo_porcentual === 0
          const esContado = plan.cuotas === 1

          let descuentoContado = 20
          if (esContado && plan.nombre) {
            const match = plan.nombre.match(/(\d+)%/i)
            if (match) {
              descuentoContado = parseInt(match[1])
            }
          }

          const precioContado = esContado ? precio * (1 - descuentoContado / 100) : calculo!.cuota_mensual
          const isSelected = planActual?.planId === plan.id

          const baseClass = esContado ? 'bg-red-100 text-red-800' : colores[index % colores.length]
          const selectedClass = 'ring-2 ring-amber-600 bg-red-950/70 text-amber-100'

          return (
            <button
              key={`${productoId}-${plan.id}`}
              onClick={() => hasStock && handlePlanClick(plan, calculo!.cuota_mensual)}
              disabled={!hasStock}
              className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl text-center font-bold text-sm sm:text-lg transition-all duration-200 ${
                isSelected ? selectedClass : baseClass
              } ${!hasStock ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'}`}
            >
              <div className="mb-1 sm:mb-2">
                {esContado ? (
                  <>
                    <div className="text-xl sm:text-3xl mb-1">
                      Contado {descuentoContado}% OFF!
                    </div>
                    <div className="text-2xl sm:text-4xl">
                      ${formatearPrecio(precioContado)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-lg sm:text-2xl mb-1">
                      {plan.cuotas} {sinInteres ? 'Cuotas Sin interés' : 'cuotas mensuales'} de
                    </div>
                    <div className="text-xl sm:text-3xl">
                      ${formatearPrecio(calculo!.cuota_mensual)} {!sinInteres && 'EF'}
                    </div>
                  </>
                )}
              </div>
              {!esContado && anticipo > 0 && (
                <div className="text-xs sm:text-base font-semibold opacity-90 border-t pt-1 sm:pt-2 mt-1 sm:mt-2">
                  Anticipo: ${formatearPrecio(anticipo)}
                </div>
              )}
              {isSelected && (
                <div className="text-xs sm:text-sm mt-1 font-semibold text-amber-400">✓ Seleccionado</div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
})

export default FinancingPlansLarge
