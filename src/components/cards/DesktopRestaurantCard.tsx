import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock, Heart, Motorcycle } from '@phosphor-icons/react'
import { Restaurant } from '@/types'
import { RestaurantBadge } from '@/components/common/RestaurantBadge'
import { useFavorites } from '@/context/FavoritesContext'
import { formatCurrency } from '@/lib/utils'

interface DesktopRestaurantCardProps {
  restaurant: Restaurant
}

export const DesktopRestaurantCard: React.FC<DesktopRestaurantCardProps> = ({ restaurant }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(restaurant.id)

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(restaurant.id)
  }

  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative"
    >
      {/* Banner / Foto de Capa */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Badge de Aberto / Tempo */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Aberto</span>
        </div>

        {/* Botão de Favorito no Canto Superior Direito */}
        <button
          type="button"
          onClick={handleHeartClick}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-red-base shadow-sm transition-all active:scale-90 z-10"
          title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            size={19}
            weight={favorited ? 'fill' : 'regular'}
            className={favorited ? 'text-red-base' : 'text-gray-600'}
          />
        </button>

        {/* Badge do Restaurante sobrepondo a borda inferior */}
        <div className="absolute -bottom-4 left-4 z-10 filter drop-shadow-md">
          <RestaurantBadge name={restaurant.name} slug={restaurant.id} size="md" />
        </div>
      </div>

      {/* Conteúdo Informativo */}
      <div className="p-5 pt-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[17px] font-bold text-gray-800 group-hover:text-red-base transition-colors leading-snug truncate">
              {restaurant.name}
            </h3>
            {/* Avaliação */}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60 flex-shrink-0">
              <Star size={13} weight="fill" className="text-amber-500" />
              <span className="text-[12px] font-bold text-amber-700">
                {restaurant.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <p className="text-[13px] text-gray-500 truncate mt-1">
            {restaurant.address} • {restaurant.neighborhood}
          </p>
        </div>

        {/* Linha de Tempo de Entrega e Taxa */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-body-xs text-gray-500">
          <div className="flex items-center gap-1 text-gray-600 font-medium">
            <Clock size={15} className="text-gray-400" />
            <span>{restaurant.deliveryTime}</span>
          </div>

          <div className="flex items-center gap-1 font-semibold">
            <Motorcycle size={15} className="text-gray-400" />
            {restaurant.deliveryFee === 0 ? (
              <span className="text-emerald-600 font-bold">Entrega Grátis</span>
            ) : (
              <span className="text-gray-700">{formatCurrency(restaurant.deliveryFee)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
