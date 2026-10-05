import React, { useState } from 'react'
import {
  Tag,
  Plus,
  Trash,
  CheckCircle,
  XCircle,
  Clock,
  Ticket,
  X,
} from '@phosphor-icons/react'
import { useAdmin } from '@/context/AdminContext'
import { Coupon } from '@/types/admin'
import { formatCurrency } from '@/lib/utils'

export const CouponsView: React.FC = () => {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon } = useAdmin()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'porcentagem' as Coupon['type'],
    value: 10,
    minOrderValue: 30,
    maxUses: 100,
    expiresAt: '2026-12-31',
    isActive: true,
  })

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code.trim()) return

    addCoupon({
      code: formData.code.toUpperCase().trim(),
      description: formData.description,
      type: formData.type,
      value: Number(formData.value),
      minOrderValue: Number(formData.minOrderValue),
      maxUses: Number(formData.maxUses),
      expiresAt: formData.expiresAt,
      isActive: formData.isActive,
    })

    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Cupons & Campanhas Promocionais
          </h2>
          <p className="text-xs text-gray-500">
            Crie códigos de desconto em porcentagem ou valor fixo para estimular pedidos no Achou Food Canela.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              code: '',
              description: '',
              type: 'porcentagem',
              value: 10,
              minOrderValue: 30,
              maxUses: 200,
              expiresAt: '2026-12-31',
              isActive: true,
            })
            setIsModalOpen(true)
          }}
          className="px-4 py-2 rounded-xl bg-red-base hover:bg-red-dark text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-red-base/20"
        >
          <Plus size={16} weight="bold" />
          <span>Criar Novo Cupom</span>
        </button>
      </div>

      {/* Grid de Cupons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`p-5 rounded-2xl border transition-all space-y-4 bg-white ${
              coupon.isActive ? 'border-gray-200/90 shadow-2xs' : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-base/10 text-red-base flex items-center justify-center">
                  <Ticket size={20} weight="bold" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-900 font-mono tracking-wider">
                    {coupon.code}
                  </h3>
                  <span className="text-[10px] text-gray-400">
                    Vence em {coupon.expiresAt}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleCoupon(coupon.id)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                  coupon.isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {coupon.isActive ? 'Ativo' : 'Inativo'}
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed min-h-[36px]">
              {coupon.description}
            </p>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between font-semibold">
                <span>Benefício:</span>
                <span className="text-red-base font-bold">
                  {coupon.type === 'porcentagem' ? `${coupon.value}% OFF` : `${formatCurrency(coupon.value)} OFF`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pedido Mínimo:</span>
                <span className="font-bold text-gray-800">{formatCurrency(coupon.minOrderValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Utilizações:</span>
                <span className="font-bold text-gray-800">
                  {coupon.usedCount} / {coupon.maxUses}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 pt-1">
              <button
                onClick={() => {
                  if (confirm(`Remover cupom "${coupon.code}"?`)) {
                    deleteCoupon(coupon.id)
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-base hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
              >
                <Trash size={15} />
                <span>Excluir</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Criar Cupom */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <h3 className="text-sm font-bold text-gray-900">Novo Código de Desconto</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Código do Cupom *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 uppercase font-mono font-bold outline-hidden focus:border-red-base"
                  placeholder="EX: CANELAFOOD20"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                  placeholder="Ex: R$ 20 de desconto em pedidos acima de R$ 80"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tipo de Desconto</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                  >
                    <option value="porcentagem">Porcentagem (%)</option>
                    <option value="fixo">Valor Fixo (R$)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Valor do Desconto *</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Pedido Mínimo (R$)</label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Limite de Usos</label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Data de Expiração</label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                />
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
                  Criar Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
