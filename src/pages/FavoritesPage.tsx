import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Trash, ArrowLeft, Storefront } from '@phosphor-icons/react'
import { DesktopNavbar } from '@/components/layout/DesktopNavbar'
import { DesktopFooter } from '@/components/layout/DesktopFooter'
import { DesktopRestaurantCard } from '@/components/cards/DesktopRestaurantCard'
import { TabBar } from '@/components/layout/TabBar'
import { RestaurantCard } from '@/components/cards/RestaurantCard'
import { DeliveryAddressModal } from '@/components/modals/DeliveryAddressModal'
import { useFavorites } from '@/context/FavoritesContext'
import { apiService } from '@/lib/supabase'
import { Restaurant } from '@/types'

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate()
  const { favorites, removeFavorite } = useFavorites()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [currentAddress, setCurrentAddress] = useState<string>(() => {
    return localStorage.getItem('achou_food_delivery_address') || 'Av. das Estrelas, 567 - Canela, RS'
  })
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-red-base/20 selection:text-red-base">
      {/* ========================================================================= */}
      {/* 1. VERSÃO DESKTOP (MD E SUPERIORES) - GRADE COMPLETA DE FAVORITOS */}
      {/* ========================================================================= */}
      <div className="hidden md:flex flex-col min-h-screen w-full">
        <DesktopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentAddress={currentAddress}
          onOpenAddressModal={() => setIsAddressModalOpen(true)}
          showViewToggle={false}
        />

        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full flex-1 flex flex-col">
          <div className="flex items-center justify-between pb-6 border-b border-gray-200/80 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-base/10 text-red-base flex items-center justify-center">
                  <Heart size={24} weight="fill" />
                </div>
                <span>Restaurantes Favoritos</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {restaurants.length} {restaurants.length === 1 ? 'local salvo' : 'locais salvos'} em Canela
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-base hover:bg-red-dark text-white text-xs font-bold rounded-full transition-colors shadow-sm"
            >
              <Storefront size={16} weight="bold" />
              <span>Explorar Mais</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm animate-pulse h-72"
                />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center max-w-lg mx-auto shadow-xs my-8">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-base flex items-center justify-center mx-auto mb-4">
                <Heart size={32} weight="fill" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Nenhum restaurante salvo ainda
              </h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Clique no coração nos restaurantes que você mais gosta para encontrá-los facilmente aqui.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-base hover:bg-red-dark text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95"
              >
                <Storefront size={18} weight="bold" />
                <span>Explorar Restaurantes</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants.map((restaurant) => (
                <DesktopRestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                />
              ))}
            </div>
          )}
        </main>

        <DesktopFooter />
      </div>

      {/* ========================================================================= */}
      {/* 2. VERSÃO MOBILE (DISPOSITIVOS MÓVEIS < MD) - DESIGN ESPECÍFICO MOBILE */}
      {/* ========================================================================= */}
      <div className="md:hidden min-h-screen bg-gray-50 flex flex-col relative pb-28">
        <header className="bg-white border-b border-gray-200/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
            >
              <ArrowLeft size={18} weight="bold" />
            </button>
            <h1 className="text-base font-bold text-gray-800">Favoritos</h1>
          </div>

          {restaurants.length > 0 && (
            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              className="text-xs font-semibold text-red-base"
            >
              {isEditMode ? 'Concluir' : 'Editar'}
            </button>
          )}
        </header>

        <main className="p-4 space-y-3 flex-1">
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
            <div className="py-16 text-center bg-white rounded-2xl border border-gray-200 p-8 mt-4">
              <Heart size={42} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold text-gray-600">
                Nenhum restaurante salvo ainda
              </p>
              <Link
                to="/"
                className="mt-4 inline-block px-5 py-2 bg-red-base text-white text-xs font-semibold rounded-full"
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

      <DeliveryAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        currentAddress={currentAddress}
        onSelectAddress={(newAddress) => {
          setCurrentAddress(newAddress)
          localStorage.setItem('achou_food_delivery_address', newAddress)
        }}
      />
    </div>
  )
}
