import { MenuItem } from './index'

export type RestaurantStatus = 'ativo' | 'pendente' | 'bloqueado'

export interface AdminRestaurant {
  id: string
  name: string
  logoUrl?: string
  imageUrl?: string
  categoryId: string
  categoryName: string
  description: string
  phone: string
  whatsapp: string
  address: string
  neighborhood: string
  city: string
  latitude: number
  longitude: number
  openingHours: string
  status: RestaurantStatus
  deliveryRadiusKm: number
  deliveryFee: number
  minOrder: number
  commissionPercent: number
  bankInfo?: {
    pixKey: string
    bankName: string
    holderName: string
  }
  rating: number
  ordersCount: number
  totalRevenue: number
  createdAt: string
}

export type AdminOrderStatus =
  | 'novos'
  | 'confirmados'
  | 'preparo'
  | 'pronto'
  | 'entrega'
  | 'entregue'
  | 'cancelado'

export interface AdminOrderItem {
  id: string
  menuItemId: string
  itemName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  notes?: string
}

export interface AdminOrder {
  id: string
  restaurantId: string
  restaurantName: string
  customerName: string
  customerPhone: string
  customerAddress: string
  customerNeighborhood: string
  status: AdminOrderStatus
  items: AdminOrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  totalAmount: number
  commissionAmount: number
  paymentMethod: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro'
  paymentStatus: 'pago' | 'pendente'
  driverName?: string
  driverPhone?: string
  estimatedDeliveryMin: number
  createdAt: string
  notes?: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  vehicleType: 'moto' | 'bicicleta' | 'carro'
  vehiclePlate?: string
  status: 'disponivel' | 'em_rota' | 'offline'
  currentOrderId?: string
  rating: number
  deliveriesToday: number
  totalDeliveries: number
  avatarUrl?: string
}

export interface AdminCustomer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  neighborhood: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  createdAt: string
  status: 'ativo' | 'inativo'
}

export interface Coupon {
  id: string
  code: string
  description: string
  type: 'porcentagem' | 'fixo'
  value: number
  minOrderValue: number
  maxUses: number
  usedCount: number
  expiresAt: string
  isActive: boolean
}

export interface AdminNotification {
  id: string
  title: string
  message: string
  type: 'pedido' | 'estabelecimento' | 'sistema' | 'financeiro'
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface PlatformSettings {
  platformName: string
  supportEmail: string
  supportWhatsapp: string
  defaultCommissionPercent: number
  defaultDeliveryRadiusKm: number
  baseDeliveryFee: number
  autoApproveRestaurants: boolean
  mapboxToken: string
  cityCenter: {
    name: string
    lat: number
    lng: number
  }
}
