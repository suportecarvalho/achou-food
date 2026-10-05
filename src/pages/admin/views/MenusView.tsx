import React, { useState } from 'react'
import {
  Plus,
  MagnifyingGlass,
  PencilSimple,
  Trash,
  CheckCircle,
  XCircle,
  CurrencyDollar,
  BookOpen,
  X,
  Tag,
  Storefront,
} from '@phosphor-icons/react'
import { useAdmin } from '@/context/AdminContext'
import { MenuItem } from '@/types'
import { formatCurrency } from '@/lib/utils'

export const MenusView: React.FC = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability, restaurants } = useAdmin()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: 'Geral',
    restaurantId: restaurants[0]?.id || 'rest-doce-aroma',
    isAvailable: true,
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      description: '',
      price: 25.0,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      category: 'Pratos Principais',
      restaurantId: restaurants[0]?.id || 'rest-doce-aroma',
      isAvailable: true,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      category: item.category,
      restaurantId: item.restaurantId,
      isAvailable: item.isAvailable,
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      imageUrl: formData.imageUrl,
      category: formData.category,
      restaurantId: formData.restaurantId,
      isAvailable: formData.isAvailable,
    }

    if (editingItem) {
      updateMenuItem(editingItem.id, payload)
    } else {
      addMenuItem(payload)
    }

    setIsModalOpen(false)
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRest =
      selectedRestaurantId === 'todos' || item.restaurantId === selectedRestaurantId

    return matchesSearch && matchesRest
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Gestão de Cardápios & Itens
          </h2>
          <p className="text-xs text-gray-500">
            Cadastre novos produtos, gerencie preços, fotos e ative ou desative itens de todos os parceiros.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-red-base hover:bg-red-dark text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-red-base/20"
        >
          <Plus size={16} weight="bold" />
          <span>Novo Item no Cardápio</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar pratos, sobremesas, combos..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:border-red-base outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <Storefront size={16} className="text-gray-400" />
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:border-red-base outline-hidden"
            >
              <option value="todos">Todos os parceiros ({restaurants.length})</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Itens do Cardápio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const rest = restaurants.find((r) => r.id === item.restaurantId)

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col group hover:shadow-xs transition-shadow"
            >
              <div className="relative h-40 bg-gray-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white">
                  {item.category}
                </span>

                <button
                  onClick={() => toggleMenuItemAvailability(item.id)}
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs cursor-pointer ${
                    item.isAvailable
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-base text-white'
                  }`}
                >
                  {item.isAvailable ? 'Disponível' : 'Esgotado'}
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 block truncate">
                    {rest?.name || 'Parceiro Achou Food'}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm mt-0.5 line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-black text-gray-900">
                    {formatCurrency(item.price)}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Editar prato"
                    >
                      <PencilSimple size={16} weight="bold" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remover "${item.name}" do cardápio?`)) {
                          deleteMenuItem(item.id)
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-base hover:bg-red-50 transition-colors cursor-pointer"
                      title="Excluir prato"
                    >
                      <Trash size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Adicionar / Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <h3 className="text-sm font-bold text-gray-900">
                {editingItem ? 'Editar Item do Cardápio' : 'Novo Prato / Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Restaurante Pertencente *</label>
                <select
                  value={formData.restaurantId}
                  onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                >
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Nome do Item *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                  placeholder="Ex: Risoto de Pinhão da Serra"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Categoria *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                    placeholder="Ex: Sobremesas, Massas"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Descrição dos Ingredientes</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                  placeholder="Descreva detalhes, acompanhamentos..."
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">URL da Foto</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-hidden focus:border-red-base"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="rounded text-red-base focus:ring-red-base cursor-pointer"
                />
                <label htmlFor="availCheck" className="font-semibold text-gray-700 cursor-pointer">
                  Item disponível para pedidos agora
                </label>
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
                  {editingItem ? 'Salvar Alterações' : 'Cadastrar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
