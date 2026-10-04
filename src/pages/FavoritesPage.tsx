import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash, ArrowLeft, SlidersHorizontal } from '@phosphor-icons/react'
import { Header } from '@/components/layout/Header'
import { TabBar } from '@/components/layout/TabBar'
import { RestaurantCard } from '@/components/cards/RestaurantCard'
import { Button } from '@/components/ui/Button'
import { useFavorites } from '@/context/FavoritesContext'
import { apiService } from '@/lib/supabase'
import { Restaurant } from '@/types'

export const FavoritesPage: React.FC = () => {
  const { favorites, removeFavorite } = useFavorites()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    async function loadFavorites() {
      try {
        const all = await apiService.getRestaurants()
        const favs = all.filter((r) => favorites.includes(r.id))
        setRestaurants(favs)
      } finally {
        setLoading(false)
      }
    }
    loadFavorites()
  }, [favorites])

  return (
    <div className="min-h-screen bg-gray-100 pb-28">
      <Header showSearch={false} />

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-title-lg font-bold text-gray-600">Restaurantes Favoritos</h1>
            <p className="text-body-xs text-gray-400">
              {restaurants.length} {restaurants.length === 1 ? 'salvo' : 'salvos'} em sua conta
            </p>
          </div>

          {restaurants.length > 0 && (
            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3 py-1.5 rounded-full text-label-xs font-semibold border transition-all ${
                isEditMode
                  ? 'bg-red-base text-white border-red-base shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:text-gray-700'
              }`}
            >
              {isEditMode ? 'Concluir' : 'Gerenciar (Remover)'}
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse h-28"
              />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-gray-200 p-8">
            <Heart size={42} className="mx-auto text-gray-300 mb-2" />
            <p className="text-title-md font-semibold text-gray-600">
              Nenhum restaurante salvo ainda
            </p>
            <p className="text-body-sm text-gray-400 mt-1 max-w-sm mx-auto">
              Toque no ícone de coração nos restaurantes para salvá-los e encontrá-los facilmente aqui.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block px-5 py-2.5 bg-red-base text-white text-label-xs font-semibold rounded-full hover:bg-red-dark transition-colors"
            >
              Explorar Restaurantes
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                variant={isEditMode ? 'removable' : 'default'}
                showRemoveButton={isEditMode}
                onRemove={() => removeFavorite(restaurant.id)}
              />
            ))}
          </div>
        )}
      </main>

      <TabBar />
    </div>
  )
}
