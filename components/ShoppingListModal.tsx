"use client"

import { X, Trash2, MessageCircle } from 'lucide-react'
import { useShoppingList } from '@/hooks/use-shopping-list'
import WhatsAppButton from './WhatsAppButton'

interface ShoppingListModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShoppingListModal({ isOpen, onClose }: ShoppingListModalProps) {
  const { items, removeItem, clearList, itemCount, selectedPlans, quantities } = useShoppingList()

  if (!isOpen) return null

  const buildDescripcionDetallada = () => {
    let desc = items.map((item, index) => {
      const quantity = quantities[item.id] || 1
      let productLine = `${index + 1}. ${item.descripcion || item.name || 'Producto'}${quantity > 1 ? ` (Cantidad: ${quantity})` : ''}`

      if (item.categoria?.descripcion) {
        productLine += `\n   Categoría: ${item.categoria.descripcion}`
      }
      if (item.marca?.descripcion) {
        productLine += `\n   Marca: ${item.marca.descripcion}`
      }

      const plan = selectedPlans[item.id]
      if (plan) {
        if (plan.cuotas === 1) {
          productLine += `\n   💳 Forma de pago: Contado (${plan.nombre})`
        } else {
          productLine += `\n   💳 Forma de pago: ${plan.nombre} — ${plan.cuotas} cuotas de $${plan.cuotaMensual.toLocaleString('es-AR')}`
        }
      }

      return productLine
    }).join('\n\n')

    desc += '\n\n---\n🏪 Retiro en el local'
    return desc
  }

  const virtualProduct = {
    id: '0',
    descripcion: `Lista de ${itemCount} producto${itemCount !== 1 ? 's' : ''}`,
    name: `Lista de ${itemCount} producto${itemCount !== 1 ? 's' : ''}`,
    categoria: { id: 0, descripcion: 'Múltiples categorías', created_at: '' },
    marca: { id: 0, descripcion: 'Varias marcas', created_at: '' },
    precio: 0,
    imagen: '/placeholder.jpg',
    tiene_stock: true,
    stock: 1,
    fk_id_categoria: 0,
    fk_id_marca: 0,
    destacado: false,
    descripcion_detallada: buildDescripcionDetallada()
  }

  const handleClearList = () => {
    clearList()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-stone-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-700 sticky top-0 bg-zinc-900 z-10">
          <div>
            <h2 className="text-2xl font-bold text-stone-100">Mis Pedidos</h2>
            <p className="text-stone-400">{itemCount} producto{itemCount !== 1 ? 's' : ''} seleccionado{itemCount !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-800 rounded-full transition-colors"
          >
            <X size={24} className="text-stone-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-stone-500" />
              </div>
              <h3 className="text-lg font-semibold text-stone-300 mb-2">
                Tu lista está vacía
              </h3>
              <p className="text-stone-500">
                Agrega productos desde las tarjetas o páginas de productos
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="bg-zinc-950/80 border border-stone-800 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-16 h-16 bg-stone-900 rounded-lg overflow-hidden flex-shrink-0 border border-stone-700">
                        <img
                          src={item.imagen || item.image || '/placeholder.jpg'}
                          alt={item.descripcion || item.name || 'Producto'}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-stone-100 truncate">
                          {item.descripcion || item.name || 'Producto'}
                        </h3>
                        <div className="flex gap-2 mt-1 flex-wrap items-center">
                          {(quantities[item.id] || 1) > 1 && (
                            <span className="text-xs text-white bg-gray-700 px-2 py-1 rounded-full font-bold">
                              x{quantities[item.id]}
                            </span>
                          )}
                          {item.categoria && (
                            <span className="text-xs text-amber-500 bg-red-950/50 px-2 py-1 rounded-full">
                              {item.categoria.descripcion}
                            </span>
                          )}
                          {item.marca && (
                            <span className="text-xs text-amber-400 bg-stone-800 px-2 py-1 rounded-full">
                              {item.marca.descripcion}
                            </span>
                          )}
                        </div>
                        {selectedPlans[item.id] && (
                          <div className="mt-1.5 text-xs font-semibold text-amber-50 bg-red-900 inline-block px-2 py-0.5 rounded-full">
                            💳 {selectedPlans[item.id].cuotas === 1
                              ? 'Contado'
                              : `${selectedPlans[item.id].cuotas} cuotas de $${selectedPlans[item.id].cuotaMensual.toLocaleString('es-AR')}`}
                          </div>
                        )}
                        {!selectedPlans[item.id] && (
                          <div className="mt-1.5 text-xs text-gray-400 italic">
                            Sin plan seleccionado — selecciona en la card
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeItem(Number(item.id))}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-500 hover:text-red-700"
                        title="Eliminar de la lista"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-stone-700 bg-zinc-950/90 sticky bottom-0">
            <div className="flex gap-3">
              <button
                onClick={handleClearList}
                className="flex-1 px-4 py-3 bg-stone-800 text-stone-200 font-semibold rounded-xl hover:bg-stone-700 transition-colors"
              >
                Limpiar Lista
              </button>
              <div className="flex-1">
                <WhatsAppButton product={virtualProduct} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
