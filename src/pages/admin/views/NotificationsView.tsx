import React from 'react'
import {
  Bell,
  Check,
  CheckCircle,
  Receipt,
  Storefront,
  CurrencyDollar,
  WarningCircle,
  Clock,
} from '@phosphor-icons/react'
import { useAdmin } from '@/context/AdminContext'

interface NotificationsViewProps {
  onNavigate: (tab: string) => void
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigate }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  } = useAdmin()

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Central de Notificações
          </h2>
          <p className="text-xs text-gray-500">
            Alertas em tempo real sobre novos pedidos, solicitações de parceiros e eventos financeiros.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-red-base hover:border-red-base/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Check size={16} weight="bold" />
            <span>Marcar Todas como Lidas ({unreadNotificationsCount})</span>
          </button>
        )}
      </div>

      {/* Lista de Notificações */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs divide-y divide-gray-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            Nenhuma notificação registrada no momento.
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
                    onNavigate(tab)
                  }
                }}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                  isUnread ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-gray-50'
                }`}
              >
                {/* Ícone */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'pedido'
                      ? 'bg-emerald-100 text-emerald-700'
                      : notif.type === 'estabelecimento'
                      ? 'bg-blue-100 text-blue-700'
                      : notif.type === 'financeiro'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {notif.type === 'pedido' && <Receipt size={20} weight="bold" />}
                  {notif.type === 'estabelecimento' && <Storefront size={20} weight="bold" />}
                  {notif.type === 'financeiro' && <CurrencyDollar size={20} weight="bold" />}
                  {notif.type === 'sistema' && <WarningCircle size={20} weight="bold" />}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-xs ${
                        isUnread ? 'font-black text-gray-900' : 'font-semibold text-gray-700'
                      }`}
                    >
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 flex-shrink-0">
                      <Clock size={12} />
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {/* Marcador de Não Lido */}
                {isUnread && (
                  <span className="w-2.5 h-2.5 rounded-full bg-red-base flex-shrink-0 mt-1" />
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
