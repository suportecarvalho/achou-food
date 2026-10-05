import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Receipt,
  Minus,
  Plus,
  Trash,
  Storefront,
  MapPin,
  CheckCircle,
  Money,
  CreditCard,
  ArrowLeft,
  ShoppingBag,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { TabBar } from '@/components/layout/TabBar'
import { DesktopNavbar } from '@/components/layout/DesktopNavbar'
import { DesktopFooter } from '@/components/layout/DesktopFooter'
import { DeliveryAddressModal } from '@/components/modals/DeliveryAddressModal'
import { RestaurantBadge } from '@/components/common/RestaurantBadge'
import { useCart } from '@/context/CartContext'
import { apiService } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

export const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const { items, totalCount, subtotal, updateQuantity, clearCart } = useCart()
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [currentAddress, setCurrentAddress] = useState<string>(() => {
    return localStorage.getItem('achou_food_delivery_address') || 'Av. das Estrelas, 567 - Canela, RS'
  })
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  const handleConfirmOrder = async () => {
    if (items.length === 0) {
      toast.error('Sua sacola está vazia.')
      return
    }

    setIsSubmitting(true)
    try {
      const order = await apiService.createOrder({
        restaurantId: currentRestaurant.id,
        restaurantName: currentRestaurant.name,
        restaurantLogo: currentRestaurant.logoUrl || '',
        totalAmount: subtotal + deliveryFee,
        deliveryFee: deliveryFee,
        status: 'received',
        deliveryAddress: currentAddress,
        paymentMethod: 'credit_card',
        customerName: 'Cliente Canela',
        customerPhone: '(54) 99999-9999',
        note: note.trim() || undefined,
        items: items.map((i) => ({
          id: `item-${i.menuItem.id}-${Date.now()}`,
          menuItemId: i.menuItem.id,
          itemName: i.menuItem.name,
          quantity: i.quantity,
          unitPrice: i.menuItem.price,
          totalPrice: i.menuItem.price * i.quantity,
        })),
      })

      clearCart()
      toast.success('Pedido enviado com sucesso para a cozinha!')
      navigate('/orders', { state: { newOrderId: order.id } })
    } catch (err: any) {
      toast.error('Erro ao registrar pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentRestaurant = items[0]?.restaurant || {
    id: 'rest-doce-aroma',
    name: 'Doce Aroma',
    address: 'Rua das Palmeiras, 321',
    neighborhood: 'Vila dos Aromas',
  }

  const deliveryFee = 4.90
  const totalAmount = subtotal + deliveryFee

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-red-base/20 selection:text-red-base">
      {/* ========================================================================= */}
      {/* 1. VERSÃO DESKTOP (MD E SUPERIORES) - CHECKOUT MODERNO DE DUAS COLUNAS */}
      {/* ========================================================================= */}
      <div className="hidden md:flex flex-col min-h-screen w-full">
        <DesktopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentAddress={currentAddress}
          onOpenAddressModal={() => setIsAddressModalOpen(true)}
          showViewToggle={false}
        />

        <main className="max-w-6xl mx-auto px-6 lg:px-8 py-10 w-full flex-1 flex flex-col">
          {/* Header da Página Desktop */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200/80 mb-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 hover:border-red-300 hover:text-red-base flex items-center justify-center text-gray-600 transition-all shadow-xs"
                title="Voltar"
              >
                <ArrowLeft size={18} weight="bold" />
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                  <span>Finalizar Pedido</span>
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Revise seus itens e confirme a entrega
                </p>
              </div>
            </div>

            <Link
              to="/"
              className="text-xs font-bold text-red-base hover:underline"
            >
              Continuar comprando
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center max-w-lg mx-auto shadow-xs my-8">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-base flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={32} weight="bold" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Sua sacola está vazia
              </h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Explore os restaurantes de Canela e adicione itens deliciosos à sua sacola!
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-base hover:bg-red-dark text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95"
              >
                <Storefront size={18} weight="bold" />
                <span>Explorar Cardápios</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* COLUNA ESQUERDA (7 colunas): Restaurante + Itens + Observação */}
              <div className="lg:col-span-7 space-y-6">
                {/* Card do Restaurante */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-3">
                    Pedindo de
                  </span>
                  <div className="flex items-center gap-4">
                    <RestaurantBadge
                      name={currentRestaurant.name}
                      slug={currentRestaurant.id}
                      size="md"
                    />
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">
                        {currentRestaurant.name}
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {currentRestaurant.address} - {currentRestaurant.neighborhood}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista de Itens do Pedido */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
                    <h3 className="text-base font-bold text-gray-800">
                      Itens Escolhidos ({totalCount})
                    </h3>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs font-semibold text-gray-400 hover:text-red-base transition-colors"
                    >
                      Esvaziar sacola
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <div
                        key={item.menuItem.id}
                        className="py-4 first:pt-2 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-xs">
                            <img
                              src={item.menuItem.imageUrl}
                              alt={item.menuItem.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-gray-800 truncate">
                              {item.menuItem.name}
                            </h4>
                            <p className="text-xs font-bold text-red-base mt-0.5">
                              {formatCurrency(item.menuItem.price * item.quantity)}
                            </p>
                            <span className="text-[11px] text-gray-400">
                              {formatCurrency(item.menuItem.price)} un.
                            </span>
                          </div>
                        </div>

                        {/* Controles de Quantidade */}
                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full shadow-xs flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.menuItem.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-red-base hover:bg-white rounded-full transition-all active:scale-90"
                            title="Diminuir"
                          >
                            <Minus size={13} weight="bold" />
                          </button>

                          <span className="text-xs font-bold text-gray-800 min-w-4 text-center">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.menuItem.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-red-base hover:bg-white rounded-full transition-all active:scale-90"
                            title="Aumentar"
                          >
                            <Plus size={13} weight="bold" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campo de Observações */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">
                    Alguma observação para o restaurante?
                  </h3>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ex: sem cebola, talher descartável, ponto da carne..."
                    rows={3}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-700 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-red-base focus:ring-1 focus:ring-red-base transition-all resize-none"
                  />
                </div>
              </div>

              {/* COLUNA DIREITA (5 colunas): Resumo Financeiro + Entrega + Pagamento + Botão */}
              <div className="lg:col-span-5 space-y-6 sticky top-24">
                {/* Card de Entrega e Endereço */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Endereço de Entrega
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="text-xs font-bold text-red-base hover:underline"
                    >
                      Alterar
                    </button>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-red-50/40 border border-red-100 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-red-base text-white flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} weight="fill" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-800 truncate">
                        {currentAddress}
                      </p>
                      <span className="text-[11px] text-gray-500">
                        Tempo estimado: 25-35 min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resumo de Valores */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-gray-800 pb-3 border-b border-gray-100">
                    Resumo do Pedido
                  </h3>

                  <div className="space-y-2.5 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal dos itens</span>
                      <span className="font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de entrega</span>
                      <span className="font-semibold text-gray-800">{formatCurrency(deliveryFee)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                      <span className="text-base font-bold text-gray-900">Total a pagar</span>
                      <span className="text-xl font-extrabold text-red-base">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-2xl flex items-center gap-2.5 text-xs text-gray-600">
                    <CheckCircle size={16} weight="fill" className="text-emerald-500 flex-shrink-0" />
                    <span>Pagamento seguro na entrega (Cartão ou Dinheiro)</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-red-base hover:bg-red-dark text-white rounded-2xl font-bold text-sm tracking-wide uppercase transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? 'Enviando Pedido...' : 'Confirmar e Fazer Pedido'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <DesktopFooter />
      </div>

      {/* ========================================================================= */}
      {/* 2. VERSÃO MOBILE (DISPOSITIVOS MÓVEIS < MD) - DESIGN ESPECÍFICO MOBILE */}
      {/* ========================================================================= */}
      <div className="md:hidden w-full min-h-screen bg-white flex flex-col relative">
        <header className="bg-[#ECECEE] text-gray-600 pt-5 pb-7 px-5 relative select-none z-20">

          <div className="flex items-center gap-3 mt-1">
            <div className="w-11 h-11 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center shadow-sm flex-shrink-0">
              <Receipt size={22} weight="bold" className="text-red-base" />
            </div>

            <div className="min-w-0">
              <span className="block text-[10px] font-bold tracking-wider uppercase text-gray-400 leading-none mb-1">
                PEDIDO
              </span>
              <h1 className="text-[16px] font-bold text-gray-600 truncate leading-snug">
                Finalize seu pedido
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-white -mt-3 rounded-t-[32px] px-5 pt-6 pb-28 relative z-10 shadow-sm flex flex-col">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4 animate-fadeIn">
              <div className="mb-3 text-red-base">
                <Receipt size={42} weight="bold" />
              </div>
              <p className="text-body-sm text-gray-500 mb-6">
                Você ainda não adicionou itens
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100/90 hover:bg-gray-200 text-gray-600 rounded-full border border-gray-200/90 text-label-xs font-semibold uppercase tracking-wider shadow-sm transition-all active:scale-95"
              >
                <Storefront size={18} weight="bold" className="text-gray-600" />
                <span>EXPLORAR</span>
              </Link>
            </div>
          ) : (
            <div className="flex-1 flex flex-col animate-fadeIn">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 select-none mb-2.5">
                  PEDINDO DE
                </h2>

                <div className="flex items-center gap-3.5">
                  <RestaurantBadge
                    name={currentRestaurant.name}
                    slug={currentRestaurant.id}
                    size="sm"
                    className="w-11 h-11 rounded-2xl flex-shrink-0"
                  />

                  <div className="min-w-0">
                    <h3 className="text-title-sm font-semibold text-gray-600 truncate">
                      {currentRestaurant.name}
                    </h3>
                    <p className="text-body-xs text-gray-400 truncate mt-0.5">
                      {currentRestaurant.address} - {currentRestaurant.neighborhood}
                    </p>
                  </div>
                </div>

                <div className="border-b border-gray-100 mt-4 mb-4" />
              </div>

              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 select-none mb-3">
                  ITENS
                </h2>

                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className="py-3.5 first:pt-0 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                          <img
                            src={item.menuItem.imageUrl}
                            alt={item.menuItem.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-body-sm font-semibold text-gray-600 truncate">
                            {item.menuItem.name}
                          </h3>
                          <p className="text-body-xs font-semibold text-gray-400 mt-0.5">
                            {formatCurrency(item.menuItem.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white border border-gray-200 rounded-full shadow-sm flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.menuItem.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-red-base hover:bg-red-50 rounded-full transition-colors active:scale-90"
                          aria-label="Diminuir"
                        >
                          <Minus size={13} weight="bold" />
                        </button>

                        <span className="text-label-xs font-bold text-gray-600 min-w-4 text-center select-none">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.menuItem.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-red-base hover:bg-red-50 rounded-full transition-colors active:scale-90"
                          aria-label="Aumentar"
                        >
                          <Plus size={13} weight="bold" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 select-none mb-2">
                  OBSERVAÇÃO
                </h2>

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex: sem cebola"
                  rows={3}
                  className="w-full min-h-[90px] rounded-2xl border border-gray-200 bg-white p-3.5 text-body-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-red-base focus:ring-1 focus:ring-red-base transition-all resize-none shadow-sm"
                />
              </div>

              <div className="mt-6 mb-2 bg-white/95 backdrop-blur-md rounded-[24px] p-3.5 shadow-tab-bar border border-gray-200/80 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] font-semibold tracking-wider uppercase text-gray-400 leading-none mb-1">
                    {totalCount} {totalCount === 1 ? 'ITEM' : 'ITENS'}
                  </span>
                  <p className="text-[17px] font-bold text-gray-600 leading-none">
                    {formatCurrency(subtotal)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-100/90 hover:bg-red-50 text-red-base rounded-full border border-gray-200/90 text-label-xs font-semibold uppercase tracking-wider shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'ENVIANDO...' : 'CONFIRMAR PEDIDO'}
                </button>
              </div>
            </div>
          )}
        </main>

        <TabBar />
      </div>

      <DeliveryAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        currentAddress={currentAddress}
        onSelectAddress={(newAddress) => {
          setCurrentAddress(newAddress)
          localStorage.setItem('achou_food_delivery_address', newAddress)
        }}
      />
    </div>
  )
}
