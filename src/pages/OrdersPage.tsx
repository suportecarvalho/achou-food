import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ClipboardText,
  Clock,
  CheckCircle,
  Truck,
  CookingPot,
  Receipt,
  ArrowRight
} from '@phosphor-icons/react'
import { Header } from '@/components/layout/Header'
import { TabBar } from '@/components/layout/TabBar'
import { apiService } from '@/lib/supabase'
import { Order, OrderStatus } from '@/types'
import { formatCurrency } from '@/lib/utils'

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const highlightId = location.state?.newOrderId

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await apiService.getOrders()
        setOrders(data)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return {
          label: 'Pedido Recebido',
          color: 'text-amber-600 bg-amber-50 border-amber-200',
          icon: Receipt,
          progress: 25,
        }
      case 'preparing':
        return {
          label: 'Em Preparo na Cozinha',
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          icon: CookingPot,
          progress: 50,
        }
      case 'delivering':
        return {
          label: 'Saiu para Entrega',
          color: 'text-purple-600 bg-purple-50 border-purple-200',
          icon: Truck,
          progress: 75,
        }
      case 'delivered':
        return {
          label: 'Entregue com Sucesso',
          color: 'text-success-base bg-emerald-50 border-emerald-200',
          icon: CheckCircle,
          progress: 100,
        }
      case 'cancelled':
        return {
          label: 'Cancelado',
          color: 'text-red-dark bg-red-50 border-red-200',
          icon: Receipt,
          progress: 0,
        }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-28">
      <Header showSearch={false} />

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        <div>
          <h1 className="text-title-lg font-bold text-gray-600">Seus Pedidos</h1>
          <p className="text-body-xs text-gray-400">
            Acompanhe o status em tempo real das suas entregas
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse h-32"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-gray-200 p-8">
            <ClipboardText size={42} className="mx-auto text-gray-300 mb-2" />
            <p className="text-title-md font-semibold text-gray-600">
              Você ainda não fez nenhum pedido
            </p>
            <p className="text-body-sm text-gray-400 mt-1">
              Explore nossos restaurantes parceiros e faça o seu primeiro pedido hoje mesmo!
            </p>
            <Link
              to="/"
              className="mt-4 inline-block px-5 py-2.5 bg-red-base text-white text-label-xs font-semibold rounded-full hover:bg-red-dark transition-colors"
            >
              Fazer Pedido
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              const StatusIcon = statusInfo.icon
              const isHighlighted = order.id === highlightId

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl p-4 border transition-all ${
                    isHighlighted
                      ? 'border-red-base ring-2 ring-red-base/20 shadow-md'
                      : 'border-gray-200/90 hover:shadow-card-soft'
                  }`}
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      {order.restaurantLogo && (
                        <img
                          src={order.restaurantLogo}
                          alt={order.restaurantName}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-title-sm font-semibold text-gray-600">
                          {order.restaurantName}
                        </h3>
                        <p className="text-body-xs text-gray-400">
                          Pedido #{order.id.slice(-6)} • {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-2xs font-semibold border ${statusInfo.color}`}
                    >
                      <StatusIcon size={14} weight="fill" />
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {order.status !== 'cancelled' && (
                    <div className="py-3">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-red-base h-full rounded-full transition-all duration-500"
                          style={{ width: `${statusInfo.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="py-2 text-body-xs text-gray-500 space-y-1">
                    {order.items.map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <span>
                          {it.quantity}x {it.itemName}
                        </span>
                        <span className="font-medium text-gray-600">
                          {formatCurrency(it.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-body-sm">
                    <span className="text-gray-400">
                      Total com entrega: <strong className="text-gray-600">{formatCurrency(order.totalAmount)}</strong>
                    </span>

                    <Link
                      to={`/restaurant/${order.restaurantId}`}
                      className="inline-flex items-center gap-1 text-label-xs font-semibold text-red-base hover:text-red-dark transition-colors"
                    >
                      <span>Pedir Novamente</span>
                      <ArrowRight size={13} weight="bold" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <TabBar />
    </div>
  )
}
