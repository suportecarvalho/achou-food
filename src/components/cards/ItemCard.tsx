import React from 'react'
import { Plus, Minus } from '@phosphor-icons/react'
import { MenuItem, Restaurant } from '@/types'
import { formatCurrency, cn } from '@/lib/utils'
import { useCart } from '@/context/CartContext'

export interface ItemCardProps {
  item: MenuItem
  restaurant?: Restaurant
  className?: string
  // For controlled showcase in design system
  controlledQuantity?: number
  onQuantityChange?: (qty: number) => void
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  restaurant,
  className,
  controlledQuantity,
  onQuantityChange,
}) => {
  const { getItemQuantity, addItem, updateQuantity } = useCart()

  const isControlled = controlledQuantity !== undefined
  const quantity = isControlled ? controlledQuantity : getItemQuantity(item.id)

  const handleAdd = () => {
    if (isControlled && onQuantityChange) {
      onQuantityChange(quantity + 1)
      return
    }
    if (restaurant) {
      addItem(item, restaurant)
    }
  }

  const handleIncrement = () => {
    if (isControlled && onQuantityChange) {
      onQuantityChange(quantity + 1)
      return
    }
    updateQuantity(item.id, 1)
  }

  const handleDecrement = () => {
    if (isControlled && onQuantityChange) {
      onQuantityChange(Math.max(0, quantity - 1))
      return
    }
    updateQuantity(item.id, -1)
  }

  return (
    <div
      className={cn(
        'group bg-white rounded-2xl p-3 border border-gray-200/80 hover:border-gray-300 transition-all duration-200 flex items-center justify-between gap-3 hover:shadow-card-soft',
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Product Thumbnail */}
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Product Info */}
        <div className="min-w-0">
          <h4 className="text-title-sm font-semibold text-gray-600 truncate">
            {item.name}
          </h4>
          <p className="text-title-sm font-semibold text-gray-600 mt-0.5">
            {formatCurrency(item.price)}
          </p>
          {item.description && (
            <p className="text-body-xs text-gray-400 line-clamp-1 mt-0.5 max-w-xs">
              {item.description}
            </p>
          )}
        </div>
      </div>

      {/* Action: Not Added vs Added State */}
      <div className="flex-shrink-0 pl-2">
        {quantity === 0 ? (
          // "Not added" state: Single red plus button
          <button
            type="button"
            onClick={handleAdd}
            className="w-8 h-8 rounded-full border border-gray-200 hover:border-red-base flex items-center justify-center text-red-base hover:bg-red-50 active:scale-95 transition-all shadow-sm"
            aria-label={`Adicionar ${item.name}`}
            title="Adicionar à sacola"
          >
            <Plus size={16} weight="bold" />
          </button>
        ) : (
          // "Added" state: Quantity selector pill (- 1 +)
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 border border-gray-200 rounded-full shadow-sm">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:text-red-base hover:bg-white transition-colors active:scale-90"
              aria-label="Diminuir quantidade"
            >
              <Minus size={13} weight="bold" />
            </button>

            <span className="text-label-xs font-bold text-gray-600 min-w-4 text-center select-none">
              {quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrement}
              className="w-6 h-6 rounded-full flex items-center justify-center text-red-base hover:bg-white transition-colors active:scale-90"
              aria-label="Aumentar quantidade"
            >
              <Plus size={13} weight="bold" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
