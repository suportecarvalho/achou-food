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
} from '@phosphor-icons/react'
import { RestaurantBadge } from '@/components/common/RestaurantBadge'
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
  const [selectedCategory, setSelectedCategory] = useState<string>('CUPCAKES')
  const [loading, setLoading] = useState(true)

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-base border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <p className="text-title-lg font-bold text-gray-600">Restaurante não encontrado</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2.5 bg-red-base text-white text-label-xs font-semibold rounded-full hover:bg-red-dark transition-colors"
        >
          Voltar ao Início
        </button>
      </div>
    )
  }

  // Predefined filter tags matching the screenshot
  const categories = ['CUPCAKES', 'BOLOS E TORTAS', 'DOCINHOS', 'BEBIDAS QUENTES']

  // Group items by category
  const cupcakesItems = menuItems.filter((m) => m.category.toLowerCase().includes('cupcake'))
  const cakesItems = menuItems.filter((m) => m.category.toLowerCase().includes('bolo') || m.category.toLowerCase().includes('torta'))
  const otherItems = menuItems.filter(
    (m) =>
      !m.category.toLowerCase().includes('cupcake') &&
      !m.category.toLowerCase().includes('bolo') &&
      !m.category.toLowerCase().includes('torta')
  )

  const handleAddItem = (item: MenuItem) => {
    if (restaurant) {
      addItem(item, restaurant)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center selection:bg-red-base/20 selection:text-red-base">
      {/* Mobile App Container matching the Figma Screen */}
      <div className="w-full max-w-[440px] min-h-screen bg-white sm:shadow-2xl sm:my-4 sm:rounded-[40px] overflow-hidden flex flex-col relative border-0 sm:border sm:border-gray-200/80">
        
        {/* ========================================================================= */}
        {/* TOP HEADER: STATUS BAR + RESTAURANT BRAND (Figma Spec) */}
        {/* ========================================================================= */}
        <header className="bg-[#F4F4F6] text-gray-600 pt-3 pb-6 px-5 relative select-none">
          {/* Status Bar simulation (9:41, icons) */}
          <div className="flex items-center justify-between text-gray-800 text-[13px] font-semibold mb-3 px-1">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 opacity-90">
              <CellSignalFull size={15} weight="fill" />
              <WifiHigh size={15} weight="bold" />
              <BatteryFull size={18} weight="fill" />
            </div>
          </div>

          {/* Header Row: Back Button + Restaurant Info */}
          <div className="flex items-center gap-3 mt-1">
            {/* Circular Back Button (Icon Button Secondary) */}
            <button
              type="button"
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-red-base shadow-sm border border-gray-200/60 active:scale-95 transition-all flex-shrink-0"
              aria-label="Voltar para detalhes do restaurante"
              title="Voltar para detalhes"
            >
              <ArrowLeft size={18} weight="bold" />
            </button>

            {/* Restaurant Badge Small */}
            <RestaurantBadge
              name={restaurant.name}
              slug={restaurant.id}
              size="sm"
              className="w-10 h-10 rounded-xl flex-shrink-0"
            />

            {/* Text details */}
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

        {/* ========================================================================= */}
        {/* WHITE CONTAINER COM CATEGORIAS E ITENS (Card Overlay) */}
        {/* ========================================================================= */}
        <main className="flex-1 bg-white -mt-3 rounded-t-[32px] px-5 pt-5 pb-32 relative z-10 shadow-sm flex flex-col">
          {/* Horizontal Category Tags */}
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

          {/* ===================================================================== */}
          {/* SECTION 1: CUPCAKES */}
          {/* ===================================================================== */}
          {(selectedCategory === 'CUPCAKES' || selectedCategory === 'TODOS') && cupcakesItems.length > 0 && (
            <div className="mt-5">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-red-dark select-none mb-2">
                CUPCAKES
              </h2>

              <div className="divide-y divide-gray-100">
                {cupcakesItems.map((item) => {
                  const qty = getItemQuantity(item.id)
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3.5 py-3.5 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Imagem do Cupcake */}
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        {/* Nome e Preço */}
                        <div className="min-w-0">
                          <h3 className="text-body-sm sm:text-title-sm font-semibold text-gray-600 truncate">
                            {item.name}
                          </h3>
                          <p className="text-title-sm font-semibold text-gray-500 mt-1">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Botão de Adicionar / Quantidade */}
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
            </div>
          )}

          {/* ===================================================================== */}
          {/* SECTION 2: BOLOS E TORTAS */}
          {/* ===================================================================== */}
          {(selectedCategory === 'BOLOS E TORTAS' || selectedCategory === 'TODOS' || selectedCategory === 'CUPCAKES') && cakesItems.length > 0 && (
            <div className="mt-6">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-red-dark select-none mb-2">
                BOLOS E TORTAS
              </h2>

              <div className="divide-y divide-gray-100">
                {cakesItems.map((item) => {
                  const qty = getItemQuantity(item.id)
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3.5 py-3.5 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Imagem do Bolo / Torta */}
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        {/* Nome e Preço */}
                        <div className="min-w-0">
                          <h3 className="text-body-sm sm:text-title-sm font-semibold text-gray-600 truncate">
                            {item.name}
                          </h3>
                          <p className="text-title-sm font-semibold text-gray-500 mt-1">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Botão de Adicionar / Quantidade */}
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
            </div>
          )}

          {/* Outros itens se houver */}
          {otherItems.length > 0 && selectedCategory !== 'CUPCAKES' && selectedCategory !== 'BOLOS E TORTAS' && (
            <div className="mt-6">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-red-dark select-none mb-2">
                {selectedCategory}
              </h2>
              <div className="divide-y divide-gray-100">
                {otherItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3.5 py-3.5">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-body-sm font-semibold text-gray-600 truncate">{item.name}</h3>
                        <p className="text-title-sm font-semibold text-gray-500 mt-1">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddItem(item)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-red-base hover:bg-red-50"
                    >
                      <Plus size={16} weight="bold" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* ========================================================================= */}
        {/* BARRA FLUTUANTE INFERIOR "VER PEDIDO" (Figma Spec) */}
        {/* ========================================================================= */}
        <div className="absolute bottom-5 left-4 right-4 z-40 animate-slideUp">
          <div className="bg-white/95 backdrop-blur-md rounded-[24px] p-3.5 shadow-tab-bar border border-gray-200/80 flex items-center justify-between">
            {/* Total e Quantidade de Itens */}
            <div>
              <span className="block text-[11px] font-semibold tracking-wider uppercase text-gray-400 leading-none mb-1">
                {totalCount > 0 ? `${totalCount} ${totalCount === 1 ? 'ITEM' : 'ITENS'}` : '3 ITENS'}
              </span>
              <p className="text-[17px] font-bold text-gray-600 leading-none">
                {totalCount > 0 ? formatCurrency(subtotal) : 'R$ 37,00'}
              </p>
            </div>

            {/* Botão Ver Pedido */}
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/90 hover:bg-gray-200 text-gray-600 rounded-full border border-gray-200/90 text-label-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <ClipboardText size={16} weight="bold" className="text-gray-500" />
              <span>VER PEDIDO</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
