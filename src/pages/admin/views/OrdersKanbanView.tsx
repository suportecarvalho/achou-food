import React, { useState } from 'react'
import {
  Receipt,
  Clock,
  Motorcycle,
  CheckCircle,
  XCircle,
  Eye,
  CaretRight,
  CaretLeft,
  ArrowRight,
  Phone,
  MapPin,
  X,
  CreditCard,
  QrCode,
  Money,
} from '@phosphor-icons/react'
import { useAdmin } from '@/context/AdminContext'
import { AdminOrder, AdminOrderStatus } from '@/types/admin'
import { formatCurrency } from '@/lib/utils'

export const OrdersKanbanView: React.FC = () => {
  const { orders, updateOrderStatus, assignDriver, drivers } = useAdmin()
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [filterRestaurant, setFilterRestaurant] = useState<string>('todos')

  const columns: { id: AdminOrderStatus; label: string; color: string; dotColor: string }[] = [
    { id: 'novos', label: 'Novos', color: 'bg-red-50 text-red-base border-red-200', dotColor: 'bg-red-base animate-pulse' },
    { id: 'confirmados', label: 'Confirmados', color: 'bg-blue-50 text-blue-700 border-blue-200', dotColor: 'bg-blue-600' },
    { id: 'preparo', label: 'Em Preparo', color: 'bg-amber-50 text-amber-700 border-amber-200', dotColor: 'bg-amber-500' },
    { id: 'pronto', label: 'Pronto', color: 'bg-purple-50 text-purple-700 border-purple-200', dotColor: 'bg-purple-600' },
    { id: 'entrega', label: 'Em Entrega', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', dotColor: 'bg-indigo-600' },
    { id: 'entregue', label: 'Entregue', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dotColor: 'bg-emerald-600' },
  ]

  // Pipeline order flow
  const statusFlow: AdminOrderStatus[] = ['novos', 'confirmados', 'preparo', 'pronto', 'entrega', 'entregue']

  const getNextStatus = (current: AdminOrderStatus): AdminOrderStatus | null => {
    const idx = statusFlow.indexOf(current)
    if (idx !== -1 && idx < statusFlow.length - 1) {
      return statusFlow[idx + 1]
    }
    return null
  }

  const getPrevStatus = (current: AdminOrderStatus): AdminOrderStatus | null => {
    const idx = statusFlow.indexOf(current)
    if (idx > 0) {
      return statusFlow[idx - 1]
    }
    return null
  }

  const restaurantsList = Array.from(new Set(orders.map((o) => o.restaurantName)))

  const filteredOrders = orders.filter((o) => {
    if (filterRestaurant === 'todos') return true
    return o.restaurantName === filterRestaurant
  })

  return (
    <div className="space-y-6">
      {/* Top Header do Kanban */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Painel Operacional de Pedidos (Kanban)
          </h2>
          <p className="text-xs text-gray-500">
            Acompanhe o fluxo de todos os pedidos desde a entrada até a entrega final em Canela.
          </p>
        </div>

        {/* Filtro por Restaurante */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Filtrar Loja:</span>
          <select
            value={filterRestaurant}
            onChange={(e) => setFilterRestaurant(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 outline-hidden focus:border-red-base"
          >
            <option value="todos">Todos os estabelecimentos ({orders.length} pedidos)</option>
            {restaurantsList.map((rest) => (
              <option key={rest} value={rest}>
                {rest}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6 Colunas do Kanban Operacional */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-h-[580px] overflow-x-auto pb-4">
        {columns.map((col) => {
          const colOrders = filteredOrders.filter((o) => o.status === col.id)
          const colSum = colOrders.reduce((sum, o) => sum + o.totalAmount, 0)

          return (
            <div
              key={col.id}
              className="bg-gray-100/70 rounded-2xl p-3 border border-gray-200/70 flex flex-col min-w-[260px] xl:min-w-0"
            >
              {/* Header da Coluna */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-200/80">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <span className="text-xs font-black text-gray-800 tracking-tight">
                    {col.label}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-gray-700 shadow-2xs border border-gray-200">
                  {colOrders.length}
                </span>
              </div>

              {/* Subtotal da Coluna */}
              <div className="text-[10px] text-gray-500 font-semibold mb-3 px-1">
                Subtotal: <span className="font-bold text-gray-700">{formatCurrency(colSum)}</span>
              </div>

              {/* Lista de Cards da Coluna */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-290px)] pr-1">
                {colOrders.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-[11px] text-gray-400 font-medium text-center border-2 border-dashed border-gray-200/80 rounded-xl">
                    Nenhum pedido
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const nextStatus = getNextStatus(order.status)
                    const prevStatus = getPrevStatus(order.status)

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl p-3.5 border border-gray-200/90 shadow-2xs hover:shadow-xs transition-all space-y-3 group"
                      >
                        {/* Topo do Card */}
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-gray-900">
                            {order.id}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Estabelecimento & Cliente */}
                        <div>
                          <p className="text-xs font-bold text-red-base truncate">
                            {order.restaurantName}
                          </p>
                          <p className="text-[11px] font-semibold text-gray-700 truncate mt-0.5">
                            {order.customerName}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate mt-0.5">
                            {order.customerNeighborhood}
                          </p>
                        </div>

                        {/* Itens e Total */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-gray-500">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                          </span>
                          <span className="font-black text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>

                        {/* Entregador atribuído (se houver) */}
                        {order.driverName && (
                          <div className="text-[10px] bg-blue-50/80 text-blue-700 px-2 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                            <Motorcycle size={12} weight="bold" />
                            <span className="truncate">{order.driverName}</span>
                          </div>
                        )}

                        {/* Ações Rápidas no Rodapé do Card */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1">
                            {prevStatus && (
                              <button
                                onClick={() => updateOrderStatus(order.id, prevStatus)}
                                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
                                title="Voltar status anterior"
                              >
                                <CaretLeft size={14} weight="bold" />
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-base cursor-pointer"
                              title="Ver detalhes completos"
                            >
                              <Eye size={15} weight="bold" />
                            </button>
                          </div>

                          {nextStatus && (
                            <button
                              onClick={() => updateOrderStatus(order.id, nextStatus)}
                              className="px-2.5 py-1 bg-red-base hover:bg-red-dark text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            >
                              <span>Avançar</span>
                              <CaretRight size={12} weight="bold" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Detalhes do Pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-2">
                <Receipt size={20} className="text-red-base" weight="bold" />
                <h3 className="text-sm font-bold text-gray-900">
                  Detalhes do Pedido #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {/* Estabelecimento & Status */}
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Estabelecimento</span>
                  <p className="font-bold text-gray-900 text-sm">{selectedOrder.restaurantName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Status Atual</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full font-bold bg-red-100 text-red-base uppercase text-[10px]">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Informações do Cliente & Endereço */}
              <div className="space-y-1.5 p-3 rounded-xl border border-gray-100 bg-white">
                <p className="font-bold text-gray-800 flex items-center gap-1.5">
                  <span className="text-gray-400">Cliente:</span> {selectedOrder.customerName}
                </p>
                <p className="text-gray-600 flex items-center gap-1.5">
                  <Phone size={13} className="text-gray-400" />
                  {selectedOrder.customerPhone}
                </p>
                <p className="text-gray-600 flex items-center gap-1.5">
                  <MapPin size={13} className="text-gray-400" />
                  {selectedOrder.customerAddress} ({selectedOrder.customerNeighborhood})
                </p>
                {selectedOrder.notes && (
                  <p className="text-amber-700 bg-amber-50 p-2 rounded-lg text-[11px] mt-2 font-medium">
                    Obs: {selectedOrder.notes}
                  </p>
                )}
              </div>

              {/* Itens do Pedido */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Itens Solicitados</h4>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between bg-white">
                      <div>
                        <span className="font-bold text-gray-900">
                          {item.quantity}x {item.itemName}
                        </span>
                        <p className="text-[10px] text-gray-400">
                          {formatCurrency(item.unitPrice)} cada
                        </p>
                      </div>
                      <span className="font-bold text-gray-800">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Atribuição de Entregador */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">
                  Atribuir Entregador Parceiro
                </span>
                <div className="flex gap-2">
                  <select
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs outline-hidden"
                    onChange={(e) => {
                      const d = drivers.find((drv) => drv.id === e.target.value)
                      if (d) {
                        assignDriver(selectedOrder.id, d.name, d.phone)
                        setSelectedOrder({ ...selectedOrder, driverName: d.name, driverPhone: d.phone, status: 'entrega' })
                      }
                    }}
                    defaultValue={drivers.find((d) => d.name === selectedOrder.driverName)?.id || ''}
                  >
                    <option value="">Selecione um entregador disponível...</option>
                    {drivers.map((drv) => (
                      <option key={drv.id} value={drv.id}>
                        {drv.name} ({drv.vehicleType}) - {drv.status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Resumo Financeiro */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Taxa de Entrega</span>
                  <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Desconto Cupom</span>
                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-900 font-black text-sm pt-1 border-t border-gray-100">
                  <span>Total do Pedido</span>
                  <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Comissão Plataforma (12%)</span>
                  <span>{formatCurrency(selectedOrder.commissionAmount)}</span>
                </div>
              </div>

              {/* Ações de Status dentro do Modal */}
              <div className="flex items-center gap-2 pt-3">
                {statusFlow.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, st)
                      setSelectedOrder({ ...selectedOrder, status: st })
                    }}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition-colors cursor-pointer capitalize ${
                      selectedOrder.status === st
                        ? 'bg-red-base text-white border-red-base'
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
