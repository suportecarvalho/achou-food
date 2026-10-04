import React, { useState, useEffect } from 'react'
import { MapPin, Sparkle, MagnifyingGlass } from '@phosphor-icons/react'
import { Header } from '@/components/layout/Header'
import { TabBar } from '@/components/layout/TabBar'
import { Tag } from '@/components/ui/Tag'
import { ToggleList, ViewMode } from '@/components/ui/ToggleList'
import { RestaurantCard } from '@/components/cards/RestaurantCard'
import { RestaurantMap } from '@/components/map/RestaurantMap'
import { AchouLogo } from '@/components/common/AchouLogo'
import { apiService } from '@/lib/supabase'
import { Category, Restaurant } from '@/types'

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, rests] = await Promise.all([
          apiService.getCategories(),
          apiService.getRestaurants(),
        ])
        setCategories(cats)
        setRestaurants(rests)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    async function filterData() {
      const filtered = await apiService.getRestaurants(selectedCategory, searchQuery)
      setRestaurants(filtered)
    }
    filterData()
  }, [selectedCategory, searchQuery])

  return (
    <div className="min-h-screen bg-gray-100 pb-28">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={true}
      />

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-6">
        {/* Hero Banner with Achou Food Theme */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-red-dark via-red-base to-rose-600 text-white overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-label-2xs font-bold tracking-wider uppercase mb-3">
              <Sparkle size={14} weight="fill" className="text-yellow-300" />
              <span>O Delivery Que Você Procura</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Os melhores restaurantes da sua cidade em minutos.
            </h1>
            <p className="mt-2 text-white/90 text-body-sm">
              Peça de cafeterias aconchegantes, confeitarias com doces artesanais, pizzarias e muito mais.
            </p>

            <div className="mt-4 flex items-center gap-2 text-label-xs text-white/80">
              <MapPin size={16} weight="fill" className="text-white" />
              <span>Entregando em <strong>Bairro Encantado e Região</strong></span>
            </div>
          </div>

          {/* Decorative Vector Cloche & Scooter */}
          <div className="absolute -right-6 -bottom-6 opacity-25 sm:opacity-35 pointer-events-none transform scale-125 sm:scale-150">
            <AchouLogo variant="scooter" size="xl" className="filter invert brightness-200" />
          </div>
        </div>

        {/* Category Filter Tags */}
        <section aria-label="Categorias de Restaurantes">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
            {categories.map((category) => (
              <Tag
                key={category.id}
                label={category.name}
                selected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        </section>

        {/* Section Header with List / Map Toggle */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div>
            <h2 className="text-title-lg font-bold text-gray-600">
              Restaurantes Disponíveis
            </h2>
            <p className="text-body-xs text-gray-400">
              {restaurants.length} {restaurants.length === 1 ? 'opção encontrada' : 'opções encontradas'}
            </p>
          </div>

          {/* ToggleList Component from Design Spec */}
          <ToggleList value={viewMode} onChange={setViewMode} />
        </div>

        {/* Content: List View or Map View */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse h-24"
              />
            ))}
          </div>
        ) : viewMode === 'map' ? (
          <RestaurantMap restaurants={restaurants} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurants.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-200 p-8">
                <p className="text-title-md font-semibold text-gray-600">
                  Nenhum restaurante encontrado
                </p>
                <p className="text-body-sm text-gray-400 mt-1">
                  Tente buscar por outro termo ou selecione a categoria "Todos".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('todos')
                    setSearchQuery('')
                  }}
                  className="mt-4 px-4 py-2 bg-red-base text-white text-label-xs font-semibold rounded-full hover:bg-red-dark transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  variant="default"
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom TabBar */}
      <TabBar />
    </div>
  )
}
