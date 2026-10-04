import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Star, Clock, MapPin, Heart, ShoppingBag } from '@phosphor-icons/react'
import { Header } from '@/components/layout/Header'
import { TabBar } from '@/components/layout/TabBar'
import { ItemCard } from '@/components/cards/ItemCard'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { apiService } from '@/lib/supabase'
import { Restaurant, MenuItem } from '@/types'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoritesContext'
import { formatCurrency } from '@/lib/utils'

export const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { totalCount, subtotal } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedTag, setSelectedTag] = useState<string>('todos')
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
        <Button onClick={() => navigate('/')} className="mt-4" variant="primary">
          Voltar ao Início
        </Button>
      </div>
    )
  }

  const favorite = isFavorite(restaurant.id)

  const menuCategories = ['todos', ...Array.from(new Set(menuItems.map((m) => m.category)))]
  const filteredItems =
    selectedTag === 'todos'
      ? menuItems
      : menuItems.filter((m) => m.category === selectedTag)

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      <Header showSearch={false} />

      {/* Restaurant Header & Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto">
          {/* Cover image */}
          <div className="relative h-44 sm:h-60 w-full overflow-hidden bg-gray-200">
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

            {/* Back button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-red-base shadow-sm active:scale-95 transition-all"
              aria-label="Voltar"
            >
              <ArrowLeft size={18} weight="bold" />
            </button>

            {/* Favorite button */}
            <button
              type="button"
              onClick={() => toggleFavorite(restaurant.id)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-red-base shadow-sm active:scale-95 transition-all"
              aria-label="Favoritar"
            >
              <Heart
                size={18}
                weight={favorite ? 'fill' : 'regular'}
                className={favorite ? 'text-red-base' : 'text-gray-500'}
              />
            </button>
          </div>

          {/* Restaurant Details */}
          <div className="px-4 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={restaurant.logoUrl || restaurant.imageUrl}
                alt={restaurant.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md -mt-10 sm:-mt-12 bg-white flex-shrink-0"
              />
              <div>
                <h1 className="text-title-lg sm:text-2xl font-bold text-gray-600">
                  {restaurant.name}
                </h1>
                <p className="text-body-xs sm:text-body-sm text-gray-400 mt-0.5">
                  {restaurant.address} • {restaurant.neighborhood}
                </p>
              </div>
            </div>

            {/* Badges / Metrics */}
            <div className="flex items-center gap-3 text-body-xs font-medium text-gray-500 bg-gray-100 px-3.5 py-2 rounded-2xl">
              <div className="flex items-center gap-1 font-bold text-gray-600">
                <Star size={14} weight="fill" className="text-amber-500" />
                <span>{restaurant.rating.toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({restaurant.reviewCount})</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <span>•</span>
              <span className="font-semibold text-gray-600">
                {restaurant.deliveryFee === 0 ? 'Entrega Grátis' : formatCurrency(restaurant.deliveryFee)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Category Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {menuCategories.map((cat) => (
            <Tag
              key={cat}
              label={cat === 'todos' ? 'Todos os Itens' : cat}
              selected={selectedTag === cat}
              onClick={() => setSelectedTag(cat)}
            />
          ))}
        </div>

        {/* Menu Items List */}
        <div>
          <h2 className="text-title-md font-bold text-gray-600 mb-3">
            Cardápio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                restaurant={restaurant}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Floating Bottom Cart Bar */}
      {totalCount > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 animate-slideUp">
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

      <TabBar />
    </div>
  )
}
