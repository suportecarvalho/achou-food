import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock, Trash, Heart } from '@phosphor-icons/react'
import { Restaurant } from '@/types'
import { cn, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useFavorites } from '@/context/FavoritesContext'

export interface RestaurantCardProps {
  restaurant: Restaurant
  variant?: 'default' | 'removable' | 'compact'
  onRemove?: () => void
  showRemoveButton?: boolean
  className?: string
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  variant = 'default',
  onRemove,
  showRemoveButton = false,
  className,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(restaurant.id)

  return (
    <div
      className={cn(
        'group bg-white rounded-2xl p-3 border border-gray-200/80 transition-all duration-200 hover:shadow-card-soft hover:border-gray-300 relative overflow-hidden',
        className
      )}
    >
      <div className="flex items-center gap-3.5">
        {/* Restaurant Logo / Thumbnail */}
        <Link
          to={`/restaurant/${restaurant.id}`}
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 block"
        >
          <img
            src={restaurant.logoUrl || restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-label-2xs font-semibold uppercase">Fechado</span>
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <Link
              to={`/restaurant/${restaurant.id}`}
              className="text-title-md font-semibold text-gray-600 hover:text-red-base truncate transition-colors"
            >
              {restaurant.name}
            </Link>

            {variant !== 'removable' && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  toggleFavorite(restaurant.id)
                }}
                className="text-gray-300 hover:text-red-base transition-colors p-1"
                aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart
                  size={18}
                  weight={favorite ? 'fill' : 'regular'}
                  className={favorite ? 'text-red-base' : 'text-gray-400 hover:text-red-base'}
                />
              </button>
            )}
          </div>

          <p className="text-body-xs text-gray-400 truncate mt-0.5">
            {restaurant.address} - {restaurant.neighborhood}
          </p>

          <div className="flex items-center gap-3 mt-1.5 text-body-xs text-gray-500">
            <div className="flex items-center gap-1 font-semibold text-gray-600">
              <Star size={13} weight="fill" className="text-amber-500" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock size={13} className="text-gray-400" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <span>•</span>
            <span>
              {restaurant.deliveryFee === 0 ? (
                <span className="text-success-base font-medium">Grátis</span>
              ) : (
                formatCurrency(restaurant.deliveryFee)
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Remove Button (From Design Spec "Remover") */}
      {(showRemoveButton || variant === 'removable') && (
        <div className="mt-3 pt-3 border-t border-gray-100 animate-fadeIn">
          <Button
            variant="remove"
            onClick={onRemove}
            icon={<Trash size={16} weight="bold" />}
            className="flex items-center justify-center gap-2 bg-red-dark hover:bg-red-base text-white text-title-sm py-2 rounded-xl transition-colors"
          >
            Remover
          </Button>
        </div>
      )}
    </div>
  )
}
