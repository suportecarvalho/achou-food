import React, { useState } from 'react'
import {
  Gear,
  Check,
  ShieldCheck,
  MapPin,
  CurrencyDollar,
  Key,
  Bell,
  Plugs,
  Storefront,
} from '@phosphor-icons/react'
import { useAdmin } from '@/context/AdminContext'

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useAdmin()

  const [savedSuccess, setSavedSuccess] = useState(false)
  const [formData, setFormData] = useState({
    platformName: settings.platformName,
    supportEmail: settings.supportEmail,
    supportWhatsapp: settings.supportWhatsapp,
    defaultCommissionPercent: settings.defaultCommissionPercent,
    defaultDeliveryRadiusKm: settings.defaultDeliveryRadiusKm,
    baseDeliveryFee: settings.baseDeliveryFee,
    autoApproveRestaurants: settings.autoApproveRestaurants,
    mapboxToken: settings.mapboxToken,
    cityCenterName: settings.cityCenter.name,
    cityCenterLat: settings.cityCenter.lat,
    cityCenterLng: settings.cityCenter.lng,
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      platformName: formData.platformName,
      supportEmail: formData.supportEmail,
      supportWhatsapp: formData.supportWhatsapp,
      defaultCommissionPercent: Number(formData.defaultCommissionPercent),
      defaultDeliveryRadiusKm: Number(formData.defaultDeliveryRadiusKm),
      baseDeliveryFee: Number(formData.baseDeliveryFee),
      autoApproveRestaurants: formData.autoApproveRestaurants,
      mapboxToken: formData.mapboxToken,
      cityCenter: {
        name: formData.cityCenterName,
        lat: Number(formData.cityCenterLat),
        lng: Number(formData.cityCenterLng),
      },
    })

    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Configurações do Sistema
          </h2>
          <p className="text-xs text-gray-500">
            Ajuste parâmetros globais de taxas, comissões, integração com Mapbox e regras operacionais.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <Check size={16} weight="bold" />
            Configurações salvas com sucesso!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Seção 1: Dados da Plataforma */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Storefront size={20} className="text-red-base" weight="bold" />
            <h3 className="text-sm font-bold text-gray-900">Dados da Plataforma & Contato</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Nome da Plataforma</label>
              <input
                type="text"
                value={formData.platformName}
                onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">E-mail de Suporte</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">WhatsApp de Suporte</label>
              <input
                type="text"
                value={formData.supportWhatsapp}
                onChange={(e) => setFormData({ ...formData, supportWhatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Cidade Principal</label>
              <input
                type="text"
                value={formData.cityCenterName}
                onChange={(e) => setFormData({ ...formData, cityCenterName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
              />
            </div>
          </div>
        </div>

        {/* Seção 2: Taxas & Comissões */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <CurrencyDollar size={20} className="text-red-base" weight="bold" />
            <h3 className="text-sm font-bold text-gray-900">Taxas & Comissões Comerciais</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Comissão Padrão do Marketplace (%)</label>
              <input
                type="number"
                value={formData.defaultCommissionPercent}
                onChange={(e) => setFormData({ ...formData, defaultCommissionPercent: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Taxa Base de Entrega (R$)</label>
              <input
                type="number"
                step="0.5"
                value={formData.baseDeliveryFee}
                onChange={(e) => setFormData({ ...formData, baseDeliveryFee: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Raio Máximo de Entrega Padrão (km)</label>
              <input
                type="number"
                step="0.5"
                value={formData.defaultDeliveryRadiusKm}
                onChange={(e) => setFormData({ ...formData, defaultDeliveryRadiusKm: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoApproveRestaurants}
                onChange={(e) => setFormData({ ...formData, autoApproveRestaurants: e.target.checked })}
                className="rounded text-red-base focus:ring-red-base"
              />
              <span>Aprovar novos cadastros de estabelecimentos automaticamente</span>
            </label>
          </div>
        </div>

        {/* Seção 3: Mapbox & Geolocalização */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <MapPin size={20} className="text-red-base" weight="bold" />
            <h3 className="text-sm font-bold text-gray-900">Integração Cartográfica (Mapbox GL)</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Chave de Acesso Pública (Token Mapbox)</label>
              <input
                type="text"
                value={formData.mapboxToken}
                onChange={(e) => setFormData({ ...formData, mapboxToken: e.target.value })}
                placeholder="pk.eyJ1I..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base font-mono text-[11px]"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Utilizado para renderização 3D vetorial e roteamento de entregas dos clientes e parceiros.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Latitude Central (Canela)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.cityCenterLat}
                  onChange={(e) => setFormData({ ...formData, cityCenterLat: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Longitude Central (Canela)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.cityCenterLng}
                  onChange={(e) => setFormData({ ...formData, cityCenterLng: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seção 4: Administradores e Permissões */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <ShieldCheck size={20} className="text-red-base" weight="bold" />
            <h3 className="text-sm font-bold text-gray-900">Administradores e Níveis de Acesso</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <p className="font-bold text-gray-900">Administrador Geral (Stun Burger)</p>
                <p className="text-[11px] text-gray-500 font-mono">contatostunburger@gmail.com</p>
              </div>
              <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                Acesso Total (Super Admin)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <p className="font-bold text-gray-900">Operador Canela Delivery</p>
                <p className="text-[11px] text-gray-500">operacao@achoufood.com.br</p>
              </div>
              <span className="px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 text-[10px]">
                Operacional & Logística
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Salvar Geral */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-red-base hover:bg-red-dark text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-red-base/20"
          >
            Salvar Todas as Configurações
          </button>
        </div>
      </form>
    </div>
  )
}
