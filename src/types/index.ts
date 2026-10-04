export interface Category {
  id: string
  name: string
  icon: string
  sortOrder?: number
}

export interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  neighborhood: string
  city?: string
  categoryId: string
  imageUrl: string
  logoUrl: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: number
  isOpen: boolean
  latitude: number
  longitude: number
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  isAvailable: boolean
}

export interface CartItem {
  menuItem: MenuItem
  restaurant: Restaurant
  quantity: number
}

export type OrderStatus = 'received' | 'preparing' | 'delivering' | 'delivered' | 'cancelled'
export type PaymentMethod = 'pix' | 'credit_card' | 'cash'

export interface OrderItem {
  id: string
  orderId?: string
  menuItemId: string
  itemName: string
  unitPrice: number
  quantity: number
  totalPrice: number
}

export interface Order {
  id: string
  restaurantId: string
  restaurantName: string
  restaurantLogo: string
  totalAmount: number
  deliveryFee: number
  status: OrderStatus
  deliveryAddress: string
  paymentMethod: PaymentMethod
  customerName: string
  customerPhone: string
  createdAt: string
  items: OrderItem[]
}
