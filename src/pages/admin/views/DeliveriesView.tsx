import React, { useState } from 'react'
import {
  Motorcycle,
  Bicycle,
  Car,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Plus,
  X,
  Star,
  Receipt,
  User,
} from '@phosphor-icons/react'
import { useAdmin } from '@/context/AdminContext'
import { Driver } from '@/types/admin'
import { formatCurrency } from '@/lib/utils'

export const DeliveriesView: React.FC = () => {
  const { drivers, orders, updateDriverStatus, addDriver, assignDriver } = useAdmin()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: 'moto' as Driver['vehicleType'],
    vehiclePlate: '',
    status: 'disponivel' as Driver['status'],
  })

  // Pedidos prontos para despacho
  const waitingOrders = orders.filter((o) => o.status === 'pronto')
  // Entregas ativas em rota
  const activeDeliveries = orders.filter((o) => o.status === 'entrega')

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    addDriver({
      name: formData.name,
      phone: formData.phone,
      vehicleType: formData.vehicleType,
      vehiclePlate: formData.vehiclePlate,
      status: formData.status,
    })

    setIsModalOpen(false)
  }

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bicicleta':
        return <Bicycle size={18} weight="bold" />
      case 'carro':
        return <Car size={18} weight="bold" />
      default:
        return <Motorcycle size={18} weight="bold" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Logística & Frota de Entregas
          </h2>
          <p className="text-xs text-gray-500">
            Monitore motoboys em tempo real, despache pedidos prontos e gerencie entregadores cadastrados em Canela.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              phone: '(54) 99999-0000',
              vehicleType: 'moto',
              vehiclePlate: 'IXX-0000',
              status: 'disponivel',
            })
            setIsModalOpen(true)
          }}
          className="px-4 py-2 rounded-xl bg-red-base hover:bg-red-dark text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-red-base/20"
        >
          <Plus size={16} weight="bold" />
          <span>Cadastrar Entregador</span>
        </button>
      </div>

      {/* Grid: Pedidos Aguardando Coleta & Entregas em Rota */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna 1: Pedidos Aguardando Coleta */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
              <h3 className="text-sm font-bold text-gray-900">
                Aguardando Coleta / Despacho ({waitingOrders.length})
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-gray-400">Prontos na cozinha</span>
          </div>

          <div className="space-y-3">
            {waitingOrders.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 rounded-xl bg-gray-50 border border-dashed border-gray-200">
                Nenhum pedido aguardando coleta no momento.
              </div>
            ) : (
              waitingOrders.map((ord) => (
                <div key={ord.id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-extrabold text-xs text-gray-900">{ord.id}</span>
                      <p className="text-xs font-bold text-red-base">{ord.restaurantName}</p>
                      <p className="text-[11px] text-gray-600">Para: {ord.customerName} ({ord.customerNeighborhood})</p>
                    </div>
                    <span className="text-xs font-black text-gray-900">
                      {formatCurrency(ord.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                    <select
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold outline-hidden"
                      onChange={(e) => {
                        const d = drivers.find((drv) => drv.id === e.target.value)
                        if (d) {
                          assignDriver(ord.id, d.name, d.phone)
                          updateDriverStatus(d.id, 'em_rota')
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Vincular entregador disponível...
                      </option>
                      {drivers
                        .filter((d) => d.status === 'disponivel')
                        .map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.vehicleType})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coluna 2: Entregas em Rota */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
              <h3 className="text-sm font-bold text-gray-900">
                Entregas em Rota Agora ({activeDeliveries.length})
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-gray-400">Trajeto para o cliente</span>
          </div>

          <div className="space-y-3">
            {activeDeliveries.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 rounded-xl bg-gray-50 border border-dashed border-gray-200">
                Nenhuma entrega em rota no momento.
              </div>
            ) : (
              activeDeliveries.map((ord) => (
                <div key={ord.id} className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-extrabold text-xs text-indigo-900">{ord.id}</span>
                      <p className="text-xs font-bold text-gray-800">{ord.restaurantName}</p>
                      <p className="text-[11px] text-gray-600">Destino: {ord.customerAddress}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      Em Rota
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-indigo-100/60">
                    <span className="font-bold text-indigo-700 flex items-center gap-1.5">
                      <Motorcycle size={14} weight="bold" />
                      {ord.driverName || 'Entregador Parceiro'}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {ord.customerPhone}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Lista de Entregadores Cadastrados */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">
          Entregadores Parceiros Cadastrados
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                    {getVehicleIcon(driver.vehicleType)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 leading-snug truncate max-w-[130px]">
                      {driver.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 capitalize">
                      {driver.vehicleType} {driver.vehiclePlate ? `• ${driver.vehiclePlate}` : ''}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    driver.status === 'disponivel'
                      ? 'bg-emerald-50 text-emerald-700'
                      : driver.status === 'em_rota'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {driver.status === 'disponivel' ? 'Disponível' : driver.status === 'em_rota' ? 'Em Rota' : 'Offline'}
                </span>
              </div>

              <div className="space-y-1 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <p className="flex items-center justify-between">
                  <span className="text-gray-400 text-[10px] font-bold uppercase">Entregas Hoje:</span>
                  <span className="font-bold text-gray-800">{driver.deliveriesToday}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-gray-400 text-[10px] font-bold uppercase">Total Acumulado:</span>
                  <span className="font-bold text-gray-800">{driver.totalDeliveries}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-gray-400 text-[10px] font-bold uppercase">Avaliação:</span>
                  <span className="font-bold text-amber-600 flex items-center gap-0.5">
                    <Star size={11} weight="fill" /> {driver.rating.toFixed(1)}
                  </span>
                </p>
              </div>

              {/* Botão Alternar Status */}
              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={() => updateDriverStatus(driver.id, 'disponivel')}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                    driver.status === 'disponivel' ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Disponível
                </button>
                <button
                  onClick={() => updateDriverStatus(driver.id, 'offline')}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                    driver.status === 'offline' ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Offline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Cadastro de Entregador */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <h3 className="text-sm font-bold text-gray-900">Novo Entregador Parceiro</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleCreateDriver} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                  placeholder="Ex: Lucas Motoboy Canela"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">WhatsApp / Telefone *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                  placeholder="(54) 99999-0000"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Veículo</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                  >
                    <option value="moto">Moto</option>
                    <option value="bicicleta">Bicicleta</option>
                    <option value="carro">Carro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Placa (se houver)</label>
                  <input
                    type="text"
                    value={formData.vehiclePlate}
                    onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                    placeholder="Ex: IXX-4D52"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-red-base hover:bg-red-dark rounded-xl cursor-pointer shadow-sm shadow-red-base/20"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
