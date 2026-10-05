import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  House,
  Storefront,
  Receipt,
  BookOpen,
  Users,
  Motorcycle,
  CurrencyDollar,
  MapTrifold,
  ChartLineUp,
  Tag,
  Bell,
  Gear,
  ArrowSquareOut,
  X,
  ShieldCheck,
} from '@phosphor-icons/react'
import { AchouLogo } from '@/components/common/AchouLogo'
import { useAdmin } from '@/context/AdminContext'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  currentTab: string
  onSelectTab: (tab: string) => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
}) => {
  const { orders, unreadNotificationsCount, drivers } = useAdmin()

  const pendingOrdersCount = orders.filter((o) => o.status === 'novos').length
  const activeDeliveriesCount = drivers.filter((d) => d.status === 'em_rota').length

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: House },
    { id: 'restaurants', label: 'Estabelecimentos', icon: Storefront },
    { id: 'orders', label: 'Pedidos', icon: Receipt, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined, badgeColor: 'bg-red-base text-white' },
    { id: 'menus', label: 'Cardápios', icon: BookOpen },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'deliveries', label: 'Entregas', icon: Motorcycle, badge: activeDeliveriesCount > 0 ? activeDeliveriesCount : undefined, badgeColor: 'bg-blue-600 text-white' },
    { id: 'finance', label: 'Financeiro', icon: CurrencyDollar },
    { id: 'map', label: 'Mapa', icon: MapTrifold },
    { id: 'reports', label: 'Relatórios', icon: ChartLineUp },
    { id: 'coupons', label: 'Cupons e Ofertas', icon: Tag },
    { id: 'notifications', label: 'Notificações', icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined, badgeColor: 'bg-amber-500 text-white' },
    { id: 'settings', label: 'Configurações', icon: Gear },
  ]

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId)
    onClose()
  }

  return (
    <>
      {/* Overlay Escuro para Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 select-none shadow-sm',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Topo da Sidebar: Logo e Botão de Fechar Mobile */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
          <Link
            to="/admin"
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2 group"
          >
            <AchouLogo variant="full" size="sm" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-base/10 text-red-base ml-1">
              Admin
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Fechar menu"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Lista de Navegação Principal */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Painel de Controle
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group text-left cursor-pointer',
                  isActive
                    ? 'bg-red-base text-white shadow-sm shadow-red-base/20 font-bold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={19}
                    weight={isActive ? 'fill' : 'regular'}
                    className={cn(
                      'flex-shrink-0 transition-transform group-hover:scale-105',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-red-base'
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-extrabold leading-tight',
                      isActive ? 'bg-white text-red-base' : item.badgeColor
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Rodapé da Sidebar: Ir para o App e Perfil */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/70 flex-shrink-0 space-y-2">
          {/* Botão Ver Loja do Cliente */}
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-red-50/60 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:text-red-base transition-all group shadow-2xs"
            title="Abrir o aplicativo do cliente em nova aba"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ver App do Cliente</span>
            </span>
            <ArrowSquareOut size={16} className="text-gray-400 group-hover:text-red-base" />
          </Link>

          {/* Card do Usuário Administrador */}
          {(() => {
            let userEmail = 'contatostunburger@gmail.com'
            let userName = 'Stun Burger'
            try {
              const stored = localStorage.getItem('achou_food_user')
              if (stored) {
                const u = JSON.parse(stored)
                if (u?.email) {
                  userEmail = u.email
                  userName = u.email === 'contatostunburger@gmail.com' ? 'Stun Burger' : 'Gestão Canela'
                }
              }
            } catch {}

            return (
              <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-100 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-red-base text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0 uppercase">
                  {userEmail.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-800 truncate leading-snug">
                    {userName}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium truncate flex items-center gap-1">
                    <ShieldCheck size={12} weight="fill" />
                    <span>Super Admin</span>
                  </p>
                </div>
              </div>
            )
          })()}
        </div>
      </aside>
    </>
  )
}
