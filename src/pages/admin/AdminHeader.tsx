import React, { useState } from 'react'
import {
  List,
  MagnifyingGlass,
  Bell,
  MapPin,
  Check,
  CheckCircle,
  WarningCircle,
  Receipt,
  Storefront,
  X,
} from '@phosphor-icons/react'
import { useAdmin } from '@/context/AdminContext'
import { cn } from '@/lib/utils'

interface AdminHeaderProps {
  onOpenMobileMenu: () => void
  currentTab: string
  onSelectTab: (tab: string) => void
}

const tabTitles: Record<string, string> = {
  dashboard: 'Início',
  restaurants: 'Estabelecimentos',
  orders: 'Pedidos & Kanban Operacional',
  menus: 'Cardápios & Pratos',
  customers: 'Clientes Cadastrados',
  deliveries: 'Entregas & Motoboys',
  finance: 'Financeiro & Repasses',
  map: 'Mapa de Estabelecimentos',
  reports: 'Relatórios & Métricas',
  coupons: 'Cupons & Ofertas Promocionais',
  notifications: 'Central de Notificações',
  settings: 'Configurações da Plataforma',
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  currentTab,
  onSelectTab,
}) => {
  const {
    globalSearch,
    setGlobalSearch,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    settings,
  } = useAdmin()

  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200/90 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Esquerda: Botão Menu Mobile + Título da Seção Atual */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
          title="Abrir menu lateral"
        >
          <List size={22} weight="bold" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate tracking-tight">
              {tabTitles[currentTab] || 'Painel'}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Operação Normal
            </span>
          </div>
        </div>
      </div>

      {/* Meio: Campo de Busca Global */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <MagnifyingGlass
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Buscar lojas, pedidos, clientes ou entregadores..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50/80 hover:bg-gray-100/80 focus:bg-white text-xs text-gray-800 rounded-xl border border-gray-200 focus:border-red-base focus:ring-2 focus:ring-red-base/20 transition-all outline-hidden placeholder:text-gray-400"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} weight="bold" />
            </button>
          )}
        </div>
      </div>

      {/* Direita: Cidade, Notificações e Perfil */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Indicador de Cidade */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 rounded-xl text-xs font-semibold text-gray-700 border border-gray-200/60">
          <MapPin size={15} weight="fill" className="text-red-base" />
          <span>{settings.cityCenter.name}</span>
        </div>

        {/* Dropdown de Notificações */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Notificações"
          >
            <Bell size={20} weight={unreadNotificationsCount > 0 ? 'fill' : 'regular'} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute 1 top-1 right-1 w-4 h-4 bg-red-base text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Popover de Notificações */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">Notificações</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-base text-white rounded-full">
                        {unreadNotificationsCount} novas
                      </span>
                    )}
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-semibold text-red-base hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Check size={12} weight="bold" />
                      Marcar todas como lidas
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-400">
                      Nenhuma notificação no momento.
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const isUnread = !notif.read
                      return (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id)
                            if (notif.actionUrl) {
                              const tab = notif.actionUrl.replace('/admin/', '')
                              onSelectTab(tab)
                            }
                            setShowNotifications(false)
                          }}
                          className={cn(
                            'p-3 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-3 text-left',
                            isUnread && 'bg-red-50/40'
                          )}
                        >
                          <div
                            className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                              notif.type === 'pedido' && 'bg-emerald-100 text-emerald-700',
                              notif.type === 'estabelecimento' && 'bg-blue-100 text-blue-700',
                              notif.type === 'financeiro' && 'bg-amber-100 text-amber-700',
                              notif.type === 'sistema' && 'bg-purple-100 text-purple-700'
                            )}
                          >
                            {notif.type === 'pedido' && <Receipt size={16} weight="bold" />}
                            {notif.type === 'estabelecimento' && <Storefront size={16} weight="bold" />}
                            {notif.type === 'financeiro' && <CheckCircle size={16} weight="bold" />}
                            {notif.type === 'sistema' && <WarningCircle size={16} weight="bold" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={cn('text-xs font-semibold text-gray-900', isUnread && 'font-bold text-red-base')}>
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-red-base mt-1.5 flex-shrink-0" />
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Perfil Admin do Topo */}
        {(() => {
          let userEmail = 'contatostunburger@gmail.com'
          let userName = 'Stun Burger Admin'
          try {
            const stored = localStorage.getItem('achou_food_user')
            if (stored) {
              const u = JSON.parse(stored)
              if (u?.email) {
                userEmail = u.email
                userName = u.email === 'contatostunburger@gmail.com' ? 'Stun Burger Admin' : 'Admin Achou Food'
              }
            }
          } catch {}

          return (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-xl bg-red-base text-white flex items-center justify-center font-bold text-xs shadow-xs uppercase">
                {userEmail.slice(0, 1)}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-gray-800 leading-tight">{userName}</p>
                <p className="text-[10px] text-gray-500 font-medium truncate max-w-[160px]">{userEmail}</p>
              </div>
            </div>
          )
        })()}
      </div>
    </header>
  )
}
