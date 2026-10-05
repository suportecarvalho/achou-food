import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  AdminRestaurant,
  AdminOrder,
  AdminOrderStatus,
  Driver,
  AdminCustomer,
  Coupon,
  AdminNotification,
  PlatformSettings,
} from '@/types/admin'
import { MenuItem } from '@/types'
import { mockRestaurants, mockMenuItems } from '@/data/mockData'

interface AdminContextType {
  // Estabelecimentos
  restaurants: AdminRestaurant[]
  addRestaurant: (restaurant: Omit<AdminRestaurant, 'id' | 'createdAt' | 'ordersCount' | 'totalRevenue'>) => void
  updateRestaurant: (id: string, updates: Partial<AdminRestaurant>) => void
  deleteRestaurant: (id: string) => void
  approveRestaurant: (id: string) => void
  blockRestaurant: (id: string) => void
  toggleRestaurantStatus: (id: string) => void

  // Pedidos (Kanban)
  orders: AdminOrder[]
  updateOrderStatus: (orderId: string, newStatus: AdminOrderStatus) => void
  assignDriver: (orderId: string, driverName: string, driverPhone?: string) => void

  // Cardápios
  menuItems: MenuItem[]
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  toggleMenuItemAvailability: (id: string) => void

  // Entregadores
  drivers: Driver[]
  updateDriverStatus: (driverId: string, status: Driver['status']) => void
  addDriver: (driver: Omit<Driver, 'id' | 'deliveriesToday' | 'totalDeliveries' | 'rating'>) => void

  // Clientes
  customers: AdminCustomer[]

  // Cupons
  coupons: Coupon[]
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void
  toggleCoupon: (id: string) => void
  deleteCoupon: (id: string) => void

  // Notificações
  notifications: AdminNotification[]
  unreadNotificationsCount: number
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void

  // Configurações
  settings: PlatformSettings
  updateSettings: (newSettings: Partial<PlatformSettings>) => void

  // Busca e Filtros Globais do Admin
  globalSearch: string
  setGlobalSearch: (q: string) => void
}

const initialRestaurants: AdminRestaurant[] = [
  {
    id: 'rest-doce-aroma',
    name: 'Doce Aroma Confeitaria',
    logoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80',
    categoryId: 'sobremesas',
    categoryName: 'Doces & Confeitaria',
    description: 'Bolos artesanais, cupcakes especiais e doces finos com ingredientes nobres da serra gaúcha.',
    phone: '(54) 3282-1122',
    whatsapp: '(54) 99122-3344',
    address: 'Rua das Palmeiras, 321',
    neighborhood: 'Vila dos Aromas',
    city: 'Canela',
    latitude: -29.3644,
    longitude: -50.8143,
    openingHours: 'Terça a Domingo: 13:00 às 20:00',
    status: 'ativo',
    deliveryRadiusKm: 6.5,
    deliveryFee: 4.9,
    minOrder: 25.0,
    commissionPercent: 12,
    bankInfo: {
      pixKey: 'docearoma@achoufood.com.br',
      bankName: 'Banco do Brasil',
      holderName: 'Doce Aroma Confeitaria Ltda',
    },
    rating: 4.9,
    ordersCount: 142,
    totalRevenue: 6840.0,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'rest-sabor-arte',
    name: 'Restaurante Sabor & Arte',
    logoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    categoryId: 'refeicoes',
    categoryName: 'Gastronomia Contemporânea',
    description: 'Pratos executivos sofisticados, risotos, carnes nobres e massas frescas preparadas na hora.',
    phone: '(54) 3282-4545',
    whatsapp: '(54) 99145-6789',
    address: 'Rua do Comércio, 654',
    neighborhood: 'Vila Gourmet',
    city: 'Canela',
    latitude: -29.3621,
    longitude: -50.8102,
    openingHours: 'Segunda a Sábado: 11:30 às 22:30',
    status: 'ativo',
    deliveryRadiusKm: 8.0,
    deliveryFee: 5.9,
    minOrder: 40.0,
    commissionPercent: 12,
    bankInfo: {
      pixKey: 'saborarte@achoufood.com.br',
      bankName: 'Sicredi',
      holderName: 'Sabor & Arte Alimentos Eireli',
    },
    rating: 4.8,
    ordersCount: 230,
    totalRevenue: 15420.0,
    createdAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'rest-bistro-pao',
    name: 'Bistrô do Pão & Padaria Artesanal',
    logoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    categoryId: 'padaria',
    categoryName: 'Padarias & Cafés',
    description: 'Pães artesanais de fermentação natural (levain), croissants franceses, folhados e cafés especiais.',
    phone: '(54) 3282-7890',
    whatsapp: '(54) 99188-9900',
    address: 'Avenida Central, 456',
    neighborhood: 'Bairro do Sabor',
    city: 'Canela',
    latitude: -29.3589,
    longitude: -50.8085,
    openingHours: 'Diariamente: 07:00 às 19:30',
    status: 'ativo',
    deliveryRadiusKm: 5.0,
    deliveryFee: 3.9,
    minOrder: 20.0,
    commissionPercent: 10,
    bankInfo: {
      pixKey: 'bistrodopao@achoufood.com.br',
      bankName: 'Banrisul',
      holderName: 'Bistrô do Pão Canela ME',
    },
    rating: 4.9,
    ordersCount: 189,
    totalRevenue: 8910.0,
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'rest-cafeteria-vale',
    name: 'Cafeteria do Vale',
    logoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    categoryId: 'cafes',
    categoryName: 'Cafeterias',
    description: 'Grãos selecionados com torrefação própria, cappuccinos cremosos, salgados e quiches no coração de Canela.',
    phone: '(54) 3282-3321',
    whatsapp: '(54) 99133-2211',
    address: 'Rua das Flores, 789',
    neighborhood: 'Centro',
    city: 'Canela',
    latitude: -29.3655,
    longitude: -50.8123,
    openingHours: 'Segunda a Sábado: 08:30 às 19:00',
    status: 'ativo',
    deliveryRadiusKm: 6.0,
    deliveryFee: 4.5,
    minOrder: 18.0,
    commissionPercent: 12,
    rating: 4.7,
    ordersCount: 95,
    totalRevenue: 3420.0,
    createdAt: '2026-02-12T11:00:00Z',
  },
  {
    id: 'rest-sabor-tropical',
    name: 'Sabor Tropical Sucos & Saladas',
    logoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    categoryId: 'saudavel',
    categoryName: 'Sucos & Saudável',
    description: 'Sucos naturais sem adição de açúcar, açaí na tigela, saladas de frutas frescas e bowls nutritivos.',
    phone: '(54) 3282-8877',
    whatsapp: '(54) 99188-7766',
    address: 'Rua do Sol, 987',
    neighborhood: 'Bairro Novo',
    city: 'Canela',
    latitude: -29.3678,
    longitude: -50.8167,
    openingHours: 'Segunda a Domingo: 10:00 às 20:00',
    status: 'pendente',
    deliveryRadiusKm: 7.0,
    deliveryFee: 4.0,
    minOrder: 20.0,
    commissionPercent: 12,
    rating: 4.6,
    ordersCount: 42,
    totalRevenue: 1260.0,
    createdAt: '2026-03-01T15:00:00Z',
  },
  {
    id: 'rest-hamburger-esquina',
    name: 'Hambúrguer da Esquina',
    logoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    categoryId: 'hamburgueres',
    categoryName: 'Hambúrgueres & Lanches',
    description: 'Smash burgers na brasa, blend especial de costela, batatas crocantes e maioneses artesanais exclusivas.',
    phone: '(54) 3282-9900',
    whatsapp: '(54) 99199-0011',
    address: 'Avenida das Hortênsias, 123',
    neighborhood: 'Vila Esquina',
    city: 'Canela',
    latitude: -29.3602,
    longitude: -50.8068,
    openingHours: 'Terça a Domingo: 18:00 às 23:30',
    status: 'bloqueado',
    deliveryRadiusKm: 9.0,
    deliveryFee: 5.5,
    minOrder: 30.0,
    commissionPercent: 15,
    rating: 4.4,
    ordersCount: 88,
    totalRevenue: 4180.0,
    createdAt: '2026-02-18T19:00:00Z',
  },
]

const initialOrders: AdminOrder[] = [
  {
    id: 'ORD-7891',
    restaurantId: 'rest-doce-aroma',
    restaurantName: 'Doce Aroma Confeitaria',
    customerName: 'Mariana Silveira',
    customerPhone: '(54) 99876-5432',
    customerAddress: 'Av. das Estrelas, 567 - Apto 302',
    customerNeighborhood: 'Centro',
    status: 'novos',
    items: [
      { id: '1', menuItemId: 'item-1', itemName: 'Cupcake de Chocolate Belga', quantity: 2, unitPrice: 12.9, totalPrice: 25.8 },
      { id: '2', menuItemId: 'item-2', itemName: 'Bolo de Cenoura com Brigadeiro', quantity: 1, unitPrice: 28.0, totalPrice: 28.0 },
    ],
    subtotal: 53.8,
    deliveryFee: 4.9,
    discount: 0,
    totalAmount: 58.7,
    commissionAmount: 7.04,
    paymentMethod: 'pix',
    paymentStatus: 'pago',
    estimatedDeliveryMin: 30,
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    notes: 'Favor tocar interfone no 302.',
  },
  {
    id: 'ORD-7890',
    restaurantId: 'rest-sabor-arte',
    restaurantName: 'Restaurante Sabor & Arte',
    customerName: 'Carlos Eduardo Ramos',
    customerPhone: '(54) 99123-8899',
    customerAddress: 'Rua Borges de Medeiros, 1204',
    customerNeighborhood: 'Vila Gourmet',
    status: 'confirmados',
    items: [
      { id: '1', menuItemId: 'item-3', itemName: 'Risoto de Cogumelos Serranos', quantity: 1, unitPrice: 48.0, totalPrice: 48.0 },
      { id: '2', menuItemId: 'item-4', itemName: 'Filé Mignon ao Molho Madeira', quantity: 1, unitPrice: 62.0, totalPrice: 62.0 },
    ],
    subtotal: 110.0,
    deliveryFee: 5.9,
    discount: 10.0,
    totalAmount: 105.9,
    commissionAmount: 13.2,
    paymentMethod: 'cartao_credito',
    paymentStatus: 'pago',
    estimatedDeliveryMin: 45,
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    notes: 'Ponto da carne: ao ponto para mal passada.',
  },
  {
    id: 'ORD-7889',
    restaurantId: 'rest-bistro-pao',
    restaurantName: 'Bistrô do Pão',
    customerName: 'Ana Beatriz Souza',
    customerPhone: '(54) 99654-1122',
    customerAddress: 'Rua Dona Carlinda, 450',
    customerNeighborhood: 'Centro',
    status: 'preparo',
    items: [
      { id: '1', menuItemId: 'item-5', itemName: 'Croissant de Amêndoas Francês', quantity: 3, unitPrice: 14.5, totalPrice: 43.5 },
      { id: '2', menuItemId: 'item-6', itemName: 'Café Latte Duplo', quantity: 2, unitPrice: 9.0, totalPrice: 18.0 },
    ],
    subtotal: 61.5,
    deliveryFee: 3.9,
    discount: 0,
    totalAmount: 65.4,
    commissionAmount: 6.54,
    paymentMethod: 'pix',
    paymentStatus: 'pago',
    estimatedDeliveryMin: 25,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'ORD-7888',
    restaurantId: 'rest-doce-aroma',
    restaurantName: 'Doce Aroma Confeitaria',
    customerName: 'Rodrigo Mello',
    customerPhone: '(54) 99432-6677',
    customerAddress: 'Rua Felisberto Soares, 89',
    customerNeighborhood: 'Vila dos Aromas',
    status: 'pronto',
    items: [
      { id: '1', menuItemId: 'item-7', itemName: 'Torta Holandesa Fatia Especial', quantity: 2, unitPrice: 16.0, totalPrice: 32.0 },
    ],
    subtotal: 32.0,
    deliveryFee: 4.9,
    discount: 0,
    totalAmount: 36.9,
    commissionAmount: 4.42,
    paymentMethod: 'cartao_debito',
    paymentStatus: 'pago',
    estimatedDeliveryMin: 20,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    driverName: 'Lucas Motoboy',
    driverPhone: '(54) 99222-1133',
  },
  {
    id: 'ORD-7887',
    restaurantId: 'rest-sabor-arte',
    restaurantName: 'Restaurante Sabor & Arte',
    customerName: 'Juliana Fernandes',
    customerPhone: '(54) 99777-3344',
    customerAddress: 'Av. Oswaldo Aranha, 310',
    customerNeighborhood: 'Bairro do Sabor',
    status: 'entrega',
    items: [
      { id: '1', menuItemId: 'item-8', itemName: 'Gnocchi Artesanal ao Pesto', quantity: 1, unitPrice: 42.0, totalPrice: 42.0 },
    ],
    subtotal: 42.0,
    deliveryFee: 5.9,
    discount: 0,
    totalAmount: 47.9,
    commissionAmount: 5.74,
    paymentMethod: 'pix',
    paymentStatus: 'pago',
    estimatedDeliveryMin: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    driverName: 'Gabriel Entregas',
    driverPhone: '(54) 99333-4455',
  },
  {
    id: 'ORD-7886',
    restaurantId: 'rest-bistro-pao',
    restaurantName: 'Bistrô do Pão',
    customerName: 'Fernando Alencar',
    customerPhone: '(54) 99111-2233',
    customerAddress: 'Rua Rodolfo Schlieper, 15',
    customerNeighborhood: 'Centro',
    status: 'entregue',
    items: [
      { id: '1', menuItemId: 'item-9', itemName: 'Pão de Fermentação Natural 500g', quantity: 1, unitPrice: 22.0, totalPrice: 22.0 },
      { id: '2', menuItemId: 'item-10', itemName: 'Geleia Artesanal de Morango', quantity: 1, unitPrice: 18.0, totalPrice: 18.0 },
    ],
    subtotal: 40.0,
    deliveryFee: 3.9,
    discount: 5.0,
    totalAmount: 38.9,
    commissionAmount: 4.0,
    paymentMethod: 'pix',
    paymentStatus: 'pago',
    estimatedDeliveryMin: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    driverName: 'Gabriel Entregas',
  },
]

const initialDrivers: Driver[] = [
  {
    id: 'drv-1',
    name: 'Lucas Silva (Motoboy 01)',
    phone: '(54) 99222-1133',
    vehicleType: 'moto',
    vehiclePlate: 'IXX-4D52',
    status: 'disponivel',
    rating: 4.9,
    deliveriesToday: 8,
    totalDeliveries: 342,
  },
  {
    id: 'drv-2',
    name: 'Gabriel Entregas (Canela Express)',
    phone: '(54) 99333-4455',
    vehicleType: 'moto',
    vehiclePlate: 'JAA-8H90',
    status: 'em_rota',
    currentOrderId: 'ORD-7887',
    rating: 4.8,
    deliveriesToday: 11,
    totalDeliveries: 512,
  },
  {
    id: 'drv-3',
    name: 'Mateus Oliveira (Eco Bike Canela)',
    phone: '(54) 99444-5566',
    vehicleType: 'bicicleta',
    status: 'disponivel',
    rating: 5.0,
    deliveriesToday: 5,
    totalDeliveries: 128,
  },
  {
    id: 'drv-4',
    name: 'Rafael Santos',
    phone: '(54) 99555-6677',
    vehicleType: 'moto',
    vehiclePlate: 'IYY-3B12',
    status: 'offline',
    rating: 4.7,
    deliveriesToday: 0,
    totalDeliveries: 219,
  },
]

const initialCustomers: AdminCustomer[] = [
  {
    id: 'cust-1',
    name: 'Mariana Silveira',
    email: 'mariana.silveira@gmail.com',
    phone: '(54) 99876-5432',
    address: 'Av. das Estrelas, 567 - Apto 302',
    neighborhood: 'Centro',
    totalOrders: 14,
    totalSpent: 642.5,
    lastOrderDate: '2026-03-05',
    createdAt: '2026-01-12',
    status: 'ativo',
  },
  {
    id: 'cust-2',
    name: 'Carlos Eduardo Ramos',
    email: 'carlos.ramos@hotmail.com',
    phone: '(54) 99123-8899',
    address: 'Rua Borges de Medeiros, 1204',
    neighborhood: 'Vila Gourmet',
    totalOrders: 8,
    totalSpent: 590.0,
    lastOrderDate: '2026-03-05',
    createdAt: '2026-01-20',
    status: 'ativo',
  },
  {
    id: 'cust-3',
    name: 'Ana Beatriz Souza',
    email: 'anabeatriz@gmail.com',
    phone: '(54) 99654-1122',
    address: 'Rua Dona Carlinda, 450',
    neighborhood: 'Centro',
    totalOrders: 19,
    totalSpent: 875.0,
    lastOrderDate: '2026-03-05',
    createdAt: '2026-01-05',
    status: 'ativo',
  },
  {
    id: 'cust-4',
    name: 'Rodrigo Mello',
    email: 'rodrigo.mello@gmail.com',
    phone: '(54) 99432-6677',
    address: 'Rua Felisberto Soares, 89',
    neighborhood: 'Vila dos Aromas',
    totalOrders: 5,
    totalSpent: 210.0,
    lastOrderDate: '2026-03-05',
    createdAt: '2026-02-10',
    status: 'ativo',
  },
  {
    id: 'cust-5',
    name: 'Juliana Fernandes',
    email: 'ju.fernandes@yahoo.com.br',
    phone: '(54) 99777-3344',
    address: 'Av. Oswaldo Aranha, 310',
    neighborhood: 'Bairro do Sabor',
    totalOrders: 3,
    totalSpent: 145.0,
    lastOrderDate: '2026-03-05',
    createdAt: '2026-02-22',
    status: 'ativo',
  },
]

const initialCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'BEMVINDO15',
    description: '15% de desconto no primeiro pedido para novos clientes',
    type: 'porcentagem',
    value: 15,
    minOrderValue: 35.0,
    maxUses: 500,
    usedCount: 142,
    expiresAt: '2026-12-31',
    isActive: true,
  },
  {
    id: 'coup-2',
    code: 'CANELAFOOD10',
    description: 'R$ 10 de desconto em pedidos acima de R$ 50',
    type: 'fixo',
    value: 10,
    minOrderValue: 50.0,
    maxUses: 300,
    usedCount: 98,
    expiresAt: '2026-06-30',
    isActive: true,
  },
  {
    id: 'coup-3',
    code: 'FRETEGRATIS',
    description: 'Frete grátis para compras a partir de R$ 60 em Canela',
    type: 'fixo',
    value: 5.9,
    minOrderValue: 60.0,
    maxUses: 1000,
    usedCount: 310,
    expiresAt: '2026-12-31',
    isActive: true,
  },
]

const initialNotifications: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'Novo pedido recebido!',
    message: 'Pedido #ORD-7891 acabou de entrar de Doce Aroma Confeitaria.',
    type: 'pedido',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    actionUrl: '/admin/orders',
  },
  {
    id: 'notif-2',
    title: 'Estabelecimento aguardando aprovação',
    message: 'Sabor Tropical Sucos & Saladas enviou solicitação de cadastro.',
    type: 'estabelecimento',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actionUrl: '/admin/restaurants',
  },
  {
    id: 'notif-3',
    title: 'Repasse financeiro semanal',
    message: 'Relatório de fechamento pronto para conciliação das taxas.',
    type: 'financeiro',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    actionUrl: '/admin/finance',
  },
]

const initialSettings: PlatformSettings = {
  platformName: 'Achou Food Canela',
  supportEmail: 'suporte@achoufood.com.br',
  supportWhatsapp: '(54) 99999-8877',
  defaultCommissionPercent: 12,
  defaultDeliveryRadiusKm: 7.5,
  baseDeliveryFee: 4.9,
  autoApproveRestaurants: false,
  mapboxToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
  cityCenter: {
    name: 'Canela - RS',
    lat: -29.3630,
    lng: -50.8070,
  },
}

// Junta todos os pratos mockados para o gerenciador de cardápios
const initialMenuItemsList: MenuItem[] = Object.values(mockMenuItems).flat()

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Restaurantes
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>(() => {
    try {
      const stored = localStorage.getItem('achou_admin_restaurants')
      return stored ? JSON.parse(stored) : initialRestaurants
    } catch {
      return initialRestaurants
    }
  })

  // 2. Pedidos
  const [orders, setOrders] = useState<AdminOrder[]>(() => {
    try {
      const stored = localStorage.getItem('achou_admin_orders')
      return stored ? JSON.parse(stored) : initialOrders
    } catch {
      return initialOrders
    }
  })

  // 3. Cardápios (MenuItems)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const stored = localStorage.getItem('achou_admin_menu_items')
      return stored ? JSON.parse(stored) : initialMenuItemsList
    } catch {
      return initialMenuItemsList
    }
  })

  // 4. Entregadores
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    try {
      const stored = localStorage.getItem('achou_admin_drivers')
      return stored ? JSON.parse(stored) : initialDrivers
    } catch {
      return initialDrivers
    }
  })

  // 5. Clientes
  const [customers, setCustomers] = useState<AdminCustomer[]>(() => {
    try {
      const stored = localStorage.getItem('achou_admin_customers')
      return stored ? JSON.parse(stored) : initialCustomers
    } catch {
      return initialCustomers
    }
  })

  // 6. Cupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const stored = localStorage.getItem('achou_admin_coupons')
      return stored ? JSON.parse(stored) : initialCoupons
    } catch {
      return initialCoupons
    }
  })

  // 7. Notificações
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const stored = localStorage.getItem('achou_admin_notifications')
      return stored ? JSON.parse(stored) : initialNotifications
    } catch {
      return initialNotifications
    }
  })

  // 8. Configurações
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    try {
      const stored = localStorage.getItem('achou_admin_settings')
      return stored ? JSON.parse(stored) : initialSettings
    } catch {
      return initialSettings
    }
  })

  // Busca global do header
  const [globalSearch, setGlobalSearch] = useState('')

  // Sincronização automática com localStorage
  useEffect(() => {
    localStorage.setItem('achou_admin_restaurants', JSON.stringify(restaurants))
  }, [restaurants])

  useEffect(() => {
    localStorage.setItem('achou_admin_orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem('achou_admin_menu_items', JSON.stringify(menuItems))
  }, [menuItems])

  useEffect(() => {
    localStorage.setItem('achou_admin_drivers', JSON.stringify(drivers))
  }, [drivers])

  useEffect(() => {
    localStorage.setItem('achou_admin_coupons', JSON.stringify(coupons))
  }, [coupons])

  useEffect(() => {
    localStorage.setItem('achou_admin_notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem('achou_admin_settings', JSON.stringify(settings))
  }, [settings])

  // ==========================================
  // AÇÕES: ESTABELECIMENTOS
  // ==========================================
  const addRestaurant = (data: Omit<AdminRestaurant, 'id' | 'createdAt' | 'ordersCount' | 'totalRevenue'>) => {
    const newRest: AdminRestaurant = {
      ...data,
      id: `rest-${Date.now().toString(36)}`,
      ordersCount: 0,
      totalRevenue: 0,
      rating: 5.0,
      createdAt: new Date().toISOString(),
    }
    setRestaurants((prev) => [newRest, ...prev])
  }

  const updateRestaurant = (id: string, updates: Partial<AdminRestaurant>) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    )
  }

  const deleteRestaurant = (id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id))
  }

  const approveRestaurant = (id: string) => {
    updateRestaurant(id, { status: 'ativo' })
  }

  const blockRestaurant = (id: string) => {
    updateRestaurant(id, { status: 'bloqueado' })
  }

  const toggleRestaurantStatus = (id: string) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === 'ativo' ? 'bloqueado' : 'ativo'
          return { ...r, status: nextStatus }
        }
        return r
      })
    )
  }

  // ==========================================
  // AÇÕES: PEDIDOS KANBAN
  // ==========================================
  const updateOrderStatus = (orderId: string, newStatus: AdminOrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  const assignDriver = (orderId: string, driverName: string, driverPhone?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, driverName, driverPhone, status: 'entrega' } : o))
    )
  }

  // ==========================================
  // AÇÕES: CARDÁPIOS
  // ==========================================
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-item-${Date.now().toString(36)}`,
    }
    setMenuItems((prev) => [newItem, ...prev])
  }

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    )
  }

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id))
  }

  const toggleMenuItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m))
    )
  }

  // ==========================================
  // AÇÕES: ENTREGADORES
  // ==========================================
  const updateDriverStatus = (driverId: string, status: Driver['status']) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, status } : d))
    )
  }

  const addDriver = (driver: Omit<Driver, 'id' | 'deliveriesToday' | 'totalDeliveries' | 'rating'>) => {
    const newDriver: Driver = {
      ...driver,
      id: `drv-${Date.now().toString(36)}`,
      rating: 5.0,
      deliveriesToday: 0,
      totalDeliveries: 0,
    }
    setDrivers((prev) => [newDriver, ...prev])
  }

  // ==========================================
  // AÇÕES: CUPONS
  // ==========================================
  const addCoupon = (coupon: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup-${Date.now().toString(36)}`,
      usedCount: 0,
    }
    setCoupons((prev) => [newCoupon, ...prev])
  }

  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    )
  }

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  // ==========================================
  // AÇÕES: NOTIFICAÇÕES
  // ==========================================
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  // ==========================================
  // AÇÕES: CONFIGURAÇÕES
  // ==========================================
  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <AdminContext.Provider
      value={{
        restaurants,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        approveRestaurant,
        blockRestaurant,
        toggleRestaurantStatus,
        orders,
        updateOrderStatus,
        assignDriver,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuItemAvailability,
        drivers,
        updateDriverStatus,
        addDriver,
        customers,
        coupons,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        settings,
        updateSettings,
        globalSearch,
        setGlobalSearch,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
