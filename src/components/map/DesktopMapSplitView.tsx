import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  List,
  MagnifyingGlass,
  Star,
  Clock,
  Motorcycle,
  MapPin,
  CaretRight,
  X,
} from '@phosphor-icons/react'
import { Restaurant } from '@/types'
import { RestaurantBadge } from '@/components/common/RestaurantBadge'
import { RestaurantMap } from '@/components/map/RestaurantMap'
import { formatCurrency, cn } from '@/lib/utils'

interface DesktopMapSplitViewProps {
  restaurants: Restaurant[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onSwitchToList: () => void
}

export const DesktopMapSplitView: React.FC<DesktopMapSplitViewProps> = ({
  restaurants,
  searchQuery,
  onSearchChange,
  onSwitchToList,
}) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(
    restaurants[0] || null
  )

  return (
    <div className="flex-1 w-full h-[calc(100vh-73px)] flex overflow-hidden bg-gray-50">
      {/* ========================================================================= */}
      {/* PAINEL LATERAL ESQUERDO: LISTA DE RESTAURANTES */}
      {/* ========================================================================= */}
      <aside className="w-[400px] xl:w-[440px] h-full flex flex-col bg-white border-r border-gray-200/80 shadow-md z-20 flex-shrink-0">
        {/* Top Header do Painel */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3 bg-white">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Restaurantes no Mapa
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {restaurants.length} {restaurants.length === 1 ? 'local encontrado' : 'locais encontrados'} em Canela
            </p>
          </div>

          <button
            type="button"
            onClick={onSwitchToList}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-full transition-colors active:scale-95"
            title="Voltar para a visualização em grade"
          >
            <List size={16} />
            <span>Ver em Lista</span>
          </button>
        </div>

        {/* Input de Busca Dentro do Painel */}
        <div className="p-3.5 border-b border-gray-100 bg-gray-50/60">
          <div className="relative">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filtrar por nome ou bairro..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-red-base focus:ring-1 focus:ring-red-base transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Lista de Restaurantes com Scroll */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y-0">
          {restaurants.length === 0 ? (
            <div className="py-12 text-center px-4">
              <p className="text-sm font-semibold text-gray-600">
                Nenhum restaurante encontrado
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tente ajustar seu termo de busca
              </p>
            </div>
          ) : (
            restaurants.map((restaurant) => {
              const isSelected = selectedRestaurant?.id === restaurant.id

              return (
                <div
                  key={restaurant.id}
                  onClick={() => setSelectedRestaurant(restaurant)}
                  className={cn(
                    'p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 relative group',
                    isSelected
                      ? 'bg-red-50/40 border-red-base shadow-sm ring-1 ring-red-base/20'
                      : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-xs'
                  )}
                >
                  {/* Badge */}
                  <RestaurantBadge
                    name={restaurant.name}
                    slug={restaurant.id}
                    size="sm"
                    className="flex-shrink-0"
                  />

                  {/* Informações */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3
                        className={cn(
                          'text-sm font-bold truncate transition-colors',
                          isSelected ? 'text-red-base' : 'text-gray-800 group-hover:text-red-base'
                        )}
                      >
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center gap-0.5 text-xs font-bold text-amber-600 flex-shrink-0">
                        <Star size={11} weight="fill" className="text-amber-500" />
                        <span>{restaurant.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {restaurant.address} - {restaurant.neighborhood}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1.5 font-medium">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock size={12} />
                        {restaurant.deliveryTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Motorcycle size={12} />
                        {restaurant.deliveryFee === 0 ? 'Grátis' : formatCurrency(restaurant.deliveryFee)}
                      </span>
                    </div>
                  </div>

                  {/* Botão Ver Menu */}
                  <Link
                    to={`/restaurant/${restaurant.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-base group-hover:text-white flex items-center justify-center text-gray-400 transition-colors flex-shrink-0"
                    title="Acessar cardápio do restaurante"
                  >
                    <CaretRight size={15} weight="bold" />
                  </Link>
                </div>
              )
            })
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* LADO DIREITO: MAPA INTERATIVO MAPBOX/MAPLIBRE GL JS */}
      {/* ========================================================================= */}
      <main className="flex-1 h-full relative overflow-hidden">
        <RestaurantMap
          restaurants={restaurants}
          initialSelectedId={selectedRestaurant?.id}
          onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
        />
      </main>
    </div>
  )
}
