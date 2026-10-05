import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  PaperPlaneTilt,
  ForkKnife,
  Storefront,
  ShoppingBag,
  Star,
  Clock,
  Motorcycle,
  Heart,
  MapPin,
} from '@phosphor-icons/react'
import { RestaurantBadge } from '@/components/common/RestaurantBadge'
import { ItemCard } from '@/components/cards/ItemCard'
import { Tag } from '@/components/ui/Tag'
import { DesktopNavbar } from '@/components/layout/DesktopNavbar'
import { DesktopFooter } from '@/components/layout/DesktopFooter'
import { DeliveryAddressModal } from '@/components/modals/DeliveryAddressModal'
import { apiService } from '@/lib/supabase'
import { Restaurant, MenuItem } from '@/types'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoritesContext'
import { formatCurrency } from '@/lib/utils'

export const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') === 'menu' ? 'menu' : 'details'

  const { totalCount, subtotal } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
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

  const menuCategories = ['todos', ...Array.from(new Set(menuItems.map((m) => m.category)))]
  const filteredItems =
    selectedCategory === 'todos'
      ? menuItems
      : menuItems.filter((m) => m.category === selectedCategory)

  const descriptionParagraphs = restaurant.description
    ? restaurant.description.split('\n\n')
    : []

  const favorited = isFavorite(restaurant.id)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-red-base/20 selection:text-red-base">
      {/* ========================================================================= */}
      {/* 1. VERSÃO DESKTOP (MD E SUPERIORES) - SEM MOLDURA DE CELULAR */}
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
          {/* Banner Hero do Restaurante */}
          <div className="relative h-72 lg:h-80 w-full rounded-3xl overflow-hidden bg-gray-200 shadow-md">
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

            {/* Botão Voltar */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="absolute top-6 left-6 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-red-base shadow-sm transition-all active:scale-95"
              title="Voltar aos restaurantes"
            >
              <ArrowLeft size={20} weight="bold" />
            </button>

            {/* Botão Favoritar no Banner */}
            <button
              type="button"
              onClick={() => toggleFavorite(restaurant.id)}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-red-base shadow-sm transition-all active:scale-95"
              title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart size={20} weight={favorited ? 'fill' : 'regular'} className={favorited ? 'text-red-base' : ''} />
            </button>

            {/* Conteúdo sobreposto na base da imagem */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-between gap-6 text-white">
              <div className="flex items-end gap-5">
                <div className="p-1 bg-white rounded-3xl shadow-xl flex-shrink-0">
                  <RestaurantBadge
                    name={restaurant.name}
                    slug={restaurant.id}
                    size="lg"
                    className="w-20 h-20"
                  />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-md">
                    {restaurant.name}
                  </h1>
                  <p className="text-sm text-white/90 mt-1 flex items-center gap-2">
                    <MapPin size={16} weight="fill" className="text-red-base" />
                    <span>{restaurant.address} • {restaurant.neighborhood}, {restaurant.city}</span>
                  </p>
                </div>
              </div>

              {/* Botão direto para cardápio */}
              <button
                type="button"
                onClick={() => navigate(`/restaurant/${restaurant.id}/menu`)}
                className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-red-base hover:bg-red-dark text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex-shrink-0"
              >
                <ForkKnife size={18} weight="bold" />
                <span>Ver Cardápio Completo</span>
              </button>
            </div>
          </div>

          {/* Barra de Informações e Métricas */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <Star size={18} weight="fill" className="text-amber-400" />
                <span className="font-extrabold text-base text-gray-800">{restaurant.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({restaurant.reviewCount || 142} avaliações)</span>
              </div>

              <div className="h-4 w-px bg-gray-200" />

              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Clock size={18} className="text-gray-400" />
                <span>{restaurant.deliveryTime}</span>
              </div>

              <div className="h-4 w-px bg-gray-200" />

              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Motorcycle size={18} className="text-gray-400" />
                <span>{restaurant.deliveryFee === 0 ? 'Frete Grátis' : formatCurrency(restaurant.deliveryFee)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${restaurant.name} ${restaurant.address} ${restaurant.neighborhood} ${restaurant.city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold transition-colors"
              >
                <PaperPlaneTilt size={15} weight="bold" />
                <span>Como Chegar</span>
              </a>

              <button
                type="button"
                onClick={() => navigate(`/restaurant/${restaurant.id}/menu`)}
                className="inline-flex sm:hidden items-center gap-1.5 px-4 py-2 bg-red-base text-white rounded-full text-xs font-bold transition-colors"
              >
                <ForkKnife size={15} weight="bold" />
                <span>Cardápio</span>
              </button>
            </div>
          </div>

          {/* Layout de Duas Colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Coluna Esquerda (7 colunas): Sobre + Destaques do Cardápio */}
            <div className="lg:col-span-7 space-y-6">
              {/* Sobre o Restaurante */}
              <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-200/80 shadow-xs">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                  Sobre {restaurant.name}
                </h2>
                <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
                  {descriptionParagraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Destaque do Cardápio */}
              <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Cardápio em Destaque
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {menuItems.length} opções disponíveis para pedir agora
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/restaurant/${restaurant.id}/menu`)}
                    className="text-xs font-bold text-red-base hover:underline"
                  >
                    Ver todos os pratos →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {menuItems.slice(0, 4).map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      restaurant={restaurant}
                    />
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <button
                    type="button"
                    onClick={() => navigate(`/restaurant/${restaurant.id}/menu`)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-red-50 text-red-base rounded-full font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <ForkKnife size={16} weight="bold" />
                    <span>Abrir Cardápio Completo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Coluna Direita (5 colunas): Localização & Mapa */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                  Localização e Contato
                </h3>

                {/* Mini Mapa Ilustrativo */}
                <div className="rounded-2xl overflow-hidden border border-gray-200 h-52 relative bg-[#ECEAE4] mb-4">
                  <svg
                    viewBox="0 0 380 320"
                    className="w-full h-full object-cover absolute inset-0 pointer-events-none"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <rect width="380" height="320" fill="#EAE8E1" />
                    <path d="M200 160 C240 140 320 150 330 200 C320 240 250 240 210 210 Z" fill="#C8E4B5" opacity="0.9" />
                    <path d="M210 170 C240 165 290 175 295 190 C270 205 230 195 210 170 Z" fill="#7CD0F5" />
                    <path d="M0 80 L380 120 M80 0 L120 320 M0 220 L380 200" stroke="#FFFFFF" strokeWidth="8" />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-2xl bg-red-base text-white border-2 border-white flex items-center justify-center shadow-lg ring-4 ring-red-base/20 animate-bounce">
                      <Storefront size={22} weight="fill" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Endereço</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{restaurant.address}</p>
                    <p className="text-xs text-gray-500">{restaurant.neighborhood}, {restaurant.city}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Distância Estimada</span>
                    <p className="font-semibold text-gray-800 mt-0.5">Aproximadamente 1,2 km da Av. das Estrelas</p>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${restaurant.name} ${restaurant.address} ${restaurant.neighborhood} ${restaurant.city}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <PaperPlaneTilt size={16} weight="bold" />
                    <span>Traçar Rota no Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        <DesktopFooter />
      </div>

      {/* ========================================================================= */}
      {/* 2. VERSÃO MOBILE (DISPOSITIVOS MÓVEIS < MD) - DESIGN ESPECÍFICO MOBILE */}
      {/* ========================================================================= */}
      <div className="md:hidden w-full min-h-screen bg-white flex flex-col relative">
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-200 select-none">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-5 left-5 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-red-base hover:bg-white shadow-md active:scale-95 transition-all"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} weight="bold" />
          </button>
        </div>

        <main className="flex-1 bg-white -mt-6 rounded-t-[32px] px-6 pt-11 pb-10 relative z-10 flex flex-col">
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

          {activeTab === 'details' && (
            <div className="flex-1 flex flex-col">
              <h1 className="text-[22px] font-bold text-gray-600 leading-tight tracking-tight">
                {restaurant.name}
              </h1>

              <div className="mt-3 text-body-sm text-gray-500 space-y-3 leading-relaxed">
                {descriptionParagraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-6 rounded-[24px] overflow-hidden border border-gray-200/90 shadow-sm relative h-[310px] bg-[#ECEAE4] flex flex-col justify-end">
                <svg
                  viewBox="0 0 380 320"
                  className="w-full h-full object-cover absolute inset-0 pointer-events-none"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect width="380" height="320" fill="#EAE8E1" />
                  <path d="M200 160 C240 140 320 150 330 200 C320 240 250 240 210 210 Z" fill="#C8E4B5" opacity="0.9" />
                  <path d="M210 170 C240 165 290 175 295 190 C270 205 230 195 210 170 Z" fill="#7CD0F5" />
                  <path d="M300 200 C325 210 340 230 335 245 C310 245 300 220 300 200 Z" fill="#7CD0F5" />
                  <path d="M0 80 L380 120 M80 0 L120 320 M0 220 L380 200" stroke="#FFFFFF" strokeWidth="8" />
                  <path d="M80 80 Q140 120 190 170" stroke="#8F141F" strokeWidth="4" strokeDasharray="6 6" fill="none" />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-12">
                  <div className="w-9 h-9 rounded-xl bg-red-base text-white border-2 border-white flex items-center justify-center shadow-lg ring-4 ring-red-base/20 animate-bounce">
                    <Storefront size={20} weight="fill" />
                  </div>
                </div>

                <div className="relative z-20 m-3 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-gray-200/80">
                  <h4 className="text-body-sm font-semibold text-gray-600">
                    {restaurant.address}
                  </h4>
                  <p className="text-body-xs text-gray-400 mt-0.5">
                    {restaurant.neighborhood}, {restaurant.city}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1.5">
                    A 1,2KM • ATÉ 30 MIN
                  </p>

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

          {activeTab === 'menu' && (
            <div className="flex-1 flex flex-col space-y-5 animate-fadeIn">
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
