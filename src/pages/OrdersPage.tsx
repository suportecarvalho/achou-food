import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Receipt,
  Storefront,
  Clock,
  CheckCircle,
  Truck,
  CookingPot,
  ArrowRight,
  Package,
} from '@phosphor-icons/react'
import { TabBar } from '@/components/layout/TabBar'
import { DesktopNavbar } from '@/components/layout/DesktopNavbar'
import { DesktopFooter } from '@/components/layout/DesktopFooter'
import { DeliveryAddressModal } from '@/components/modals/DeliveryAddressModal'
import { apiService } from '@/lib/supabase'
import { Order, OrderStatus } from '@/types'
import { formatCurrency } from '@/lib/utils'

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const highlightId = location.state?.newOrderId

  const [currentAddress, setCurrentAddress] = useState<string>(() => {
    return localStorage.getItem('achou_food_delivery_address') || 'Av. das Estrelas, 567 - Canela, RS'
  })
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-red-base/20 selection:text-red-base">
      {/* ========================================================================= */}
      {/* 1. VERSÃO DESKTOP (MD E SUPERIORES) - SEM MOLDURA DE CELULAR */}
      {/* ========================================================================= */}
      <div className="hidden md:flex flex-col min-h-screen w-full">
        <DesktopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentAddress={currentAddress}
          onOpenAddressModal={() => setIsAddressModalOpen(true)}
          showViewToggle={false}
        />

        <main className="max-w-5xl mx-auto px-6 py-10 w-full flex-1 flex flex-col">
          {/* Header da Página Desktop */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200/80 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-base/10 text-red-base flex items-center justify-center">
                  <Receipt size={24} weight="bold" />
                </div>
                <span>Meus Pedidos</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Acompanhe o status e histórico de pedidos realizados em Canela
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-base hover:bg-red-dark text-white text-xs font-bold rounded-full transition-colors shadow-sm"
            >
              <Storefront size={16} weight="bold" />
              <span>Explorar Restaurantes</span>
            </Link>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-red-base border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500">Carregando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center max-w-lg mx-auto shadow-xs my-8">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-base flex items-center justify-center mx-auto mb-4">
                <Package size={32} weight="bold" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Você ainda não fez nenhum pedido
              </h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Descubra os melhores restaurantes de Canela e faça seu primeiro pedido agora mesmo!
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-base hover:bg-red-dark text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95"
              >
                <Storefront size={18} weight="bold" />
                <span>Explorar Cardápios</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                const StatusIcon = statusInfo.icon
                const isHighlighted = order.id === highlightId

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                      isHighlighted
                        ? 'border-red-base ring-2 ring-red-base/20 shadow-lg'
                        : 'border-gray-200/80 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Topo do Card */}
                      <div className="flex items-start justify-between pb-4 border-b border-gray-100 gap-3">
                        <div>
                          <h3 className="text-base font-bold text-gray-800">
                            {order.restaurantName}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Pedido #{order.id.slice(-6)} • {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color} flex-shrink-0`}
                        >
                          <StatusIcon size={14} weight="fill" />
                          <span>{statusInfo.label}</span>
                        </div>
                      </div>

                      {/* Barra de Progresso do Pedido */}
                      <div className="py-3">
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-red-base h-full rounded-full transition-all duration-500"
                            style={{ width: `${statusInfo.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Itens do Pedido */}
                      <div className="py-2 space-y-1.5 text-xs text-gray-600">
                        {order.items.map((it) => (
                          <div key={it.id} className="flex justify-between items-center py-0.5">
                            <span className="font-medium text-gray-700">
                              {it.quantity}x {it.itemName}
                            </span>
                            <span className="font-semibold text-gray-800">
                              {formatCurrency(it.totalPrice)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rodapé do Card */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                          Total Pago
                        </span>
                        <p className="text-base font-extrabold text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>

                      <Link
                        to={`/restaurant/${order.restaurantId}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-base rounded-full text-xs font-bold transition-all"
                      >
                        <span>Pedir Novamente</span>
                        <ArrowRight size={14} weight="bold" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>

        <DesktopFooter />
      </div>

      {/* ========================================================================= */}
      {/* 2. VERSÃO MOBILE (DISPOSITIVOS MÓVEIS < MD) - DESIGN ESPECÍFICO MOBILE */}
      {/* ========================================================================= */}
      <div className="md:hidden w-full min-h-screen bg-white flex flex-col relative">
        <header className="bg-[#ECECEE] text-gray-600 pt-5 pb-7 px-5 relative select-none z-20">

          <div className="flex items-center gap-3 mt-1">
            <div className="w-11 h-11 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center shadow-sm flex-shrink-0">
              <Receipt size={22} weight="bold" className="text-red-base" />
            </div>

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

        <main className="flex-1 bg-white -mt-3 rounded-t-[32px] px-6 pt-8 pb-28 relative z-10 shadow-sm flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-red-base border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4 animate-fadeIn">
              <div className="mb-3 text-red-base">
                <Receipt size={42} weight="bold" />
              </div>
              <p className="text-body-sm text-gray-500 mb-6">
                Você ainda não adicionou itens
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100/90 hover:bg-gray-200 text-gray-600 rounded-full border border-gray-200/90 text-label-xs font-semibold uppercase tracking-wider shadow-sm transition-all active:scale-95"
              >
                <Storefront size={18} weight="bold" className="text-gray-600" />
                <span>EXPLORAR</span>
              </Link>
            </div>
          ) : (
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

        <TabBar />
      </div>

      <DeliveryAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        currentAddress={currentAddress}
        onSelectAddress={(newAddress) => {
          setCurrentAddress(newAddress)
          localStorage.setItem('achou_food_delivery_address', newAddress)
        }}
      />
    </div>
  )
}
