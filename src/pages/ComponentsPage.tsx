import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  DeviceMobile,
  ChatDots,
  Plus,
  Minus,
  CreditCard,
  Gear,
  MagnifyingGlass,
  BookOpen,
  MapPin,
  PaperPlaneTilt,
  Storefront,
  ForkKnife,
  Trash,
  ClipboardText,
  Rows,
  MapTrifold,
  Check,
  Copy
} from '@phosphor-icons/react'
import { Header } from '@/components/layout/Header'
import { TabBar } from '@/components/layout/TabBar'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { ToggleList, ViewMode } from '@/components/ui/ToggleList'
import { RestaurantCard } from '@/components/cards/RestaurantCard'
import { ItemCard } from '@/components/cards/ItemCard'
import { AchouLogo } from '@/components/common/AchouLogo'
import { Restaurant, MenuItem } from '@/types'

export const ComponentsPage: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const [toggleState, setToggleState] = useState<ViewMode>('list')
  const [tagSelected, setTagSelected] = useState<boolean>(true)
  const [itemQuantity, setItemQuantity] = useState<number>(0)
  const [addedItemQuantity, setAddedItemQuantity] = useState<number>(1)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedHex(text)
    setTimeout(() => setCopiedHex(null), 1500)
  }

  const sampleRestaurant: Restaurant = {
    id: 'rest-showcase',
    name: 'Cafeteria das Nuvens',
    description: 'Especializada em cafés artesanais, bolos fofos e cupcakes decorados.',
    address: 'Avenida das Árvores, 655',
    neighborhood: 'Bairro Encantado',
    categoryId: 'cafes',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=160&q=80',
    rating: 4.9,
    reviewCount: 154,
    deliveryTime: '20-30 min',
    deliveryFee: 4.90,
    isOpen: true,
    latitude: -23.55052,
    longitude: -46.633308,
  }

  const sampleItem: MenuItem = {
    id: 'item-showcase',
    restaurantId: 'rest-showcase',
    name: 'Cupcake de morango',
    description: 'Massa fofa de baunilha com recheio cremoso e cobertura leve.',
    price: 12.90,
    imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=400&q=80',
    category: 'Doces',
    isAvailable: true,
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      <Header showSearch={false} />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Page Title */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <span className="text-label-xs uppercase tracking-wider font-bold text-red-base">
              Design System Spec
            </span>
            <h1 className="text-3xl font-extrabold text-gray-600 mt-1">
              Estilos & Componentes
            </h1>
            <p className="text-body-sm text-gray-400 mt-1">
              Guia completo e documentação viva dos componentes oficiais do Achou Food.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-600 hover:text-red-base rounded-full border border-gray-200 text-label-xs font-semibold shadow-sm transition-colors"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Voltar ao App</span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* SEÇÃO 1: CORES (IMAGE 1) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-2xl font-bold text-gray-600">Cores</h2>
            <p className="text-body-xs text-gray-400">Tokens da paleta oficial (clique no swatch para copiar o HEX)</p>
          </div>

          {/* Brand */}
          <div>
            <h3 className="text-title-sm font-semibold text-gray-500 mb-3">Brand</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { hex: '#EA1D2C', name: 'red-base', bg: 'bg-[#EA1D2C]', text: 'text-white' },
                { hex: '#B81723', name: 'red-dark', bg: 'bg-[#B81723]', text: 'text-white' },
                { hex: '#E82933 30%', name: 'red-transparent_30', bg: 'bg-[#E82933]/30', text: 'text-gray-600' },
              ].map((c) => (
                <div
                  key={c.name}
                  onClick={() => copyToClipboard(c.hex)}
                  className="cursor-pointer group flex flex-col"
                >
                  <div className={`h-16 rounded-xl ${c.bg} transition-transform group-hover:scale-98 shadow-sm flex items-center justify-center`}>
                    {copiedHex === c.hex && <Check size={20} className={c.text} />}
                  </div>
                  <span className="text-label-xs font-bold text-gray-600 mt-2">{c.hex}</span>
                  <span className="text-label-2xs text-gray-400 font-mono">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <h3 className="text-title-sm font-semibold text-gray-500 mb-3">Feedback</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { hex: '#069F62', name: 'success-base', bg: 'bg-[#069F62]', text: 'text-white' },
                { hex: '#069F62 20%', name: 'success-transparent_20', bg: 'bg-[#069F62]/20', text: 'text-gray-600' },
              ].map((c) => (
                <div
                  key={c.name}
                  onClick={() => copyToClipboard(c.hex)}
                  className="cursor-pointer group flex flex-col"
                >
                  <div className={`h-16 rounded-xl ${c.bg} shadow-sm flex items-center justify-center`}>
                    {copiedHex === c.hex && <Check size={20} className={c.text} />}
                  </div>
                  <span className="text-label-xs font-bold text-gray-600 mt-2">{c.hex}</span>
                  <span className="text-label-2xs text-gray-400 font-mono">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grayscale */}
          <div>
            <h3 className="text-title-sm font-semibold text-gray-500 mb-3">Grayscale</h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {[
                { hex: '#FAFAFA', name: 'gray-100', bg: 'bg-[#FAFAFA] border border-gray-200' },
                { hex: '#EBEBEB', name: 'gray-200', bg: 'bg-[#EBEBEB]' },
                { hex: '#E0DCDC', name: 'gray-300', bg: 'bg-[#E0DCDC]' },
                { hex: '#5C5656', name: 'gray-400', bg: 'bg-[#5C5656]' },
                { hex: '#423A3A', name: 'gray-500', bg: 'bg-[#423A3A]' },
                { hex: '#1F1818', name: 'gray-600', bg: 'bg-[#1F1818]' },
              ].map((c) => (
                <div
                  key={c.name}
                  onClick={() => copyToClipboard(c.hex)}
                  className="cursor-pointer group flex flex-col"
                >
                  <div className={`h-14 rounded-xl ${c.bg} shadow-sm flex items-center justify-center`} />
                  <span className="text-label-xs font-bold text-gray-600 mt-2">{c.hex}</span>
                  <span className="text-label-2xs text-gray-400 font-mono">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent & Gradient */}
          <div>
            <h3 className="text-title-sm font-semibold text-gray-500 mb-3">Transparent & Gradient</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { hex: '#DBDBDB 20%', name: 'gray-transparent_20', bg: 'bg-[#DBDBDB]/20 border border-gray-200' },
                { hex: '#F0F0F0 40%', name: 'gray-transparent_40', bg: 'bg-[#F0F0F0]/40 border border-gray-200' },
                { hex: '#F0F0F0 80%', name: 'gray-transparent_80', bg: 'bg-[#F0F0F0]/80 border border-gray-200' },
                { hex: 'white-gradient', name: 'linear-gradient(163deg)', bg: 'white-gradient-card border border-gray-200 shadow-inner' },
              ].map((c) => (
                <div
                  key={c.name}
                  onClick={() => copyToClipboard(c.hex)}
                  className="cursor-pointer group flex flex-col"
                >
                  <div className={`h-14 rounded-xl ${c.bg}`} />
                  <span className="text-label-xs font-bold text-gray-600 mt-2 truncate">{c.hex}</span>
                  <span className="text-label-2xs text-gray-400 font-mono truncate">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SEÇÃO 2: TIPOGRAFIA, ÍCONES & VETORES (IMAGE 2) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-8">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-600">Tipografia</h2>
              <p className="text-body-xs text-gray-400">Fonte Primária: <strong>Noto Sans</strong> (Google Fonts)</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-500 text-label-2xs rounded-full border border-gray-200">
              Google Fonts
            </span>
          </div>

          {/* Typography Scale Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead>
                <tr className="border-b border-gray-100 text-label-xs text-gray-400 uppercase">
                  <th className="py-2.5">Name</th>
                  <th className="py-2.5">Size</th>
                  <th className="py-2.5">Line Height</th>
                  <th className="py-2.5">Weight</th>
                  <th className="py-2.5">Exemplo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                <tr>
                  <td className="py-3 font-semibold">Title Lg</td>
                  <td>18px</td>
                  <td>140%</td>
                  <td>SemiBold</td>
                  <td><span className="text-title-lg text-gray-600 font-semibold">Achou Food Delivery</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">Title Md</td>
                  <td>16px</td>
                  <td>140%</td>
                  <td>SemiBold</td>
                  <td><span className="text-title-md text-gray-600 font-semibold">Cafeteria das Nuvens</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">Title Sm</td>
                  <td>14px</td>
                  <td>140%</td>
                  <td>SemiBold</td>
                  <td><span className="text-title-sm text-gray-600 font-semibold">Cupcake de morango</span></td>
                </tr>
                <tr>
                  <td className="py-3">Body Md</td>
                  <td>16px</td>
                  <td>140%</td>
                  <td>Regular</td>
                  <td><span className="text-body-md text-gray-500">Massa fofa de baunilha com recheio</span></td>
                </tr>
                <tr>
                  <td className="py-3">Body Sm</td>
                  <td>14px</td>
                  <td>140%</td>
                  <td>Regular</td>
                  <td><span className="text-body-sm text-gray-500">Avenida das Árvores, 655</span></td>
                </tr>
                <tr>
                  <td className="py-3">Body Xs</td>
                  <td>12px</td>
                  <td>140%</td>
                  <td>Regular</td>
                  <td><span className="text-body-xs text-gray-400">Tempo estimado: 20-30 min</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">LABEL XS</td>
                  <td>12px</td>
                  <td>140%</td>
                  <td>SemiBold</td>
                  <td><span className="text-label-xs font-semibold text-red-base uppercase">ADICIONAR</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">LABEL 2XS</td>
                  <td>10px</td>
                  <td>140%</td>
                  <td>SemiBold</td>
                  <td><span className="text-label-2xs font-semibold text-gray-400 uppercase">FECHADO</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Ícones */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-md font-bold text-gray-600">Ícones</h3>
              <span className="text-body-xs text-gray-400">Phosphor Icons</span>
            </div>
            <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200/60 text-gray-600">
              <DeviceMobile size={22} />
              <ChatDots size={22} />
              <Plus size={22} />
              <Minus size={22} />
              <CreditCard size={22} />
              <Gear size={22} />
              <MagnifyingGlass size={22} />
              <BookOpen size={22} />
              <MapPin size={22} />
              <PaperPlaneTilt size={22} />
              <Storefront size={22} />
              <ForkKnife size={22} />
              <ArrowLeft size={22} />
              <ArrowRight size={22} />
            </div>
          </div>

          {/* Vetores */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-title-md font-bold text-gray-600 mb-4">Vetores da Marca</h3>
            <div className="flex flex-wrap items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-200/60">
              {/* App Icon */}
              <div className="text-center">
                <AchouLogo variant="icon" size="xl" />
                <p className="text-label-2xs text-gray-400 mt-2 font-mono">App Icon</p>
              </div>

              {/* Full Brand Logo */}
              <div className="text-center">
                <AchouLogo variant="full" size="lg" />
                <p className="text-label-2xs text-gray-400 mt-2 font-mono">Logo Principal</p>
              </div>

              {/* Standalone Scooter Cloche */}
              <div className="text-center">
                <AchouLogo variant="scooter" size="lg" />
                <p className="text-label-2xs text-gray-400 mt-2 font-mono">Scooter Cloche</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SEÇÃO 3: COMPONENTES (IMAGE 3) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-10">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-2xl font-bold text-gray-600">Componentes</h2>
            <p className="text-body-xs text-gray-400">Implementação interativa fiel ao Figma / Imagem 3</p>
          </div>

          {/* 1. TabBar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-title-sm font-semibold text-gray-500">TabBar</h3>
              <span className="text-label-2xs text-gray-400 font-mono">Home & Order states</span>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-around gap-6">
              {/* State Home Active */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-tab-bar border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-red-base flex items-center justify-center">
                    <Storefront size={22} weight="fill" />
                  </div>
                  <div className="w-10 h-10 rounded-full text-gray-400 flex items-center justify-center">
                    <ClipboardText size={22} />
                  </div>
                </div>
                <span className="text-label-2xs text-gray-400 font-mono">Home (Ativo)</span>
              </div>

              {/* State Order Active */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-tab-bar border border-gray-200">
                  <div className="w-10 h-10 rounded-full text-gray-400 flex items-center justify-center">
                    <Storefront size={22} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-red-base flex items-center justify-center">
                    <ClipboardText size={22} weight="fill" />
                  </div>
                </div>
                <span className="text-label-2xs text-gray-400 font-mono">Order (Ativo)</span>
              </div>
            </div>
          </div>

          {/* 2. ToggleList */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-title-sm font-semibold text-gray-500">ToggleList</h3>
              <span className="text-label-2xs text-gray-400 font-mono">List vs Map</span>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-around gap-6">
              <div className="flex flex-col items-center gap-2">
                <ToggleList value="list" onChange={() => {}} />
                <span className="text-label-2xs text-gray-400 font-mono">List</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ToggleList value="map" onChange={() => {}} />
                <span className="text-label-2xs text-gray-400 font-mono">Map</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ToggleList value={toggleState} onChange={setToggleState} />
                <span className="text-label-2xs text-red-base font-mono">Interativo ({toggleState})</span>
              </div>
            </div>
          </div>

          {/* 3. Button */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-title-sm font-semibold text-gray-500">Button</h3>
              <span className="text-label-2xs text-gray-400 font-mono">Primary, Secondary & Icon</span>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-around gap-6">
              {/* Label Button Primary */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="primary"
                  icon={<ArrowLeft size={16} weight="bold" />}
                >
                  LABEL
                </Button>
                <span className="text-label-2xs text-gray-400 font-mono">Label Button Primary</span>
              </div>

              {/* Label Button Secondary */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="secondary"
                  icon={<ArrowLeft size={16} weight="bold" />}
                >
                  LABEL
                </Button>
                <span className="text-label-2xs text-gray-400 font-mono">Label Button Secondary</span>
              </div>

              {/* Icon Button Secondary */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="icon"
                  icon={<ArrowLeft size={18} weight="bold" />}
                />
                <span className="text-label-2xs text-gray-400 font-mono">Icon Button Secondary</span>
              </div>
            </div>
          </div>

          {/* 4. Tag */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-title-sm font-semibold text-gray-500">Tag</h3>
              <span className="text-label-2xs text-gray-400 font-mono">Default & Selected</span>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-around gap-6">
              <div className="flex flex-col items-center gap-2">
                <Tag label="LABEL" selected={false} />
                <span className="text-label-2xs text-gray-400 font-mono">Default</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Tag label="LABEL" selected={true} />
                <span className="text-label-2xs text-gray-400 font-mono">Selected</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Tag
                  label={tagSelected ? 'SELECIONADO (Clique)' : 'NÃO SELECIONADO (Clique)'}
                  selected={tagSelected}
                  onClick={() => setTagSelected(!tagSelected)}
                />
                <span className="text-label-2xs text-red-base font-mono">Interativo</span>
              </div>
            </div>
          </div>

          {/* 5. Restaurant Card */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-title-sm font-semibold text-gray-500">Restaurant Card</h3>
              <span className="text-label-2xs text-gray-400 font-mono">Default, Removable & Remove</span>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-6">
              {/* Default */}
              <div>
                <span className="text-label-2xs text-gray-400 font-mono block mb-1.5">Default</span>
                <RestaurantCard restaurant={sampleRestaurant} variant="default" />
              </div>

              {/* Removable with Remove button */}
              <div>
                <span className="text-label-2xs text-gray-400 font-mono block mb-1.5">Removable / Remove</span>
                <RestaurantCard
                  restaurant={sampleRestaurant}
                  variant="removable"
                  showRemoveButton={true}
                  onRemove={() => alert('Ação de remover disparada!')}
                />
              </div>
            </div>
          </div>

          {/* 6. Item (Dish Card) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-title-sm font-semibold text-gray-500">Item (Prato / Produto)</h3>
              <span className="text-label-2xs text-gray-400 font-mono">Not added vs Added</span>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-6">
              {/* Not added */}
              <div>
                <span className="text-label-2xs text-gray-400 font-mono block mb-1.5">Not added (com botão +)</span>
                <ItemCard
                  item={sampleItem}
                  controlledQuantity={itemQuantity}
                  onQuantityChange={setItemQuantity}
                />
              </div>

              {/* Added */}
              <div>
                <span className="text-label-2xs text-gray-400 font-mono block mb-1.5">Added (com seletor - 1 +)</span>
                <ItemCard
                  item={sampleItem}
                  controlledQuantity={addedItemQuantity}
                  onQuantityChange={setAddedItemQuantity}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <TabBar />
    </div>
  )
}
