import React, { useState } from 'react'
import {
  Users,
  MagnifyingGlass,
  Receipt,
  Phone,
  Envelope,
  MapPin,
  Calendar,
  X,
  Eye,
} from '@phosphor-icons/react'
import { useAdmin } from '@/context/AdminContext'
import { AdminCustomer } from '@/types/admin'
import { formatCurrency } from '@/lib/utils'

export const CustomersView: React.FC = () => {
  const { customers, orders } = useAdmin()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null)

  const filteredCustomers = customers.filter((c) => {
    const q = searchTerm.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.neighborhood.toLowerCase().includes(q)
    )
  })

  const customerOrders = selectedCustomer
    ? orders.filter(
        (o) =>
          o.customerName.toLowerCase().trim() ===
          selectedCustomer.name.toLowerCase().trim()
      )
    : []

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Base de Clientes Cadastrados
          </h2>
          <p className="text-xs text-gray-500">
            Acompanhe o perfil, ticket médio, histórico de compras e fidelidade dos clientes de Canela.
          </p>
        </div>

        <div className="text-xs font-bold text-gray-600 bg-white px-3 py-2 rounded-xl border border-gray-200">
          Total de Clientes Ativos: <span className="text-red-base">{customers.length}</span>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="relative max-w-md">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, telefone, e-mail ou bairro..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:border-red-base outline-hidden"
          />
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Contatos</th>
                <th className="py-3.5 px-4">Endereço Principal</th>
                <th className="py-3.5 px-4 text-center">Pedidos Realizados</th>
                <th className="py-3.5 px-4 text-right">Total Investido</th>
                <th className="py-3.5 px-4">Último Pedido</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Nenhum cliente localizado.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-red-base/10 text-red-base font-bold flex items-center justify-center text-xs">
                          {cust.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{cust.name}</p>
                          <span className="text-[10px] text-gray-400">Desde {cust.createdAt}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5 text-gray-600">
                        <p className="flex items-center gap-1 font-medium">
                          <Phone size={12} className="text-gray-400" />
                          {cust.phone}
                        </p>
                        <p className="flex items-center gap-1 text-[11px] text-gray-500">
                          <Envelope size={12} className="text-gray-400" />
                          {cust.email}
                        </p>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="max-w-[200px] truncate text-gray-700">
                        <p className="font-medium truncate">{cust.address}</p>
                        <span className="text-[10px] text-gray-400">{cust.neighborhood} - Canela</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-base font-bold text-xs">
                        {cust.totalOrders} pedidos
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-gray-900">
                      {formatCurrency(cust.totalSpent)}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {cust.lastOrderDate}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-base text-gray-700 font-bold text-[11px] flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Eye size={13} weight="bold" />
                        <span>Ver Histórico</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Histórico do Cliente */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {selectedCustomer.name}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {selectedCustomer.phone} • {selectedCustomer.email}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Cards resumo */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Gasto</span>
                  <span className="text-base font-black text-gray-900">
                    {formatCurrency(selectedCustomer.totalSpent)}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Pedidos Registrados</span>
                  <span className="text-base font-black text-gray-900">
                    {selectedCustomer.totalOrders}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Pedidos Recentes na Plataforma</h4>
                {customerOrders.length === 0 ? (
                  <p className="text-gray-400 text-center py-4 bg-gray-50 rounded-xl">
                    Nenhum pedido recente registrado com esse nome no sistema local.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.map((ord) => (
                      <div key={ord.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-gray-900">{ord.id} - {ord.restaurantName}</span>
                          <span className="text-red-base">{formatCurrency(ord.totalAmount)}</span>
                        </div>
                        <p className="text-gray-500 text-[11px]">
                          {ord.items.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                          <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                          <span className="font-bold uppercase text-emerald-600">{ord.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
