import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  PaperPlaneTilt,
  ForkKnife,
  Storefront,
  WifiHigh,
  BatteryFull,
  CellSignalFull,
  ShoppingBag,
} from '@phosphor-icons/react'
import { RestaurantBadge } from '@/components/common/RestaurantBadge'
import { ItemCard } from '@/components/cards/ItemCard'
import { Tag } from '@/components/ui/Tag'
import { apiService } from '@/lib/supabase'
import { Restaurant, MenuItem } from '@/types'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'

export const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') === 'menu' ? 'menu' : 'details'

  const { totalCount, subtotal } = useCart()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
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

  const menuCategories = ['todos', ...Array.from(new Set(menuItems.map((m) => m.category)))]
  const filteredItems =
    selectedCategory === 'todos'
      ? menuItems
      : menuItems.filter((m) => m.category === selectedCategory)

  // Split description paragraphs
  const descriptionParagraphs = restaurant.description
    ? restaurant.description.split('\n\n')
    : []

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center selection:bg-red-base/20 selection:text-red-base">
      {/* Mobile App Container matching the Figma screen frame */}
      <div className="w-full max-w-[440px] min-h-screen bg-white sm:shadow-2xl sm:my-4 sm:rounded-[40px] overflow-hidden flex flex-col relative border-0 sm:border sm:border-gray-200/80">
        
        {/* ========================================================================= */}
        {/* HERO IMAGE BANNER & NATIVE TOP BAR */}
        {/* ========================================================================= */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-200 select-none">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

          {/* Status Bar simulation (9:41, icons) */}
          <div className="absolute top-3 left-6 right-6 flex items-center justify-between text-white text-[13px] font-semibold z-20">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 opacity-90">
              <CellSignalFull size={15} weight="fill" />
              <WifiHigh size={15} weight="bold" />
              <BatteryFull size={18} weight="fill" />
            </div>
          </div>

          {/* Circular Back Button (Icon Button Secondary) */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-11 left-5 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-red-base hover:bg-white shadow-md active:scale-95 transition-all"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} weight="bold" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* WHITE CONTAINER COM CANTOS ARREDONDADOS E BADGE SOBREPOSTO */}
        {/* ========================================================================= */}
        <main className="flex-1 bg-white -mt-6 rounded-t-[32px] px-6 pt-11 pb-10 relative z-10 flex flex-col">
          {/* Restaurant Badge floating over the banner edge */}
          <div className="absolute -top-10 left-6 z-20">
            <div className="p-0.5 bg-white rounded-2xl shadow-md">
              <RestaurantBadge
                name={restaurant.name}
                slug={restaurant.id}
                size="lg"
                className="w-16 h-16 sm:w-18 sm:h-18"
              />
            </div>
          </div>

          {/* TAB 1: DETAILS (Figma Spec idêntico) */}
          {activeTab === 'details' && (
            <div className="flex-1 flex flex-col">
              {/* Restaurant Name */}
              <h1 className="text-[22px] font-bold text-gray-600 leading-tight tracking-tight">
                {restaurant.name}
              </h1>

              {/* Description Paragraphs */}
              <div className="mt-3 text-body-sm text-gray-500 space-y-3 leading-relaxed">
                {descriptionParagraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* ===================================================================== */}
              {/* MINI MAPA COM LOCALIZAÇÃO E BOTÕES DE AÇÃO */}
              {/* ===================================================================== */}
              <div className="mt-6 rounded-[24px] overflow-hidden border border-gray-200/90 shadow-sm relative h-[310px] bg-[#ECEAE4] flex flex-col justify-end">
                {/* SVG do Mapa focado no restaurante */}
                <svg
                  viewBox="0 0 380 320"
                  className="w-full h-full object-cover absolute inset-0 pointer-events-none"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect width="380" height="320" fill="#EAE8E1" />

                  {/* Área verde / parque */}
                  <path
                    d="M200 160 C240 140 320 150 330 200 C320 240 250 240 210 210 Z"
                    fill="#C8E4B5"
                    opacity="0.9"
                  />
                  {/* Lago em azul */}
                  <path
                    d="M210 170 C240 165 290 175 295 190 C270 205 230 195 210 170 Z"
                    fill="#7CD0F5"
                  />
                  <path
                    d="M300 200 C325 210 340 230 335 245 C310 245 300 220 300 200 Z"
                    fill="#7CD0F5"
                  />

                  {/* Malha de ruas locais */}
                  <g stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M-20 230 L140 180 L220 160 L380 140" strokeWidth="12" fill="none" />
                    <path d="M140 180 L180 130 L240 80 L300 -20" strokeWidth="10" fill="none" />
                    <path d="M20 130 L120 145 L180 165 L260 190 L380 210" strokeWidth="8" fill="none" />
                    <path d="M70 20 L90 140 L110 230 L90 320" strokeWidth="6" fill="none" />
                    <path d="M160 170 L210 210 L250 250 L270 320" strokeWidth="6" fill="none" />
                    <path d="M280 150 L340 180 L360 250" strokeWidth="5" fill="none" />
                    <path d="M30 280 L120 270 L180 290" strokeWidth="4" fill="none" />
                  </g>

                  {/* Pista ampla no sudoeste */}
                  <path d="M30 230 L160 175" stroke="#D8DCE4" strokeWidth="18" strokeLinecap="round" fill="none" />
                  <path d="M30 230 L160 175" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="8 6" fill="none" />
                </svg>

                {/* Marcador do Restaurante (Pino Vermelho com Storefront) */}
                <div className="absolute top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-9 h-9 rounded-xl bg-red-base text-white border-2 border-white flex items-center justify-center shadow-lg ring-4 ring-red-base/20 animate-bounce">
                    <Storefront size={20} weight="fill" />
                  </div>
                </div>

                {/* Card Flutuante com Endereço e Botões de Ação */}
                <div className="relative z-20 m-3 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-gray-200/80">
                  {/* Linhas de Endereço */}
                  <h4 className="text-body-sm font-semibold text-gray-600">
                    {restaurant.address}
                  </h4>
                  <p className="text-body-xs text-gray-400 mt-0.5">
                    {restaurant.neighborhood}, {restaurant.city}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1.5">
                    A 1,2KM • ATÉ 30 MIN
                  </p>

                  {/* Botões Traçar Rota & Ver Cardápio */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${restaurant.name} ${restaurant.address} ${restaurant.neighborhood} ${restaurant.city}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full border border-gray-200/90 text-label-xs font-semibold transition-colors active:scale-95"
                    >
                      <PaperPlaneTilt size={16} weight="bold" />
                      <span>TRAÇAR ROTA</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => navigate(`/restaurant/${restaurant.id}/menu`)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 hover:bg-red-50 text-red-base rounded-full border border-gray-200/90 text-label-xs font-semibold transition-colors active:scale-95"
                    >
                      <ForkKnife size={16} weight="bold" />
                      <span>VER CARDÁPIO</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MENU (Ao clicar em "VER CARDÁPIO") */}
          {activeTab === 'menu' && (
            <div className="flex-1 flex flex-col space-y-5 animate-fadeIn">
              {/* Header do Cardápio com Botão para voltar aos Detalhes */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-title-lg font-bold text-gray-600">Cardápio</h2>
                  <p className="text-body-xs text-gray-400">
                    {menuItems.length} opções deliciosas disponíveis
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSearchParams({ tab: 'details' })}
                  className="text-label-xs font-semibold text-gray-500 hover:text-red-base px-3 py-1.5 bg-gray-100 rounded-full transition-colors"
                >
                  Ver Detalhes
                </button>
              </div>

              {/* Categorias */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {menuCategories.map((cat) => (
                  <Tag
                    key={cat}
                    label={cat === 'todos' ? 'Todos' : cat}
                    selected={selectedCategory === cat}
                    onClick={() => setSelectedCategory(cat)}
                  />
                ))}
              </div>

              {/* Lista de Itens do Cardápio */}
              <div className="space-y-3 pb-24">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Floating Bottom Cart Bar */}
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
    </div>
  )
}
