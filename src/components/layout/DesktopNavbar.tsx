import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  MagnifyingGlass,
  ShoppingBag,
  Heart,
  Receipt,
  User,
  CaretDown,
  X,
} from '@phosphor-icons/react'
import { AchouLogo } from '@/components/common/AchouLogo'
import { ToggleList, ViewMode } from '@/components/ui/ToggleList'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoritesContext'
import { formatCurrency } from '@/lib/utils'

interface DesktopNavbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode?: ViewMode
  onToggleView?: (mode: ViewMode) => void
  currentAddress: string
  onOpenAddressModal: () => void
  showViewToggle?: boolean
}

export const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode = 'list',
  onToggleView,
  currentAddress,
  onOpenAddressModal,
  showViewToggle = true,
}) => {
  const navigate = useNavigate()
  const { totalCount, subtotal } = useCart()
  const { favorites } = useFavorites()

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-6">
          {/* Lado Esquerdo: Logo + Endereço */}
          <div className="flex items-center gap-6 lg:gap-8 flex-shrink-0">
            {/* Logo */}
            <Link to="/" className="flex items-center group transition-transform active:scale-95" title="Achou Food">
              <AchouLogo variant="full" size="md" />
            </Link>

            {/* Endereço de Entrega */}
            <button
              type="button"
              onClick={onOpenAddressModal}
              className="flex items-center gap-2.5 px-3.5 py-1.5 bg-gray-50 hover:bg-red-50/60 border border-gray-200/80 hover:border-red-200 rounded-full transition-all group text-left max-w-[280px] lg:max-w-[340px]"
              title="Clique para alterar o endereço de entrega"
            >
              <div className="w-7 h-7 rounded-full bg-red-base/10 group-hover:bg-red-base text-red-base group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                <MapPin size={15} weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-red-base transition-colors leading-none">
                  Entrega em
                </span>
                <p className="text-[13px] font-semibold text-gray-700 truncate leading-snug">
                  {currentAddress}
                </p>
              </div>
              <CaretDown size={14} className="text-gray-400 group-hover:text-red-base transition-colors flex-shrink-0" />
            </button>
          </div>

          {/* Centro: Barra de Busca Ampla */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <MagnifyingGlass
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Busque por restaurantes, cafés, doces ou pratos..."
                className="w-full pl-10 pr-9 py-2.5 bg-gray-100/80 hover:bg-gray-100 focus:bg-white border border-transparent focus:border-red-base/50 rounded-full text-body-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-base/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                  title="Limpar busca"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Lado Direito: Alternador Lista/Mapa + Ações */}
          <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
            {/* Toggle Lista / Mapa */}
            {showViewToggle && onToggleView && (
              <div className="hidden lg:block">
                <ToggleList value={viewMode} onChange={onToggleView} />
              </div>
            )}

            {/* Pedidos */}
            <Link
              to="/orders"
              className="flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:text-red-base hover:bg-gray-100 rounded-xl transition-all font-medium text-sm"
              title="Meus Pedidos"
            >
              <Receipt size={20} weight="regular" />
              <span className="hidden xl:inline">Pedidos</span>
            </Link>

            {/* Favoritos */}
            <Link
              to="/favorites"
              className="relative p-2 text-gray-600 hover:text-red-base hover:bg-gray-100 rounded-xl transition-all"
              title="Restaurantes Favoritos"
            >
              <Heart size={20} weight={favorites.length > 0 ? 'fill' : 'regular'} className={favorites.length > 0 ? 'text-red-base' : ''} />
              {favorites.length > 0 && (
                <span className="absolute 1 top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 bg-red-base text-white text-[10px] font-bold rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Sacola / Carrinho */}
            <Link
              to="/cart"
              className="flex items-center gap-2.5 px-4 py-2 bg-red-base hover:bg-red-dark text-white rounded-full transition-all shadow-sm active:scale-95 group"
              title="Ver Sacola de Compras"
            >
              <div className="relative">
                <ShoppingBag size={20} weight="bold" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-4 h-4 px-1 bg-white text-red-base text-[10px] font-extrabold rounded-full shadow-xs">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="font-semibold text-sm">
                {subtotal > 0 ? formatCurrency(subtotal) : 'Sacola'}
              </span>
            </Link>

            {/* Botão Entrar / Conta */}
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-300 hover:border-red-base text-gray-700 hover:text-red-base rounded-full transition-all text-sm font-semibold hover:bg-red-50/40"
              title="Fazer Login"
            >
              <User size={18} />
              <span>Entrar</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
