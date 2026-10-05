import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Storefront, Receipt } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface TabBarProps {
  className?: string
}

export const TabBar: React.FC<TabBarProps> = ({ className }) => {
  const location = useLocation()

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
      icon: Receipt,
      hasDot: true,
    },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path) || (path === '/orders' && location.pathname === '/cart')
  }

  return (
    <nav
      className={cn(
        'absolute bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300',
        className
      )}
      aria-label="Navegação principal"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-tab-bar border border-gray-200/80">
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
                  ? 'bg-gray-100/90 text-red-base shadow-sm'
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
                  active ? 'text-red-base' : 'text-gray-500'
                )}
              />

              {item.hasDot && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-base rounded-full ring-2 ring-white" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

