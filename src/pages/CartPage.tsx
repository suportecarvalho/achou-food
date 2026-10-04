import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Trash,
  Plus,
  Minus,
  MapPin,
  CreditCard,
  QrCode,
  Money,
  CheckCircle,
  ShoppingBag
} from '@phosphor-icons/react'
import { Header } from '@/components/layout/Header'
import { TabBar } from '@/components/layout/TabBar'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { apiService } from '@/lib/supabase'
import { PaymentMethod } from '@/types'
import { formatCurrency } from '@/lib/utils'

export const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const { items, restaurant, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, total } = useCart()

  const [address, setAddress] = useState('Avenida Paulista, 1000 - Apto 42')
  const [customerName, setCustomerName] = useState('Lucas Lima')
  const [customerPhone, setCustomerPhone] = useState('(11) 98765-4321')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!restaurant || items.length === 0) return

    setIsSubmitting(true)
    try {
      const order = await apiService.createOrder({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantLogo: restaurant.logoUrl,
        totalAmount: total,
        deliveryFee: deliveryFee,
        status: 'received',
        deliveryAddress: address,
        paymentMethod: paymentMethod,
        customerName: customerName,
        customerPhone: customerPhone,
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
      navigate(`/orders`, { state: { newOrderId: order.id } })
    } catch (err) {
      console.error('Error creating order:', err)
      alert('Erro ao finalizar o pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pb-28">
        <Header showSearch={false} />
        <main className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-base/10 text-red-base flex items-center justify-center mb-4">
            <ShoppingBag size={36} />
          </div>
          <h2 className="text-title-lg font-bold text-gray-600">Sua sacola está vazia</h2>
          <p className="text-body-sm text-gray-400 mt-1 max-w-sm mx-auto">
            Você ainda não adicionou nenhum item. Que tal explorar os pratos mais pedidos?
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center px-6 py-3 bg-red-base hover:bg-red-dark text-white font-semibold rounded-full shadow-sm transition-colors text-title-sm"
          >
            Explorar Restaurantes
          </Link>
        </main>
        <TabBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-28">
      <Header showSearch={false} />

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} weight="bold" />
            </button>
            <h1 className="text-title-lg font-bold text-gray-600">Sua Sacola</h1>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-body-xs font-semibold text-red-base hover:text-red-dark transition-colors"
          >
            Limpar Sacola
          </button>
        </div>

        {/* Restaurant Header */}
        {restaurant && (
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 flex items-center gap-3">
            <img
              src={restaurant.logoUrl || restaurant.imageUrl}
              alt={restaurant.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h2 className="text-title-sm font-bold text-gray-600">{restaurant.name}</h2>
              <p className="text-body-xs text-gray-400">Tempo estimado: {restaurant.deliveryTime}</p>
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.menuItem.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.menuItem.imageUrl}
                  alt={item.menuItem.name}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-title-sm font-semibold text-gray-600 truncate">
                    {item.menuItem.name}
                  </h3>
                  <p className="text-body-xs text-gray-500 mt-0.5">
                    {formatCurrency(item.menuItem.price)} un.
                  </p>
                </div>
              </div>

              {/* Quantity Selector & Item Total */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 border border-gray-200 rounded-full">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.menuItem.id, -1)}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-gray-500 hover:text-red-base transition-colors"
                  >
                    <Minus size={12} weight="bold" />
                  </button>
                  <span className="text-label-xs font-bold text-gray-600 min-w-3 text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.menuItem.id, 1)}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-red-base transition-colors"
                  >
                    <Plus size={12} weight="bold" />
                  </button>
                </div>

                <span className="text-title-sm font-semibold text-gray-600 min-w-16 text-right">
                  {formatCurrency(item.menuItem.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Address & Customer Details */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-3">
          <div className="flex items-center gap-2 text-title-sm font-bold text-gray-600">
            <MapPin size={18} weight="fill" className="text-red-base" />
            <span>Endereço de Entrega</span>
          </div>
          <div>
            <label className="text-body-xs font-semibold text-gray-500 block mb-1">
              Endereço completo
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-body-sm bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:border-red-base"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-body-xs font-semibold text-gray-500 block mb-1">
                Seu Nome
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-body-sm bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:border-red-base"
              />
            </div>
            <div>
              <label className="text-body-xs font-semibold text-gray-500 block mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-body-sm bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:border-red-base"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-3">
          <h3 className="text-title-sm font-bold text-gray-600">Forma de Pagamento</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'pix', label: 'Pix Instantâneo', icon: QrCode },
              { id: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard },
              { id: 'cash', label: 'Dinheiro na Entrega', icon: Money },
            ].map((method) => {
              const Icon = method.icon
              const isSelected = paymentMethod === method.id
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'border-red-base bg-red-base/5 text-red-base font-semibold ring-2 ring-red-base/20'
                      : 'border-gray-200 bg-gray-100 hover:bg-gray-200/60 text-gray-500'
                  }`}
                >
                  <Icon size={22} weight={isSelected ? 'bold' : 'regular'} />
                  <span className="text-label-2xs leading-tight">{method.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Summary & Checkout Button */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-2.5">
          <div className="flex justify-between text-body-sm text-gray-500">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-body-sm text-gray-500">
            <span>Taxa de Entrega</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between text-title-md font-bold text-gray-600">
            <span>Total</span>
            <span className="text-red-base">{formatCurrency(total)}</span>
          </div>

          <Button
            variant="primary"
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 rounded-2xl text-title-sm font-bold"
          >
            {isSubmitting ? 'Processando pedido...' : `Finalizar Pedido (${formatCurrency(total)})`}
          </Button>
        </div>
      </main>

      <TabBar />
    </div>
  )
}
