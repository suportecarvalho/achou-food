import React, { useState } from 'react'
import {
  Plus,
  MagnifyingGlass,
  Funnel,
  PencilSimple,
  Trash,
  CheckCircle,
  Prohibit,
  Eye,
  MapPin,
  Phone,
  WhatsappLogo,
  CurrencyDollar,
  Storefront,
  X,
  Check,
  Star,
} from '@phosphor-icons/react'
import { useAdmin } from '@/context/AdminContext'
import { AdminRestaurant, RestaurantStatus } from '@/types/admin'
import { formatCurrency } from '@/lib/utils'

interface RestaurantsViewProps {
  onNavigateToMap?: () => void
}

export const RestaurantsView: React.FC<RestaurantsViewProps> = ({ onNavigateToMap }) => {
  const {
    restaurants,
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
    approveRestaurant,
    blockRestaurant,
    toggleRestaurantStatus,
    globalSearch,
  } = useAdmin()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'todos' | RestaurantStatus>('todos')
  const [categoryFilter, setCategoryFilter] = useState<string>('todas')

  // Modais de Criação / Edição / Visualização
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRestaurant, setEditingRestaurant] = useState<AdminRestaurant | null>(null)
  const [viewingRestaurant, setViewingRestaurant] = useState<AdminRestaurant | null>(null)

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: '',
    categoryName: '',
    categoryId: 'geral',
    description: '',
    phone: '',
    whatsapp: '',
    address: '',
    neighborhood: '',
    city: 'Canela',
    latitude: -29.363,
    longitude: -50.807,
    openingHours: '11:00 às 23:00',
    deliveryRadiusKm: 7.0,
    deliveryFee: 5.0,
    minOrder: 20.0,
    commissionPercent: 12,
    status: 'ativo' as RestaurantStatus,
    imageUrl: '',
    pixKey: '',
    bankName: '',
  })

  const openCreateModal = () => {
    setEditingRestaurant(null)
    setFormData({
      name: '',
      categoryName: 'Restaurante & Delivery',
      categoryId: 'geral',
      description: '',
      phone: '(54) 3282-0000',
      whatsapp: '(54) 99999-0000',
      address: 'Rua Central, 100',
      neighborhood: 'Centro',
      city: 'Canela',
      latitude: -29.363,
      longitude: -50.807,
      openingHours: 'Terça a Domingo: 11:30 às 22:30',
      deliveryRadiusKm: 7.0,
      deliveryFee: 4.9,
      minOrder: 25.0,
      commissionPercent: 12,
      status: 'ativo',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      pixKey: '',
      bankName: 'Sicredi',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (rest: AdminRestaurant) => {
    setEditingRestaurant(rest)
    setFormData({
      name: rest.name,
      categoryName: rest.categoryName,
      categoryId: rest.categoryId,
      description: rest.description,
      phone: rest.phone,
      whatsapp: rest.whatsapp,
      address: rest.address,
      neighborhood: rest.neighborhood,
      city: rest.city,
      latitude: rest.latitude,
      longitude: rest.longitude,
      openingHours: rest.openingHours,
      deliveryRadiusKm: rest.deliveryRadiusKm,
      deliveryFee: rest.deliveryFee,
      minOrder: rest.minOrder,
      commissionPercent: rest.commissionPercent,
      status: rest.status,
      imageUrl: rest.imageUrl || '',
      pixKey: rest.bankInfo?.pixKey || '',
      bankName: rest.bankInfo?.bankName || 'Sicredi',
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const payload = {
      name: formData.name,
      categoryName: formData.categoryName,
      categoryId: formData.categoryId,
      description: formData.description,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      address: formData.address,
      neighborhood: formData.neighborhood,
      city: formData.city,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      openingHours: formData.openingHours,
      deliveryRadiusKm: Number(formData.deliveryRadiusKm),
      deliveryFee: Number(formData.deliveryFee),
      minOrder: Number(formData.minOrder),
      commissionPercent: Number(formData.commissionPercent),
      status: formData.status,
      imageUrl: formData.imageUrl,
      bankInfo: formData.pixKey
        ? {
            pixKey: formData.pixKey,
            bankName: formData.bankName,
            holderName: formData.name,
          }
        : undefined,
      rating: editingRestaurant ? editingRestaurant.rating : 5.0,
    }

    if (editingRestaurant) {
      updateRestaurant(editingRestaurant.id, payload)
    } else {
      addRestaurant(payload)
    }

    setIsModalOpen(false)
  }

  const effectiveSearch = (searchTerm || globalSearch).toLowerCase().trim()

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(effectiveSearch) ||
      r.categoryName.toLowerCase().includes(effectiveSearch) ||
      r.neighborhood.toLowerCase().includes(effectiveSearch) ||
      r.address.toLowerCase().includes(effectiveSearch)

    const matchesStatus = statusFilter === 'todos' || r.status === statusFilter
    const matchesCategory = categoryFilter === 'todas' || r.categoryId === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const categories = Array.from(new Set(restaurants.map((r) => r.categoryName)))

  return (
    <div className="space-y-6">
      {/* Barra Superior: Título, Filtros Rápidos e Botão Novo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Gerenciamento de Estabelecimentos
          </h2>
          <p className="text-xs text-gray-500">
            Cadastre, edite, aprove ou gerencie os restaurantes e comércios parceiros de Canela.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToMap && (
            <button
              onClick={onNavigateToMap}
              className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-red-base hover:border-red-base/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <MapPin size={16} weight="bold" className="text-red-base" />
              <span>Ver no Mapa</span>
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-red-base hover:bg-red-dark text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-red-base/20"
          >
            <Plus size={16} weight="bold" />
            <span>Novo Estabelecimento</span>
          </button>
        </div>
      </div>

      {/* Controles de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Campo de Busca */}
          <div className="relative">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, bairro, categoria..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:border-red-base focus:ring-2 focus:ring-red-base/20 outline-hidden transition-all"
            />
          </div>

          {/* Filtro por Status */}
          <div className="flex items-center gap-1.5 bg-gray-50/70 p-1 rounded-xl border border-gray-200 text-xs">
            <button
              onClick={() => setStatusFilter('todos')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-colors cursor-pointer text-center ${
                statusFilter === 'todos' ? 'bg-white shadow-2xs text-gray-900' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Todos ({restaurants.length})
            </button>
            <button
              onClick={() => setStatusFilter('ativo')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-colors cursor-pointer text-center ${
                statusFilter === 'ativo' ? 'bg-emerald-50 text-emerald-800 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Ativos ({restaurants.filter((r) => r.status === 'ativo').length})
            </button>
            <button
              onClick={() => setStatusFilter('pendente')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-colors cursor-pointer text-center ${
                statusFilter === 'pendente' ? 'bg-amber-50 text-amber-800 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Pendentes ({restaurants.filter((r) => r.status === 'pendente').length})
            </button>
            <button
              onClick={() => setStatusFilter('bloqueado')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-colors cursor-pointer text-center ${
                statusFilter === 'bloqueado' ? 'bg-red-50 text-red-base shadow-2xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Bloqueados ({restaurants.filter((r) => r.status === 'bloqueado').length})
            </button>
          </div>

          {/* Filtro por Categoria */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:border-red-base outline-hidden text-gray-700 cursor-pointer"
            >
              <option value="todas">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Estabelecimentos */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Estabelecimento</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Contato</th>
                <th className="py-3.5 px-4">Localização (GPS)</th>
                <th className="py-3.5 px-4">Taxa / Raio</th>
                <th className="py-3.5 px-4">Comissão</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRestaurants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    Nenhum estabelecimento encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredRestaurants.map((rest) => {
                  return (
                    <tr key={rest.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Logo + Nome */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={rest.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80'}
                            alt={rest.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate">{rest.name}</p>
                            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                              <Star size={12} weight="fill" />
                              <span>{rest.rating.toFixed(1)}</span>
                              <span className="text-gray-400 font-normal">({rest.ordersCount} pedidos)</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Categoria */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-semibold">
                          {rest.categoryName}
                        </span>
                      </td>

                      {/* Contato */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="text-gray-700 font-medium flex items-center gap-1">
                            <Phone size={12} className="text-gray-400" />
                            {rest.phone}
                          </p>
                          <p className="text-emerald-700 font-medium flex items-center gap-1">
                            <WhatsappLogo size={12} weight="fill" className="text-emerald-500" />
                            {rest.whatsapp}
                          </p>
                        </div>
                      </td>

                      {/* Localização GPS */}
                      <td className="py-3 px-4">
                        <div className="max-w-[180px]">
                          <p className="text-gray-800 font-medium truncate" title={rest.address}>
                            {rest.address}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {rest.latitude.toFixed(4)}, {rest.longitude.toFixed(4)}
                          </p>
                        </div>
                      </td>

                      {/* Taxa / Raio */}
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-bold text-gray-900">{formatCurrency(rest.deliveryFee)}</p>
                          <p className="text-[10px] text-gray-400">Raio: {rest.deliveryRadiusKm} km</p>
                        </div>
                      </td>

                      {/* Comissão */}
                      <td className="py-3 px-4 font-bold text-gray-800">
                        {rest.commissionPercent}%
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleRestaurantStatus(rest.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            rest.status === 'ativo'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : rest.status === 'pendente'
                              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              : 'bg-red-50 text-red-base border-red-200 hover:bg-red-100'
                          }`}
                          title="Clique para alternar status"
                        >
                          {rest.status === 'ativo' ? 'Ativo' : rest.status === 'pendente' ? 'Pendente' : 'Bloqueado'}
                        </button>
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {rest.status === 'pendente' && (
                            <button
                              onClick={() => approveRestaurant(rest.id)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                              title="Aprovar estabelecimento"
                            >
                              <Check size={16} weight="bold" />
                            </button>
                          )}

                          <button
                            onClick={() => setViewingRestaurant(rest)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Visualizar detalhes"
                          >
                            <Eye size={16} weight="bold" />
                          </button>

                          <button
                            onClick={() => openEditModal(rest)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Editar estabelecimento"
                          >
                            <PencilSimple size={16} weight="bold" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Deseja realmente remover o parceiro "${rest.name}"?`)) {
                                deleteRestaurant(rest.id)
                              }
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-base hover:bg-red-50 transition-colors cursor-pointer"
                            title="Excluir estabelecimento"
                          >
                            <Trash size={16} weight="bold" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <h3 className="text-sm font-bold text-gray-900">
                {editingRestaurant ? 'Editar Estabelecimento' : 'Novo Estabelecimento Parceiro'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nome Fantasia do Estabelecimento *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                    placeholder="Ex: Confeitaria Doce Serra"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                    placeholder="Ex: Pizzarias, Hamburguerias, Doces"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Status da Parceria
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as RestaurantStatus })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                  >
                    <option value="ativo">Ativo na Plataforma</option>
                    <option value="pendente">Pendente de Aprovação</option>
                    <option value="bloqueado">Bloqueado / Suspenso</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Descrição Curta / Especialidade
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                    placeholder="Breve descrição dos pratos e estilo gastronômico..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Telefone Fixo</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                    placeholder="(54) 3282-0000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp de Pedidos</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                    placeholder="(54) 99999-0000"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                    placeholder="Rua, Número, Bairro, Canela - RS"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Bairro</label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                    placeholder="Ex: Centro"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Horário de Atendimento</label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                    placeholder="Ex: Diariamente: 18:00 às 23:30"
                  />
                </div>

                {/* Coordenadas GPS */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Latitude (Mapbox)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                    placeholder="-29.3630"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Longitude (Mapbox)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                    placeholder="-50.8070"
                  />
                </div>

                {/* Parâmetros de Entrega & Financeiro */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Área / Raio de Entrega (km)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.deliveryRadiusKm}
                    onChange={(e) => setFormData({ ...formData, deliveryRadiusKm: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Taxa Padrão de Entrega (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pedido Mínimo (R$)</label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Comissão da Plataforma (%)</label>
                  <input
                    type="number"
                    value={formData.commissionPercent}
                    onChange={(e) => setFormData({ ...formData, commissionPercent: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">URL da Imagem / Foto</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Chave PIX Repasse</label>
                  <input
                    type="text"
                    value={formData.pixKey}
                    onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                    placeholder="CNPJ, E-mail ou Celular"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Banco / Cooperativa</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-red-base outline-hidden"
                    placeholder="Ex: Sicredi, Banrisul, Banco do Brasil"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-base hover:bg-red-dark rounded-xl cursor-pointer shadow-sm shadow-red-base/20"
                >
                  {editingRestaurant ? 'Atualizar Estabelecimento' : 'Cadastrar Estabelecimento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Visualização Rápida */}
      {viewingRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="relative h-36 bg-gray-900">
              <img
                src={viewingRestaurant.imageUrl}
                alt={viewingRestaurant.name}
                className="w-full h-full object-cover opacity-80"
              />
              <button
                onClick={() => setViewingRestaurant(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">{viewingRestaurant.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    {viewingRestaurant.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{viewingRestaurant.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 font-bold block text-[10px] uppercase">Categoria</span>
                  <span className="font-semibold text-gray-800">{viewingRestaurant.categoryName}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block text-[10px] uppercase">Horário</span>
                  <span className="font-semibold text-gray-800">{viewingRestaurant.openingHours}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block text-[10px] uppercase">Taxa de Entrega</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(viewingRestaurant.deliveryFee)}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block text-[10px] uppercase">Comissão</span>
                  <span className="font-semibold text-gray-800">{viewingRestaurant.commissionPercent}%</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 font-bold block text-[10px] uppercase">Endereço</span>
                  <span className="font-semibold text-gray-800">{viewingRestaurant.address} - Canela/RS</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    const r = viewingRestaurant
                    setViewingRestaurant(null)
                    openEditModal(r)
                  }}
                  className="px-4 py-2 bg-red-base hover:bg-red-dark text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Editar Dados
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
