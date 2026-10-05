import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Storefront, Receipt } from '@phosphor-icons/react'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'

interface TabBarProps {
  className?: string
}

export const TabBar: React.FC<TabBarProps> = ({ className }) => {
  const location = useLocation()
  const { totalCount } = useCart()

  const navItems = [
    {
      id: 'home',
      label: 'Início',
      path: '/',
      icon: Storefront,
    },
    {
      id: 'orders',
      label: 'Pedidos',
      path: '/orders',
      icon: Receipt,
      hasDot: totalCount > 0,
    },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/map'
    return location.pathname.startsWith(path) || (path === '/orders' && location.pathname === '/cart')
  }

  return (
    <nav
      className={cn(
        'fixed bottom-5 left-1/2 -translate-x-1/2 z-50 md:hidden select-none pointer-events-auto',
        'bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))]',
        className
      )}
      aria-label="Navegação principal inferior"
    >
      <div className="flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-lg rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-200/90 ring-1 ring-black/5">
        {navItems.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-xs font-bold active:scale-95',
                active
                  ? 'bg-red-base/10 text-red-base shadow-xs'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/60'
              )}
              title={item.label}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                size={20}
                weight={active ? 'fill' : 'regular'}
                className={cn(
                  'transition-transform duration-200',
                  active ? 'text-red-base scale-105' : 'text-gray-500'
                )}
              />
              <span className="tracking-wide">{item.label}</span>

              {item.hasDot && (
                <span className="w-2 h-2 bg-red-base rounded-full ring-2 ring-white animate-pulse" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
