import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, MagnifyingGlass, ShoppingBag, Heart, SquaresFour } from '@phosphor-icons/react'
import { AchouLogo } from '@/components/common/AchouLogo'
import { useCart } from '@/context/CartContext'

interface HeaderProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  showSearch?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery = '',
  onSearchChange,
  showSearch = true,
}) => {
  const navigate = useNavigate()
  const { totalCount } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 transition-all">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <AchouLogo variant="full" size="md" />
          </Link>

          {/* Search Bar */}
          {showSearch && (
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <MagnifyingGlass
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Buscar restaurantes, cafés, cupcakes..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 hover:bg-gray-200/70 focus:bg-white text-body-sm text-gray-600 placeholder:text-gray-400 rounded-full border border-transparent focus:border-red-base/50 focus:outline-none focus:ring-2 focus:ring-red-base/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Design System Showcase Link */}
            <Link
              to="/components"
              className="flex items-center gap-1.5 px-3 py-1.5 text-label-xs font-semibold text-gray-500 hover:text-red-base hover:bg-red-50 rounded-full transition-colors border border-gray-200"
              title="Design System & Componentes"
            >
              <SquaresFour size={16} weight="bold" className="text-red-base" />
              <span className="hidden sm:inline">Design System</span>
            </Link>

            {/* Favorites Icon */}
            <Link
              to="/favorites"
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-red-base hover:bg-gray-100 transition-colors"
              title="Restaurantes Favoritos"
            >
              <Heart size={20} />
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-red-base hover:bg-gray-100 transition-colors"
              title="Sacola de Compras"
            >
              <ShoppingBag size={20} />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 bg-red-base text-white text-[10px] font-bold rounded-full border border-white">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search input */}
        {showSearch && (
          <div className="mt-2.5 md:hidden">
            <div className="relative">
              <MagnifyingGlass
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar em Cafeteria das Nuvens, doces..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 text-body-sm text-gray-600 placeholder:text-gray-400 rounded-full border border-transparent focus:border-red-base/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-base/20 transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
