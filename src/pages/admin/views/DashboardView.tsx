import React from 'react'
import {
  Receipt,
  CurrencyDollar,
  Storefront,
  Users,
  Motorcycle,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Warning,
  Eye,
  Check,
  X,
  CaretRight,
} from '@phosphor-icons/react'
import { useAdmin } from '@/context/AdminContext'
import { formatCurrency } from '@/lib/utils'

interface DashboardViewProps {
  onNavigate: (tab: string) => void
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const {
    orders,
    restaurants,
    customers,
    drivers,
    approveRestaurant,
    blockRestaurant,
  } = useAdmin()

  // Métricas
  const totalOrdersCount = orders.length
  const todayRevenue = orders
    .filter((o) => o.status !== 'cancelado')
    .reduce((acc, curr) => acc + curr.totalAmount, 0)
  const activeRestaurants = restaurants.filter((r) => r.status === 'ativo')
  const pendingRestaurants = restaurants.filter((r) => r.status === 'pendente')
  const activeDeliveries = orders.filter((o) => o.status === 'entrega' || o.status === 'pronto')
  const availableDrivers = drivers.filter((d) => d.status === 'disponivel')
  const busyDrivers = drivers.filter((d) => d.status === 'em_rota')

  const recentOrders = orders.slice(0, 5)

  // Status badge config
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'novos':
        return { label: 'Novo', bg: 'bg-red-50 text-red-base border-red-200' }
      case 'confirmados':
        return { label: 'Confirmado', bg: 'bg-blue-50 text-blue-700 border-blue-200' }
      case 'preparo':
        return { label: 'Em Preparo', bg: 'bg-amber-50 text-amber-700 border-amber-200' }
      case 'pronto':
        return { label: 'Pronto p/ Entrega', bg: 'bg-purple-50 text-purple-700 border-purple-200' }
      case 'entrega':
        return { label: 'Em Rota', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
      case 'entregue':
        return { label: 'Entregue', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
      default:
        return { label: status, bg: 'bg-gray-100 text-gray-700 border-gray-200' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner de Boas-Vindas Operacional */}
      <div className="bg-gradient-to-r from-red-dark via-red-base to-red-darker text-white rounded-2xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold mb-3 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Operação Canela em tempo real</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            Painel Geral do Achou Food
          </h2>
          <p className="text-sm text-red-100/90 mt-1 leading-relaxed">
            Acompanhe pedidos, novos restaurantes parceiros, logística de entregas e métricas financeiras centralizadas.
          </p>
        </div>

        {/* Efeito visual de fundo */}
        <div className="absolute -right-8 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 -top-12 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 5 Cards de Estatísticas Principais (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Pedidos Hoje */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Pedidos Hoje
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-base flex items-center justify-center">
              <Receipt size={20} weight="bold" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900">{totalOrdersCount}</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight size={13} weight="bold" /> +18%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">vs. mesmo dia semana passada</p>
        </div>

        {/* Faturamento Hoje */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Faturamento Hoje
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CurrencyDollar size={20} weight="bold" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900">{formatCurrency(todayRevenue)}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Volume bruto transacionado</p>
        </div>

        {/* Estabelecimentos Ativos */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Lojas Ativas
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Storefront size={20} weight="bold" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900">{activeRestaurants.length}</span>
            <span className="text-xs text-gray-400 font-semibold">/ {restaurants.length} cadastradas</span>
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
            {pendingRestaurants.length > 0 ? `${pendingRestaurants.length} pendente(s) de aprovação` : 'Todas aprovadas'}
          </p>
        </div>

        {/* Clientes Cadastrados */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Clientes Ativos
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users size={20} weight="bold" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900">{customers.length}</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight size={13} weight="bold" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Base na Serra Gaúcha</p>
        </div>

        {/* Entregas em Andamento */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Entregas no Momento
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Motorcycle size={20} weight="bold" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900">{activeDeliveries.length}</span>
            <span className="text-xs text-emerald-600 font-bold">{busyDrivers.length} motoboy(s) em rota</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Tempo médio: 28 min</p>
        </div>
      </div>

      {/* Gráficos Operacionais (SVG Puro e Responsivo) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pedidos nas Últimas Horas */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Distribuição de Pedidos Hoje</h3>
              <p className="text-xs text-gray-500">Volume de solicitações por horário em Canela</p>
            </div>
            <span className="px-2.5 py-1 bg-red-50 text-red-base text-[11px] font-bold rounded-lg">
              Pico: 12h - 14h / 19h - 21h
            </span>
          </div>

          <div className="h-52 w-full flex items-end gap-2 pt-6 pb-2">
            {[
              { label: '09h', val: 12, height: '24%' },
              { label: '10h', val: 18, height: '36%' },
              { label: '11h', val: 32, height: '64%' },
              { label: '12h', val: 48, height: '95%', isPeak: true },
              { label: '13h', val: 44, height: '88%' },
              { label: '14h', val: 26, height: '52%' },
              { label: '15h', val: 16, height: '32%' },
              { label: '16h', val: 20, height: '40%' },
              { label: '17h', val: 28, height: '56%' },
              { label: '18h', val: 38, height: '76%' },
              { label: '19h', val: 50, height: '100%', isPeak: true },
              { label: '20h', val: 46, height: '92%' },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {col.val}
                </div>
                <div
                  style={{ height: col.height }}
                  className={`w-full rounded-t-md transition-all group-hover:scale-y-105 origin-bottom ${
                    col.isPeak ? 'bg-red-base shadow-xs shadow-red-base/40' : 'bg-red-200/80 group-hover:bg-red-300'
                  }`}
                />
                <span className="text-[10px] text-gray-400 font-medium">{col.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Faturamento dos Últimos 7 Dias */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Faturamento da Semana (R$)</h3>
              <p className="text-xs text-gray-500">Evolução diária das vendas na plataforma</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-gray-900">Total: R$ 24.850,00</span>
            </div>
          </div>

          {/* SVG Line / Area chart */}
          <div className="h-52 w-full pt-4 flex flex-col justify-end">
            <svg viewBox="0 0 500 160" className="w-full h-36 overflow-visible">
              <defs>
                <linearGradient id="revenueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8F141F" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8F141F" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />

              {/* Area */}
              <polygon
                points="10,130 80,105 160,115 240,75 320,60 400,40 480,20 480,150 10,150"
                fill="url(#revenueGrad)"
              />
              {/* Line */}
              <polyline
                points="10,130 80,105 160,115 240,75 320,60 400,40 480,20"
                fill="none"
                stroke="#8F141F"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Circles */}
              {[
                { x: 10, y: 130, val: '2.1k' },
                { x: 80, y: 105, val: '2.8k' },
                { x: 160, y: 115, val: '2.5k' },
                { x: 240, y: 75, val: '3.6k' },
                { x: 320, y: 60, val: '4.1k' },
                { x: 400, y: 40, val: '4.8k' },
                { x: 480, y: 20, val: '5.2k' },
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  className="fill-white stroke-red-base stroke-[3]"
                />
              ))}
            </svg>

            {/* Labels dos dias */}
            <div className="flex justify-between text-[11px] text-gray-500 font-semibold px-2 mt-2">
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
              <span>Hoje (Dom)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Inferior: Pedidos Recentes + Estabelecimentos Pendentes + Resumo Entregas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Pedidos Recentes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Últimos Pedidos em Operação</h3>
              <p className="text-xs text-gray-500">Pedidos que deram entrada recentemente no sistema</p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-bold text-red-base hover:text-red-dark flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Kanban Completo</span>
              <CaretRight size={14} weight="bold" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Código</th>
                  <th className="pb-3">Estabelecimento</th>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => {
                  const badge = getStatusBadge(order.status)
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 font-bold text-gray-900">{order.id}</td>
                      <td className="py-3 text-gray-700 font-medium">{order.restaurantName}</td>
                      <td className="py-3 text-gray-600">{order.customerName}</td>
                      <td className="py-3 font-bold text-gray-900">{formatCurrency(order.totalAmount)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onNavigate('orders')}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-base text-gray-700 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Gerenciar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coluna 3: Estabelecimentos Pendentes & Logística */}
        <div className="space-y-6">
          {/* Card Estabelecimentos Pendentes */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Storefront size={18} className="text-amber-500" weight="bold" />
                <h3 className="text-sm font-bold text-gray-900">Aprovações Pendentes</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {pendingRestaurants.length}
              </span>
            </div>

            {pendingRestaurants.length === 0 ? (
              <div className="p-4 text-center rounded-xl bg-gray-50 text-gray-500 text-xs">
                <CheckCircle size={24} className="mx-auto text-emerald-500 mb-1" weight="fill" />
                Nenhum estabelecimento aguardando aprovação no momento.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRestaurants.map((rest) => (
                  <div key={rest.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{rest.name}</h4>
                        <p className="text-[11px] text-gray-500">{rest.categoryName} • {rest.neighborhood}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-gray-400">
                        {rest.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => approveRestaurant(rest.id)}
                        className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Check size={13} weight="bold" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => blockRestaurant(rest.id)}
                        className="py-1.5 px-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Rejeitar / Bloquear"
                      >
                        <X size={13} weight="bold" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card Resumo das Entregas */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Motorcycle size={18} className="text-red-base" weight="bold" />
                <h3 className="text-sm font-bold text-gray-900">Frota & Entregas</h3>
              </div>
              <button
                onClick={() => onNavigate('deliveries')}
                className="text-[11px] font-bold text-red-base hover:underline cursor-pointer"
              >
                Gerenciar
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-emerald-800 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Entregadores Disponíveis
                </span>
                <span className="font-bold text-emerald-900">{availableDrivers.length}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="text-amber-800 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Entregadores em Rota
                </span>
                <span className="font-bold text-amber-900">{busyDrivers.length}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-600 font-semibold">Pedidos prontos para despacho</span>
                <span className="font-bold text-gray-900">
                  {orders.filter((o) => o.status === 'pronto').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
