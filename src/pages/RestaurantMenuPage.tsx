import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ClipboardText,
  Plus,
  Minus,
  WifiHigh,
  BatteryFull,
  CellSignalFull,
  ShoppingBag,
  ForkKnife,
} from '@phosphor-icons/react'
import { RestaurantBadge } from '@/components/common/RestaurantBadge'
import { DesktopNavbar } from '@/components/layout/DesktopNavbar'
import { DesktopFooter } from '@/components/layout/DesktopFooter'
import { DeliveryAddressModal } from '@/components/modals/DeliveryAddressModal'
import { apiService } from '@/lib/supabase'
import { Restaurant, MenuItem } from '@/types'
import { useCart } from '@/context/CartContext'
import { formatCurrency, cn } from '@/lib/utils'

export const RestaurantMenuPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { totalCount, subtotal, getItemQuantity, addItem, updateQuantity } = useCart()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const [currentAddress, setCurrentAddress] = useState<string>(() => {
    return localStorage.getItem('achou_food_delivery_address') || 'Av. das Estrelas, 567 - Canela, RS'
  })
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (!id) return
      setLoading(true)
      try {
        const rest = await apiService.getRestaurantById(id)
        if (rest) {
          setRestaurant(rest)
          const items = await apiService.getMenuItems(rest.id)
          setMenuItems(items)
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-base border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-xl font-bold text-gray-700">Restaurante não encontrado</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2.5 bg-red-base text-white text-xs font-bold rounded-full hover:bg-red-dark transition-colors"
        >
          Voltar ao Início
        </button>
      </div>
    )
  }

  // Predefined filter tags
  const distinctCats = Array.from(new Set(menuItems.map((m) => m.category.toUpperCase())))
  const categories = ['TODOS', ...distinctCats]

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchCat =
      selectedCategory === 'TODOS' ||
      item.category.toUpperCase() === selectedCategory

    const matchQuery =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchCat && matchQuery
  })

  const handleAddItem = (item: MenuItem) => {
    if (restaurant) {
      addItem(item, restaurant)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-red-base/20 selection:text-red-base">
      {/* ========================================================================= */}
      {/* 1. VERSÃO DESKTOP (MD E SUPERIORES) - CARDÁPIO COMPLETO EM GRADE */}
      {/* ========================================================================= */}
      <div className="hidden md:flex flex-col min-h-screen w-full">
        <DesktopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentAddress={currentAddress}
          onOpenAddressModal={() => setIsAddressModalOpen(true)}
          showViewToggle={false}
        />

        <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8 w-full flex-1 flex flex-col gap-8">
          {/* Header do Restaurante no Cardápio */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors flex-shrink-0"
                title="Voltar aos detalhes"
              >
                <ArrowLeft size={18} weight="bold" />
              </button>

              <RestaurantBadge
                name={restaurant.name}
                slug={restaurant.id}
                size="md"
              />

              <div>
                <span className="text-xs font-bold text-red-base uppercase tracking-wider block">
                  Cardápio Completo
                </span>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {restaurant.name}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {restaurant.address} • {restaurant.neighborhood}
                </p>
              </div>
            </div>

            <Link
              to={`/restaurant/${restaurant.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold transition-colors self-start sm:self-auto"
            >
              <span>Ver Detalhes do Local</span>
            </Link>
          </div>

          {/* Categorias em Pílulas */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-5 py-2.5 rounded-2xl text-xs font-bold uppercase transition-all whitespace-nowrap active:scale-95 border cursor-pointer select-none',
                    isSelected
                      ? 'bg-red-base text-white border-red-base shadow-md shadow-red-base/20'
                      : 'bg-white text-gray-600 border-gray-200/90 hover:border-red-300 hover:bg-red-50/30 hover:text-red-base shadow-xs'
                  )}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Grade de Pratos do Cardápio em 2 a 3 Colunas */}
          {filteredItems.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-gray-200/80 p-8 shadow-xs">
              <p className="text-base font-bold text-gray-700">Nenhum item encontrado nesta categoria</p>
              <button
                type="button"
                onClick={() => setSelectedCategory('TODOS')}
                className="mt-3 px-5 py-2 bg-red-base text-white rounded-full text-xs font-bold hover:bg-red-dark transition-colors"
              >
                Ver todos os itens
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const qty = getItemQuantity(item.id)

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Foto do Prato */}
                      <div className="h-44 w-full rounded-2xl overflow-hidden bg-gray-100 mb-4 shadow-inner relative">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {item.category}
                        </span>
                      </div>

                      {/* Título e Descrição */}
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-red-base transition-colors leading-snug">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Preço e Botão Adicionar */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                          Preço
                        </span>
                        <p className="text-lg font-extrabold text-red-base leading-tight">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() => handleAddItem(item)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-base hover:bg-red-dark text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
                        >
                          <Plus size={14} weight="bold" />
                          <span>Adicionar</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full shadow-xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-gray-600 hover:text-red-base hover:bg-white transition-colors active:scale-90"
                            title="Diminuir"
                          >
                            <Minus size={12} weight="bold" />
                          </button>
                          <span className="text-xs font-bold text-gray-900 min-w-4 text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-red-base hover:bg-white transition-colors active:scale-90"
                            title="Aumentar"
                          >
                            <Plus size={12} weight="bold" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Barra Flutuante de Sacola no Desktop quando totalCount > 0 */}
          {totalCount > 0 && (
            <div className="sticky bottom-6 z-30 max-w-xl mx-auto w-full animate-slideUp">
              <Link
                to="/cart"
                className="flex items-center justify-between p-4 bg-red-base hover:bg-red-dark text-white rounded-3xl shadow-xl transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white text-red-base flex items-center justify-center font-extrabold text-xs shadow-xs">
                    {totalCount}
                  </div>
                  <span className="font-bold text-base">Ver Sacola de Compras</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base">{formatCurrency(subtotal)}</span>
                  <span>→</span>
                </div>
              </Link>
            </div>
          )}
        </main>

        <DesktopFooter />
      </div>

      {/* ========================================================================= */}
      {/* 2. VERSÃO MOBILE (DISPOSITIVOS MÓVEIS < MD) - DESIGN ESPECÍFICO MOBILE */}
      {/* ========================================================================= */}
      <div className="md:hidden w-full min-h-screen bg-white flex flex-col relative">
        <header className="bg-[#F4F4F6] text-gray-600 pt-3 pb-6 px-5 relative select-none">
          <div className="flex items-center justify-between text-gray-800 text-[13px] font-semibold mb-3 px-1">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 opacity-90">
              <CellSignalFull size={15} weight="fill" />
              <WifiHigh size={15} weight="bold" />
              <BatteryFull size={18} weight="fill" />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-red-base shadow-sm border border-gray-200/60 active:scale-95 transition-all flex-shrink-0"
              aria-label="Voltar para detalhes do restaurante"
              title="Voltar para detalhes"
            >
              <ArrowLeft size={18} weight="bold" />
            </button>

            <RestaurantBadge
              name={restaurant.name}
              slug={restaurant.id}
              size="sm"
              className="w-10 h-10 rounded-xl flex-shrink-0"
            />

            <div className="min-w-0">
              <span className="block text-[10px] font-bold tracking-wider uppercase text-gray-400 leading-none mb-0.5">
                CARDÁPIO
              </span>
              <h1 className="text-[16px] font-bold text-gray-600 truncate leading-snug">
                {restaurant.name}
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-white -mt-3 rounded-t-[32px] px-5 pt-5 pb-32 relative z-10 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none py-1 select-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-4 py-2 rounded-full text-label-xs font-bold uppercase transition-all duration-200 whitespace-nowrap active:scale-95',
                    isSelected
                      ? 'bg-red-dark text-white shadow-sm'
                      : 'bg-white text-gray-500 border border-gray-200/90 hover:bg-gray-50 hover:text-gray-600'
                  )}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div className="divide-y divide-gray-100 mt-3">
            {filteredItems.map((item) => {
              const qty = getItemQuantity(item.id)
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3.5 py-3.5 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-body-sm sm:text-title-sm font-semibold text-gray-600 truncate">
                        {item.name}
                      </h3>
                      <p className="text-title-sm font-semibold text-gray-500 mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 pl-2">
                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => handleAddItem(item)}
                        className="w-8 h-8 rounded-full border border-gray-200 hover:border-red-base flex items-center justify-center text-red-base hover:bg-red-50 active:scale-95 transition-all shadow-sm"
                        aria-label={`Adicionar ${item.name}`}
                      >
                        <Plus size={16} weight="bold" />
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 border border-gray-200 rounded-full shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:text-red-base hover:bg-white transition-colors active:scale-90"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={12} weight="bold" />
                        </button>
                        <span className="text-label-xs font-bold text-gray-600 min-w-4 text-center select-none">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-red-base hover:bg-white transition-colors active:scale-90"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={12} weight="bold" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </main>

        {totalCount > 0 && (
          <div className="absolute bottom-6 left-4 right-4 z-40 animate-slideUp">
            <Link
              to="/cart"
              className="flex items-center justify-between p-3.5 bg-red-base hover:bg-red-dark text-white rounded-2xl shadow-lg transition-all active:scale-95"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-label-xs">
                  {totalCount}
                </div>
                <span className="font-semibold text-title-sm">Ver Sacola</span>
              </div>
              <span className="font-bold text-title-sm">{formatCurrency(subtotal)}</span>
            </Link>
          </div>
        )}
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
