import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Receipt,
  Plus,
  Minus,
  Storefront,
  WifiHigh,
  BatteryFull,
  CellSignalFull,
} from '@phosphor-icons/react'
import { TabBar } from '@/components/layout/TabBar'
import { RestaurantBadge } from '@/components/common/RestaurantBadge'
import { useCart } from '@/context/CartContext'
import { apiService } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

export const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const { items, restaurant, updateQuantity, clearCart, subtotal, totalCount } = useCart()
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirmOrder = async () => {
    if (!restaurant || items.length === 0) return

    setIsSubmitting(true)
    try {
      const order = await apiService.createOrder({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantLogo: restaurant.logoUrl,
        totalAmount: subtotal,
        deliveryFee: 0,
        status: 'preparing',
        deliveryAddress: 'Av. das Estrelas, 567 - Canela, RS',
        paymentMethod: 'pix',
        customerName: 'Lucas',
        customerPhone: '(54) 99999-8888',
        items: items.map((item) => ({
          id: `item-${Date.now()}-${Math.random()}`,
          menuItemId: item.menuItem.id,
          itemName: item.menuItem.name,
          unitPrice: item.menuItem.price,
          quantity: item.quantity,
          totalPrice: item.menuItem.price * item.quantity,
        })),
      })

      clearCart()
      navigate('/orders', { state: { newOrderId: order.id } })
    } catch (err) {
      console.error('Error creating order:', err)
      alert('Erro ao confirmar o pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fallback restaurant if none set
  const currentRestaurant = restaurant || {
    id: 'rest-doce-aroma',
    name: 'Doce Aroma',
    address: 'Rua das Palmeiras, 321',
    neighborhood: 'Vila dos Aromas',
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center selection:bg-red-base/20 selection:text-red-base">
      {/* Mobile App Container matching the Figma screen frame */}
      <div className="w-full max-w-[440px] min-h-screen bg-white sm:shadow-2xl sm:my-4 sm:rounded-[40px] overflow-hidden flex flex-col relative border-0 sm:border sm:border-gray-200/80">
        
        {/* ========================================================================= */}
        {/* TOP HEADER: STATUS BAR + PEDIDO / FINALIZE SEU PEDIDO (Figma Spec) */}
        {/* ========================================================================= */}
        <header className="bg-[#ECECEE] text-gray-600 pt-3 pb-7 px-5 relative select-none z-20">
          {/* Status Bar simulation (9:41, icons) */}
          <div className="flex items-center justify-between text-gray-800 text-[13px] font-semibold mb-3 px-1">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 opacity-90">
              <CellSignalFull size={15} weight="fill" />
              <WifiHigh size={15} weight="bold" />
              <BatteryFull size={18} weight="fill" />
            </div>
          </div>

          {/* Header Row: Order Badge + Title */}
          <div className="flex items-center gap-3 mt-1">
            {/* Rounded square badge with red receipt icon */}
            <div className="w-11 h-11 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center shadow-sm flex-shrink-0">
              <Receipt size={22} weight="bold" className="text-red-base" />
            </div>

            {/* Title Details */}
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

        {/* ========================================================================= */}
        {/* WHITE CONTAINER COM SEÇÕES: PEDINDO DE, ITENS, OBSERVAÇÃO */}
        {/* ========================================================================= */}
        <main className="flex-1 bg-white -mt-3 rounded-t-[32px] px-5 pt-6 pb-28 relative z-10 shadow-sm flex flex-col">
          {/* Empty state fallback */}
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
              {/* ===================================================================== */}
              {/* SECTION 1: PEDINDO DE */}
              {/* ===================================================================== */}
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 select-none mb-2.5">
                  PEDINDO DE
                </h2>

                <div className="flex items-center gap-3.5">
                  {/* Restaurant Badge */}
                  <RestaurantBadge
                    name={currentRestaurant.name}
                    slug={currentRestaurant.id}
                    size="sm"
                    className="w-11 h-11 rounded-2xl flex-shrink-0"
                  />

                  {/* Name and Address */}
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

              {/* ===================================================================== */}
              {/* SECTION 2: ITENS */}
              {/* ===================================================================== */}
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
                        {/* Imagem do Produto */}
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                          <img
                            src={item.menuItem.imageUrl}
                            alt={item.menuItem.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        {/* Nome e Preço */}
                        <div className="min-w-0">
                          <h3 className="text-body-sm font-semibold text-gray-600 truncate">
                            {item.menuItem.name}
                          </h3>
                          <p className="text-body-xs font-semibold text-gray-400 mt-0.5">
                            {formatCurrency(item.menuItem.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Controle de Quantidade com Estilo do Figma [-] [qtd] [+] */}
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

              {/* ===================================================================== */}
              {/* SECTION 3: OBSERVAÇÃO */}
              {/* ===================================================================== */}
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

              {/* ===================================================================== */}
              {/* SECTION 4: BARRA DE RESUMO E CONFIRMAÇÃO DO PEDIDO */}
              {/* ===================================================================== */}
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

        {/* Floating Bottom TabBar with Order Tab active and red notification dot */}
        <TabBar />
      </div>
    </div>
  )
}
