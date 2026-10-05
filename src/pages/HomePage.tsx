import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  MapPin,
  MagnifyingGlass,
  Funnel,
  Sparkle,
} from '@phosphor-icons/react'
import { TabBar } from '@/components/layout/TabBar'
import { ToggleList, ViewMode } from '@/components/ui/ToggleList'
import { RestaurantBadge } from '@/components/common/RestaurantBadge'
import { RestaurantMap } from '@/components/map/RestaurantMap'
import { DeliveryAddressModal } from '@/components/modals/DeliveryAddressModal'
import { DesktopNavbar } from '@/components/layout/DesktopNavbar'
import { DesktopHomeHero } from '@/components/home/DesktopHomeHero'
import { DesktopRestaurantCard } from '@/components/cards/DesktopRestaurantCard'
import { DesktopMapSplitView } from '@/components/map/DesktopMapSplitView'
import { DesktopFooter } from '@/components/layout/DesktopFooter'
import { apiService } from '@/lib/supabase'
import { Restaurant } from '@/types'

export const HomePage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const isMapRoute = location.pathname === '/map' || searchParams.get('view') === 'map'
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
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

  // Filtro conjunto de Busca Textual e Categoria
  const filteredRestaurants = restaurants.filter((r) => {
    // 1. Filtro de Categoria
    if (selectedCategory !== 'todos') {
      const cat = (r.categoryId || '').toLowerCase()
      const name = r.name.toLowerCase()
      const desc = (r.description || '').toLowerCase()

      const matchCategory =
        (selectedCategory === 'sobremesas' && (cat.includes('sobremesa') || cat.includes('doce') || name.includes('doce') || desc.includes('doce'))) ||
        (selectedCategory === 'cafes' && (cat.includes('cafe') || cat.includes('padaria') || name.includes('cafe') || name.includes('bistrô'))) ||
        (selectedCategory === 'hamburgueres' && (cat.includes('hamburguer') || cat.includes('lanche') || name.includes('hamburger'))) ||
        (selectedCategory === 'refeicoes' && (cat.includes('refeicao') || cat.includes('almoco') || name.includes('sabor & arte') || name.includes('veg'))) ||
        (selectedCategory === 'bebidas' && (cat.includes('bebida') || cat.includes('fruta') || name.includes('tropical'))) ||
        cat.includes(selectedCategory)

      if (!matchCategory) return false
    }

    // 2. Filtro de Busca Textual
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      r.name.toLowerCase().includes(query) ||
      r.address.toLowerCase().includes(query) ||
      r.neighborhood.toLowerCase().includes(query) ||
      (r.description && r.description.toLowerCase().includes(query))
    )
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-red-base/20 selection:text-red-base">
      {/* ========================================================================= */}
      {/* 1. VERSÃO DESKTOP (MD E SUPERIORES) - EXPERIÊNCIA WEB TOTALMENTE RESPONSIVA */}
      {/* ========================================================================= */}
      <div className="hidden md:flex flex-col min-h-screen w-full">
        {/* Navbar Desktop Superior */}
        <DesktopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onToggleView={handleToggleView}
          currentAddress={currentAddress}
          onOpenAddressModal={() => setIsAddressModalOpen(true)}
          showViewToggle={true}
        />

        {/* MODO LISTA NO DESKTOP: GRID MODERNA DE MÚLTIPLAS COLUNAS */}
        {viewMode === 'list' && (
          <div className="flex-1 flex flex-col w-full">
            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full flex-1 flex flex-col gap-8">
              {/* Hero Banner com Gradiente e Categorias */}
              <DesktopHomeHero
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                totalRestaurants={filteredRestaurants.length}
              />

              {/* Barra de Status da Listagem e Controles */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-200/80">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                      Restaurantes em Destaque
                    </h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-base/10 text-red-base">
                      {filteredRestaurants.length} disponíveis
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Locais abertos com entrega em Canela - RS
                  </p>
                </div>

                {/* Alternador Lista / Mapa visível também acima dos cards */}
                <div className="flex items-center gap-3">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs font-semibold text-red-base hover:underline"
                    >
                      Limpar filtro de busca
                    </button>
                  )}
                  <ToggleList value={viewMode} onChange={handleToggleView} />
                </div>
              </div>

              {/* Grid Responsiva em Múltiplas Colunas (2 a 4 colunas) */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div
                      key={n}
                      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm animate-pulse"
                    >
                      <div className="h-48 bg-gray-200 w-full" />
                      <div className="p-5 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-2/3" />
                        <div className="h-4 bg-gray-100 rounded w-full" />
                        <div className="h-3 bg-gray-100 rounded w-1/2 pt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredRestaurants.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-gray-200/80 p-8 shadow-xs">
                  <div className="w-16 h-16 bg-red-base/10 text-red-base rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MagnifyingGlass size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Nenhum restaurante encontrado
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
                    Não encontramos resultados para sua pesquisa ou categoria selecionada.
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory('todos')
                      }}
                      className="px-5 py-2.5 bg-red-base text-white text-xs font-bold rounded-full hover:bg-red-dark transition-colors shadow-sm"
                    >
                      Limpar todos os filtros
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  {filteredRestaurants.map((restaurant) => (
                    <DesktopRestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                    />
                  ))}
                </div>
              )}
            </main>

            {/* Rodapé Desktop */}
            <DesktopFooter />
          </div>
        )}

        {/* MODO MAPA NO DESKTOP: SPLIT VIEW MODERNA COM LISTA LATERAL E MAPA EM TELA CHEIA */}
        {viewMode === 'map' && (
          <DesktopMapSplitView
            restaurants={filteredRestaurants}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSwitchToList={() => handleToggleView('list')}
          />
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. VERSÃO MOBILE (DISPOSITIVOS MÓVEIS < MD) - DESIGN ESPECÍFICO MOBILE */}
      {/* ========================================================================= */}
      <div className={`md:hidden w-full bg-white relative ${viewMode === 'map' ? 'min-h-screen flex flex-col' : ''}`}>
        {/* Header Vermelho do App */}
        <header className="bg-red-base text-white pt-4 pb-8 px-5 relative select-none z-20">

          {/* Delivery Location Block - Clicável */}
          <button
            type="button"
            onClick={() => setIsAddressModalOpen(true)}
            className="w-full flex items-center gap-3 mt-1 text-left cursor-pointer group hover:bg-white/10 p-1.5 -ml-1.5 rounded-2xl transition-all active:scale-[0.98] focus:outline-none"
            title="Alterar endereço de entrega"
          >
            <div className="w-10 h-10 rounded-xl bg-red-dark group-hover:bg-[#6E0E17] flex items-center justify-center text-white flex-shrink-0 shadow-inner transition-colors">
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

        {/* MOBILE VIEW 1: HOME - LIST VIEW */}
        {viewMode === 'list' && (
          <main className="bg-white -mt-3 rounded-t-[36px] px-5 pt-7 pb-14 relative z-10 shadow-sm flex flex-col">
            {/* Search Bar + ToggleList Row */}
            <div className="flex items-center gap-2.5">
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

              <ToggleList value={viewMode} onChange={handleToggleView} />
            </div>

            <div className="mt-5 flex flex-col">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-red-base select-none mb-1">
                RESTAURANTES PERTO DE VOCÊ
              </h2>

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
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('todos')
                    }}
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
                      <RestaurantBadge
                        name={restaurant.name}
                        slug={restaurant.id}
                        size="md"
                      />

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

        {/* MOBILE VIEW 2: HOME - MAP VIEW */}
        {viewMode === 'map' && (
          <main className="flex-1 bg-white -mt-3 rounded-t-[36px] relative z-10 shadow-sm overflow-hidden flex flex-col">
            <div className="absolute top-6 left-5 right-5 z-40 flex items-center gap-2.5">
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

              <ToggleList value={viewMode} onChange={handleToggleView} />
            </div>

            <RestaurantMap restaurants={filteredRestaurants} />
          </main>
        )}

        {/* TabBar Móvel Inferior (apenas mobile) */}
        <TabBar />
      </div>

      {/* Modal de Seleção de Endereço / Localização (Compartilhado Mobile & Desktop) */}
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
