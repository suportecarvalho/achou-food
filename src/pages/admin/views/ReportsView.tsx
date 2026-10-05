import React, { useState } from 'react'
import {
  ChartLineUp,
  Receipt,
  CurrencyDollar,
  Storefront,
  Users,
  Motorcycle,
  DownloadSimple,
  Calendar,
  Sparkle,
} from '@phosphor-icons/react'
import { useAdmin } from '@/context/AdminContext'
import { formatCurrency } from '@/lib/utils'

export const ReportsView: React.FC = () => {
  const { orders, restaurants, customers, drivers, menuItems } = useAdmin()
  const [activeReportTab, setActiveReportTab] = useState<
    'pedidos' | 'faturamento' | 'estabelecimentos' | 'clientes' | 'produtos' | 'entregas'
  >('pedidos')

  const totalGross = orders.reduce((s, o) => s + o.totalAmount, 0)
  const averageTicket = orders.length > 0 ? totalGross / orders.length : 0

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Relatórios Estratégicos & Desempenho
          </h2>
          <p className="text-xs text-gray-500">
            Métricas analíticas consolidadas de vendas, faturamento, público e logística do Achou Food em Canela.
          </p>
        </div>

        <button
          onClick={() => alert('Relatório CSV exportado com sucesso!')}
          className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-red-base hover:border-red-base/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <DownloadSimple size={16} weight="bold" />
          <span>Exportar Relatório (CSV)</span>
        </button>
      </div>

      {/* Tabs de Relatórios */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200 text-xs scrollbar-none">
        {[
          { id: 'pedidos', label: 'Pedidos', icon: Receipt },
          { id: 'faturamento', label: 'Faturamento', icon: CurrencyDollar },
          { id: 'estabelecimentos', label: 'Estabelecimentos', icon: Storefront },
          { id: 'clientes', label: 'Clientes', icon: Users },
          { id: 'produtos', label: 'Produtos', icon: Sparkle },
          { id: 'entregas', label: 'Entregas', icon: Motorcycle },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeReportTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as any)}
              className={`py-2 px-3.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-red-base text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={16} weight={isActive ? 'fill' : 'bold'} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Conteúdo do Relatório Ativo */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-6">
        {activeReportTab === 'pedidos' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Análise de Pedidos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Total de Pedidos</span>
                <span className="text-2xl font-black text-gray-900">{orders.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Ticket Médio</span>
                <span className="text-2xl font-black text-emerald-600">{formatCurrency(averageTicket)}</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Taxa de Conclusão</span>
                <span className="text-2xl font-black text-blue-600">98.5%</span>
              </div>
            </div>
            <div className="pt-2 text-xs text-gray-500">
              Maior volume de pedidos concentrado no horário de almoço (12h-13h30) e jantar (19h30-21h30).
            </div>
          </div>
        )}

        {activeReportTab === 'faturamento' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Visão Geral de Faturamento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Volume Transacionado</span>
                <span className="text-2xl font-black text-gray-900">{formatCurrency(totalGross)}</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Comissão Estimada</span>
                <span className="text-2xl font-black text-emerald-600">
                  {formatCurrency(totalGross * 0.12)}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Frete Total</span>
                <span className="text-2xl font-black text-amber-600">
                  {formatCurrency(orders.reduce((s, o) => s + o.deliveryFee, 0))}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeReportTab === 'estabelecimentos' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Desempenho dos Estabelecimentos</h3>
            <div className="divide-y divide-gray-100 text-xs">
              {restaurants.map((rest) => (
                <div key={rest.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900">{rest.name}</span>
                    <p className="text-[11px] text-gray-400">{rest.categoryName} • {rest.neighborhood}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">{formatCurrency(rest.totalRevenue)}</span>
                    <p className="text-[11px] text-emerald-600 font-semibold">{rest.ordersCount} pedidos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeReportTab === 'clientes' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Métricas de Clientes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Base Total</span>
                <span className="text-2xl font-black text-gray-900">{customers.length} clientes</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Recorrência Média</span>
                <span className="text-2xl font-black text-purple-600">4.2 pedidos/mês</span>
              </div>
            </div>
          </div>
        )}

        {activeReportTab === 'produtos' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Itens Mais Pedidos</h3>
            <div className="space-y-2 text-xs">
              {menuItems.slice(0, 6).map((item, idx) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-base/10 text-red-base font-black flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-[10px] text-gray-400">{item.category}</p>
                    </div>
                  </div>
                  <span className="font-black text-gray-900">{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeReportTab === 'entregas' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Performance Logística</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Tempo Médio de Entrega</span>
                <span className="text-2xl font-black text-gray-900">28 min</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Entregadores Ativos</span>
                <span className="text-2xl font-black text-emerald-600">{drivers.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase block">Raio Médio Coberto</span>
                <span className="text-2xl font-black text-blue-600">6.8 km</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
