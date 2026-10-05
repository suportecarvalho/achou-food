import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Receipt,
  Storefront,
  Clock,
  CheckCircle,
  Truck,
  CookingPot,
  WifiHigh,
  BatteryFull,
  CellSignalFull,
} from '@phosphor-icons/react'
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
    <div className="min-h-screen bg-gray-100 flex justify-center selection:bg-red-base/20 selection:text-red-base">
      {/* Mobile App Container matching the Figma screen frame */}
      <div className="w-full max-w-[440px] min-h-screen bg-white sm:shadow-2xl sm:my-4 sm:rounded-[40px] overflow-hidden flex flex-col relative border-0 sm:border sm:border-gray-200/80">
        
        {/* ========================================================================= */}
        {/* TOP HEADER: STATUS BAR + PEDIDO / ACOMPANHE SEU PEDIDO (Figma Spec) */}
        {/* ========================================================================= */}
        <header className="bg-[#ECECEE] text-gray-600 pt-3 pb-7 px-5 relative select-none z-20">
          {/* Status Bar simulation (9:41, icons) */}
          <div className="flex items-center justify-between text-gray-800 text-[13px] font-semibold mb-3 px-1">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 opacity-90">
              <CellSignalFull size={15} weight="fill" />
              <WifiHigh size={15} weight="bold" />
              <BatteryFull size={18} weight="fill" />
            </div>
          </div>

          {/* Header Row: Order Badge + Title */}
          <div className="flex items-center gap-3 mt-1">
            {/* Rounded square badge with red receipt icon */}
            <div className="w-11 h-11 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center shadow-sm flex-shrink-0">
              <Receipt size={22} weight="bold" className="text-red-base" />
            </div>

            {/* Title Details */}
            <div className="min-w-0">
              <span className="block text-[10px] font-bold tracking-wider uppercase text-gray-400 leading-none mb-1">
                PEDIDO
              </span>
              <h1 className="text-[16px] font-bold text-gray-600 truncate leading-snug">
                Acompanhe seu pedido
              </h1>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* WHITE CONTAINER: EMPTY STATE OR ACTIVE ORDERS (Figma Spec idêntico) */}
        {/* ========================================================================= */}
        <main className="flex-1 bg-white -mt-3 rounded-t-[32px] px-6 pt-8 pb-28 relative z-10 shadow-sm flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-red-base border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            /* ===================================================================== */
            /* EMPTY STATE FIEL AO PRINT "Order - Checkout" */
            /* ===================================================================== */
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4 animate-fadeIn">
              {/* Ícone de Recibo / Cupom em Vermelho */}
              <div className="mb-3 text-red-base">
                <Receipt size={42} weight="bold" />
              </div>

              {/* Mensagem oficial */}
              <p className="text-body-sm text-gray-500 mb-6">
                Você ainda não adicionou itens
              </p>

              {/* Botão EXPLORAR com ícone de Storefront */}
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100/90 hover:bg-gray-200 text-gray-600 rounded-full border border-gray-200/90 text-label-xs font-semibold uppercase tracking-wider shadow-sm transition-all active:scale-95"
              >
                <Storefront size={18} weight="bold" className="text-gray-600" />
                <span>EXPLORAR</span>
              </Link>
            </div>
          ) : (
            /* LISTAGEM QUANDO EXISTEM PEDIDOS ATIVOS */
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-title-sm font-bold text-gray-600">Histórico de Pedidos</h2>
                <Link
                  to="/"
                  className="text-label-xs font-semibold text-red-base hover:text-red-dark"
                >
                  Pedir mais
                </Link>
              </div>

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
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="text-title-sm font-semibold text-gray-600">
                          {order.restaurantName}
                        </h3>
                        <p className="text-body-xs text-gray-400">
                          Pedido #{order.id.slice(-6)}
                        </p>
                      </div>

                      <div
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-2xs font-semibold border ${statusInfo.color}`}
                      >
                        <StatusIcon size={14} weight="fill" />
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>

                    <div className="py-2.5 text-body-xs text-gray-500 space-y-1">
                      {order.items.map((it) => (
                        <div key={it.id} className="flex justify-between">
                          <span>
                            {it.quantity}x {it.itemName}
                          </span>
                          <span className="font-semibold text-gray-600">
                            {formatCurrency(it.totalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-body-xs">
                      <span className="text-gray-400">
                        Total: <strong className="text-gray-600">{formatCurrency(order.totalAmount)}</strong>
                      </span>

                      <Link
                        to={`/restaurant/${order.restaurantId}`}
                        className="font-semibold text-red-base hover:text-red-dark"
                      >
                        Repetir Pedido
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>

        {/* Floating Bottom TabBar with Order Tab active */}
        <TabBar />
      </div>
    </div>
  )
}
