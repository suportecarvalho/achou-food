import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  MapPin,
  MagnifyingGlass,
  WifiHigh,
  BatteryFull,
  CellSignalFull,
} from '@phosphor-icons/react'
import { TabBar } from '@/components/layout/TabBar'
import { ToggleList, ViewMode } from '@/components/ui/ToggleList'
import { RestaurantBadge } from '@/components/common/RestaurantBadge'
import { RestaurantMap } from '@/components/map/RestaurantMap'
import { DeliveryAddressModal } from '@/components/modals/DeliveryAddressModal'
import { apiService } from '@/lib/supabase'
import { Restaurant } from '@/types'

export const HomePage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const isMapRoute = location.pathname === '/map' || searchParams.get('view') === 'map'
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>(isMapRoute ? 'map' : 'list')
  const [loading, setLoading] = useState(true)

  // Delivery Address State with LocalStorage persistence
  const [currentAddress, setCurrentAddress] = useState<string>(() => {
    return localStorage.getItem('achou_food_delivery_address') || 'Av. das Estrelas, 567 - Canela, RS'
  })
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  useEffect(() => {
    setViewMode(location.pathname === '/map' ? 'map' : 'list')
  }, [location.pathname])

  useEffect(() => {
    async function loadData() {
      try {
        const rests = await apiService.getRestaurants()
        setRestaurants(rests)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleToggleView = (mode: ViewMode) => {
    setViewMode(mode)
    navigate(mode === 'map' ? '/map' : '/')
  }

  const filteredRestaurants = restaurants.filter((r) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      r.name.toLowerCase().includes(query) ||
      r.address.toLowerCase().includes(query) ||
      r.neighborhood.toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center selection:bg-red-base/20 selection:text-red-base">
      {/* Mobile App Container matching the Figma Screens */}
      <div className="w-full max-w-[440px] min-h-screen bg-white sm:shadow-2xl sm:my-4 sm:rounded-[40px] overflow-hidden flex flex-col relative border-0 sm:border sm:border-gray-200/80">
        
        {/* ========================================================================= */}
        {/* HEADER VERMELHO (Design Spec Home - List & Map) */}
        {/* ========================================================================= */}
        <header className="bg-red-base text-white pt-3 pb-8 px-6 relative select-none z-20">
          {/* Status Bar simulation (9:41, icons) */}
          <div className="flex items-center justify-between text-white text-[13px] font-semibold mb-4 px-1">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 opacity-90">
              <CellSignalFull size={15} weight="fill" />
              <WifiHigh size={15} weight="bold" />
              <BatteryFull size={18} weight="fill" />
            </div>
          </div>

          {/* Delivery Location Block - Clicável para abrir o modal de seleção de endereço */}
          <button
            type="button"
            onClick={() => setIsAddressModalOpen(true)}
            className="w-full flex items-center gap-3 mt-1 text-left cursor-pointer group hover:bg-white/10 p-1.5 -ml-1.5 rounded-2xl transition-all active:scale-[0.98] focus:outline-none"
            title="Alterar endereço de entrega"
          >
            <div className="w-10 h-10 rounded-xl bg-red-dark group-hover:bg-[#9B131D] flex items-center justify-center text-white flex-shrink-0 shadow-inner transition-colors">
              <MapPin size={22} weight="fill" />
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold tracking-wider uppercase text-white/80 leading-none mb-1">
                ENTREGA EM
              </span>
              <p className="text-[14px] sm:text-[15px] font-semibold text-white truncate leading-snug">
                {currentAddress}
              </p>
            </div>
          </button>
        </header>

        {/* ========================================================================= */}
        {/* VIEW 1: HOME - LIST VIEW */}
        {/* ========================================================================= */}
        {viewMode === 'list' && (
          <main className="flex-1 bg-white -mt-3 rounded-t-[36px] px-5 pt-7 pb-28 relative z-10 shadow-sm flex flex-col">
            {/* Search Bar + ToggleList Row com espaçamento respirável do topo */}
            <div className="flex items-center gap-2.5">
              {/* Search Input */}
              <div className="relative flex-1">
                <MagnifyingGlass
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busque por restaurantes"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-body-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-red-base focus:ring-1 focus:ring-red-base transition-all shadow-sm"
                />
              </div>

              {/* Toggle View Mode: List vs Map */}
              <ToggleList value={viewMode} onChange={handleToggleView} />
            </div>

            <div className="mt-5 flex-1 flex flex-col">
              {/* Section Header: RESTAURANTES PERTO DE VOCÊ */}
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-red-base select-none mb-1">
                RESTAURANTES PERTO DE VOCÊ
              </h2>

              {/* List of Restaurants */}
              {loading ? (
                <div className="space-y-3 pt-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className="flex items-center gap-3.5 py-3 border-b border-gray-100 animate-pulse"
                    >
                      <div className="w-14 h-14 bg-gray-200 rounded-2xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredRestaurants.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-title-sm font-semibold text-gray-600">
                    Nenhum restaurante encontrado
                  </p>
                  <p className="text-body-xs text-gray-400 mt-1">
                    Tente buscar por outro termo
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-3 px-4 py-1.5 bg-red-base text-white text-label-xs font-semibold rounded-full hover:bg-red-dark transition-colors"
                  >
                    Limpar busca
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredRestaurants.map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      to={`/restaurant/${restaurant.id}`}
                      className="group flex items-center gap-3.5 py-3 hover:bg-gray-50/80 -mx-2 px-2 rounded-2xl transition-colors"
                    >
                      {/* Stylized Vector Badge */}
                      <RestaurantBadge
                        name={restaurant.name}
                        slug={restaurant.id}
                        size="md"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-title-md font-semibold text-gray-600 group-hover:text-red-base transition-colors truncate">
                          {restaurant.name}
                        </h3>
                        <p className="text-body-xs text-gray-400 truncate mt-0.5">
                          {restaurant.address} - {restaurant.neighborhood}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </main>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: HOME - MAP VIEW (Figma Spec idêntico) */}
        {/* ========================================================================= */}
        {viewMode === 'map' && (
          <main className="flex-1 bg-white -mt-3 rounded-t-[36px] relative z-10 shadow-sm overflow-hidden flex flex-col">
            {/* Top Floating Search + Toggle Controls over the map com espaçamento top-6 */}
            <div className="absolute top-6 left-5 right-5 z-40 flex items-center gap-2.5">
              {/* Search Input Floating */}
              <div className="relative flex-1">
                <MagnifyingGlass
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busque por restaurantes"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/95 backdrop-blur-md border border-gray-200 rounded-full text-body-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-red-base focus:ring-1 focus:ring-red-base transition-all shadow-md"
                />
              </div>

              {/* Toggle View Mode: List vs Map */}
              <ToggleList value={viewMode} onChange={handleToggleView} />
            </div>

            {/* Interactive Canela RS Map with Floating Restaurant Card and Pins */}
            <RestaurantMap restaurants={filteredRestaurants} />
          </main>
        )}

        {/* Modal de Seleção de Endereço / Localização */}
        <DeliveryAddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          currentAddress={currentAddress}
          onSelectAddress={(newAddress) => {
            setCurrentAddress(newAddress)
            localStorage.setItem('achou_food_delivery_address', newAddress)
          }}
        />

        {/* Floating Bottom TabBar with Home & Order */}
        <TabBar />
      </div>
    </div>
  )
}
