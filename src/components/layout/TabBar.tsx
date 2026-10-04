import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Storefront, ClipboardText, Heart, ShoppingBag } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useCart } from '@/context/CartContext'

interface TabBarProps {
  className?: string
}

export const TabBar: React.FC<TabBarProps> = ({ className }) => {
  const location = useLocation()
  const { totalCount } = useCart()

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: Storefront,
    },
    {
      id: 'orders',
      label: 'Order',
      path: '/orders',
      icon: ClipboardText,
    },
    {
      id: 'favorites',
      label: 'Favoritos',
      path: '/favorites',
      icon: Heart,
    },
    {
      id: 'cart',
      label: 'Sacola',
      path: '/cart',
      icon: ShoppingBag,
      badge: totalCount > 0 ? totalCount : undefined,
    },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      className={cn(
        'fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300',
        className
      )}
      aria-label="Navegação principal"
    >
      <div className="flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-md rounded-full shadow-tab-bar border border-gray-200/90">
        {navItems.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 group select-none',
                active
                  ? 'bg-gray-100 text-red-base shadow-sm'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/60'
              )}
              title={item.label}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                size={22}
                weight={active ? 'fill' : 'regular'}
                className={cn(
                  'transition-transform duration-200 group-hover:scale-110',
                  active ? 'text-red-base' : 'text-gray-400'
                )}
              />

              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 bg-red-base text-white text-label-2xs font-bold rounded-full border-2 border-white shadow-sm animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
