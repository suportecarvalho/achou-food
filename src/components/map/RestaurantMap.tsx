import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Clock, NavigationArrow, X } from '@phosphor-icons/react'
import { Restaurant } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface RestaurantMapProps {
  restaurants: Restaurant[]
}

export const RestaurantMap: React.FC<RestaurantMapProps> = ({ restaurants }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(
    restaurants[0] || null
  )

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] rounded-3xl overflow-hidden border border-gray-200 shadow-sm bg-[#e8ece9]">
      {/* Map visual background simulation with streets and grid */}
      <div className="absolute inset-0 opacity-80 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#d5ded9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="#edf2ee" />
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Main roads */}
          <path d="M-50 180 Q 200 160 500 240 T 1200 220" stroke="#FFFFFF" strokeWidth="18" fill="none" />
          <path d="M220 -20 Q 250 250 280 600" stroke="#FFFFFF" strokeWidth="22" fill="none" />
          <path d="M600 -20 Q 560 300 620 600" stroke="#FFFFFF" strokeWidth="16" fill="none" />
          <path d="M-50 360 Q 350 340 1000 400" stroke="#FFFFFF" strokeWidth="14" fill="none" />

          {/* Road center lines */}
          <path d="M-50 180 Q 200 160 500 240 T 1200 220" stroke="#ffebc2" strokeWidth="3" fill="none" strokeDasharray="8 8" />
          <path d="M220 -20 Q 250 250 280 600" stroke="#ffebc2" strokeWidth="3" fill="none" strokeDasharray="8 8" />

          {/* Parks / Green areas */}
          <rect x="80" y="60" width="100" height="90" rx="20" fill="#d7e8d6" />
          <rect x="380" y="270" width="140" height="80" rx="16" fill="#d7e8d6" />
        </svg>
      </div>

      {/* Map Header / Location badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-gray-200 shadow-sm text-body-xs font-medium text-gray-600">
        <NavigationArrow size={16} weight="fill" className="text-red-base animate-pulse" />
        <span>São Paulo, SP • <strong>Próximo a você</strong></span>
      </div>

      {/* Restaurant Markers on the map */}
      <div className="absolute inset-0 z-10 p-8">
        {restaurants.map((restaurant, idx) => {
          // Calculate spread positions
          const positions = [
            { top: '35%', left: '28%' },
            { top: '25%', left: '60%' },
            { top: '65%', left: '42%' },
            { top: '50%', left: '72%' },
            { top: '75%', left: '20%' },
          ]
          const pos = positions[idx % positions.length]
          const isSelected = selectedRestaurant?.id === restaurant.id

          return (
            <div
              key={restaurant.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => setSelectedRestaurant(restaurant)}
                className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-lg transition-transform duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-red-base text-white scale-110 ring-4 ring-red-base/20 z-30'
                    : 'bg-white text-gray-600 hover:scale-105 z-10 border border-gray-200'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full overflow-hidden flex-shrink-0 ${
                    isSelected ? 'ring-2 ring-white' : ''
                  }`}
                >
                  <img
                    src={restaurant.logoUrl || restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-label-xs font-semibold max-w-[110px] truncate">
                  {restaurant.name}
                </span>
                <span className="text-label-2xs font-bold opacity-90 flex items-center">
                  <Star size={10} weight="fill" className={isSelected ? 'text-white' : 'text-amber-500'} />
                  {restaurant.rating.toFixed(1)}
                </span>
              </button>
            </div>
          )
        })}
      </div>

      {/* Selected Restaurant Popup Preview */}
      {selectedRestaurant && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-20 bg-white rounded-2xl p-3.5 shadow-xl border border-gray-200/90 animate-fadeIn">
          <button
            type="button"
            onClick={() => setSelectedRestaurant(null)}
            className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 p-1"
            aria-label="Fechar prévia"
          >
            <X size={16} />
          </button>

          <div className="flex gap-3">
            <img
              src={selectedRestaurant.logoUrl || selectedRestaurant.imageUrl}
              alt={selectedRestaurant.name}
              className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0"
            />
            <div className="min-w-0 pr-4">
              <h4 className="text-title-sm font-semibold text-gray-600 truncate">
                {selectedRestaurant.name}
              </h4>
              <p className="text-body-xs text-gray-400 truncate mt-0.5">
                {selectedRestaurant.neighborhood}
              </p>
              <div className="flex items-center gap-2 mt-1 text-label-2xs text-gray-500">
                <span className="flex items-center text-amber-500 font-bold">
                  <Star size={11} weight="fill" />
                  {selectedRestaurant.rating.toFixed(1)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Clock size={11} />
                  {selectedRestaurant.deliveryTime}
                </span>
                <span>•</span>
                <span>{formatCurrency(selectedRestaurant.deliveryFee)}</span>
              </div>
            </div>
          </div>

          <Link
            to={`/restaurant/${selectedRestaurant.id}`}
            className="mt-3 block w-full text-center py-2 bg-red-base hover:bg-red-dark text-white text-label-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Ver Cardápio
          </Link>
        </div>
      )}
    </div>
  )
}
