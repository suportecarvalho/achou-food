import React, { createContext, useContext, useState, useEffect } from 'react'
import { CartItem, MenuItem, Restaurant } from '@/types'
import { mockRestaurants, mockMenuItems } from '@/data/mockData'

interface CartContextType {
  items: CartItem[]
  restaurant: Restaurant | null
  addItem: (item: MenuItem, restaurant: Restaurant) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, delta: number) => void
  clearCart: () => void
  getItemQuantity: (itemId: string) => number
  totalCount: number
  subtotal: number
  deliveryFee: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pre-seed cart with items from the official Figma screen if not modified yet
  const defaultRestaurant = mockRestaurants.find((r) => r.id === 'rest-doce-aroma') || mockRestaurants[0]
  const defaultDoceAromaItems = mockMenuItems['rest-doce-aroma'] || []
  const defaultRedVelvet = defaultDoceAromaItems.find((m) => m.name.toLowerCase().includes('red velvet'))
  const defaultExpresso = defaultDoceAromaItems.find((m) => m.name.toLowerCase().includes('expresso'))

  const initialSeedItems: CartItem[] = (defaultRestaurant && defaultRedVelvet && defaultExpresso) ? [
    { menuItem: defaultRedVelvet, restaurant: defaultRestaurant, quantity: 1 },
    { menuItem: defaultExpresso, restaurant: defaultRestaurant, quantity: 2 },
  ] : []

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('achou_food_cart')
      return stored ? JSON.parse(stored) : initialSeedItems
    } catch {
      return initialSeedItems
    }
  })

  const [restaurant, setRestaurant] = useState<Restaurant | null>(() => {
    try {
      const stored = localStorage.getItem('achou_food_cart_restaurant')
      return stored ? JSON.parse(stored) : defaultRestaurant
    } catch {
      return defaultRestaurant
    }
  })

  useEffect(() => {
    localStorage.setItem('achou_food_cart', JSON.stringify(items))
    if (items.length === 0) {
      setRestaurant(null)
      localStorage.removeItem('achou_food_cart_restaurant')
    } else if (restaurant) {
      localStorage.setItem('achou_food_cart_restaurant', JSON.stringify(restaurant))
    }
  }, [items, restaurant])

  const addItem = (item: MenuItem, newRestaurant: Restaurant) => {
    if (restaurant && restaurant.id !== newRestaurant.id && items.length > 0) {
      if (!window.confirm(`Você já possui itens de ${restaurant.name} no carrinho. Deseja limpar a sacola e adicionar itens de ${newRestaurant.name}?`)) {
        return
      }
      setRestaurant(newRestaurant)
      setItems([{ menuItem: item, restaurant: newRestaurant, quantity: 1 }])
      return
    }

    if (!restaurant) {
      setRestaurant(newRestaurant)
    }

    setItems((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id)
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      }
      return [...prev, { menuItem: item, restaurant: newRestaurant, quantity: 1 }]
    })
  }

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((ci) => ci.menuItem.id !== itemId))
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((ci) => {
          if (ci.menuItem.id === itemId) {
            const newQty = ci.quantity + delta
            return newQty > 0 ? { ...ci, quantity: newQty } : null
          }
          return ci
        })
        .filter(Boolean) as CartItem[]
    })
  }

  const clearCart = () => {
    setItems([])
    setRestaurant(null)
    localStorage.removeItem('achou_food_cart')
    localStorage.removeItem('achou_food_cart_restaurant')
  }

  const getItemQuantity = (itemId: string): number => {
    const item = items.find((ci) => ci.menuItem.id === itemId)
    return item ? item.quantity : 0
  }

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  )
  const deliveryFee = restaurant ? restaurant.deliveryFee : 0
  const total = subtotal > 0 ? subtotal : 0

  return (
    <CartContext.Provider
      value={{
        items,
        restaurant,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        totalCount,
        subtotal,
        deliveryFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
