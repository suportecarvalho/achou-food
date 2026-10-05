import React, { useState } from 'react'
import {
  CurrencyDollar,
  Receipt,
  TrendUp,
  DownloadSimple,
  Calendar,
  CreditCard,
  QrCode,
  Money,
  CheckCircle,
  Building,
} from '@phosphor-icons/react'
import { useAdmin } from '@/context/AdminContext'
import { formatCurrency } from '@/lib/utils'

export const FinanceView: React.FC = () => {
  const { orders, restaurants } = useAdmin()

  const [dateRange, setDateRange] = useState<'hoje' | 'semana' | 'mes' | 'todos'>('mes')

  // Total de Faturamento Bruto
  const totalGrossRevenue = orders
    .filter((o) => o.status !== 'cancelado')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  // Total de Taxas de Entrega arrecadadas
  const totalDeliveryFees = orders
    .filter((o) => o.status !== 'cancelado')
    .reduce((sum, o) => sum + o.deliveryFee, 0)

  // Comissões Totais do Marketplace Achou Food
  const totalCommissions = orders
    .filter((o) => o.status !== 'cancelado')
    .reduce((sum, o) => sum + o.commissionAmount, 0)

  // Líquido a repassar aos parceiros (Subtotal - Comissões)
  const totalToPayRestaurants = orders
    .filter((o) => o.status !== 'cancelado')
    .reduce((sum, o) => sum + (o.subtotal - o.commissionAmount), 0)

  // Cálculos por parceiro
  const partnersPayout = restaurants.map((rest) => {
    const restOrders = orders.filter(
      (o) => o.restaurantId === rest.id && o.status !== 'cancelado'
    )
    const gross = restOrders.reduce((sum, o) => sum + o.subtotal, 0)
    const commission = restOrders.reduce((sum, o) => sum + o.commissionAmount, 0)
    const netPayout = gross - commission

    return {
      restaurant: rest,
      ordersCount: restOrders.length,
      gross,
      commission,
      netPayout,
    }
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Gestão Financeira & Fechamento de Repasses
          </h2>
          <p className="text-xs text-gray-500">
            Acompanhe o fluxo de caixa, apuração das comissões do Achou Food e repasses aos parceiros de Canela.
          </p>
        </div>

        {/* Filtro Período */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 text-xs">
          {(['hoje', 'semana', 'mes', 'todos'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`py-1.5 px-3 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
                dateRange === r ? 'bg-red-base text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {r === 'mes' ? 'Este Mês' : r === 'semana' ? 'Esta Semana' : r === 'hoje' ? 'Hoje' : 'Histórico Completo'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Cards Financeiros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faturamento Bruto */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Faturamento Bruto
          </span>
          <div className="mt-2 text-2xl font-black text-gray-900">
            {formatCurrency(totalGrossRevenue)}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{orders.length} pedidos transacionados</p>
        </div>

        {/* Comissão Achou Food */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
            Comissão Achou Food (10% - 15%)
          </span>
          <div className="mt-2 text-2xl font-black text-emerald-600">
            {formatCurrency(totalCommissions)}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Receita da plataforma retida</p>
        </div>

        {/* Valores a Repassar */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
            Valores a Repassar às Lojas
          </span>
          <div className="mt-2 text-2xl font-black text-blue-600">
            {formatCurrency(totalToPayRestaurants)}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Líquido de produtos (sem frete)</p>
        </div>

        {/* Taxas de Entrega */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
            Taxas de Entrega / Motoboys
          </span>
          <div className="mt-2 text-2xl font-black text-amber-600">
            {formatCurrency(totalDeliveryFees)}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Destinado à logística</p>
        </div>
      </div>

      {/* Tabela de Repasses por Estabelecimento */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Conciliação & Repasse por Estabelecimento
            </h3>
            <p className="text-xs text-gray-500">
              Valores calculados sobre os pedidos concluídos de cada parceiro
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Estabelecimento</th>
                <th className="py-3 px-4">Chave PIX / Banco</th>
                <th className="py-3 px-4 text-center">Pedidos</th>
                <th className="py-3 px-4 text-right">Vendas Brutas</th>
                <th className="py-3 px-4 text-right">Taxa Achou (%)</th>
                <th className="py-3 px-4 text-right">Comissão Retida</th>
                <th className="py-3 px-4 text-right">Líquido a Pagar</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {partnersPayout.map((item) => (
                <tr key={item.restaurant.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-gray-900">{item.restaurant.name}</p>
                    <span className="text-[10px] text-gray-400">{item.restaurant.categoryName}</span>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-mono text-gray-700 font-semibold">
                      {item.restaurant.bankInfo?.pixKey || 'Não cadastrada'}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      {item.restaurant.bankInfo?.bankName || 'Sicredi'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-gray-700">
                    {item.ordersCount}
                  </td>

                  <td className="py-3 px-4 text-right font-semibold text-gray-900">
                    {formatCurrency(item.gross)}
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-gray-500">
                    {item.restaurant.commissionPercent}%
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-red-base">
                    -{formatCurrency(item.commission)}
                  </td>

                  <td className="py-3 px-4 text-right font-black text-emerald-600 text-sm">
                    {formatCurrency(item.netPayout)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Conciliado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
