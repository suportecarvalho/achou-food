import { createClient } from '@supabase/supabase-js'
import { Restaurant, MenuItem, Category, Order } from '@/types'
import { mockCategories, mockRestaurants, mockMenuItems, mockOrders } from '@/data/mockData'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper Data Service Layer (Lovable style: connects to Supabase or seamless fallback)
export const apiService = {
  // Get Categories
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true })
        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            icon: item.icon,
            sortOrder: item.sort_order,
          }))
        }
      } catch (e) {
        console.warn('Supabase fetch categories fallback to mock:', e)
      }
    }
    return mockCategories
  },

  // Get Restaurants
  async getRestaurants(categoryId?: string, search?: string): Promise<Restaurant[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('restaurants').select('*')
        if (categoryId && categoryId !== 'todos') {
          query = query.eq('category_id', categoryId)
        }
        if (search) {
          query = query.ilike('name', `%${search}%`)
        }
        const { data, error } = await query
        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            address: r.address,
            neighborhood: r.neighborhood,
            city: r.city,
            categoryId: r.category_id,
            imageUrl: r.image_url,
            logoUrl: r.logo_url,
            rating: Number(r.rating) || 4.8,
            reviewCount: r.review_count || 100,
            deliveryTime: r.delivery_time || '30-40 min',
            deliveryFee: Number(r.delivery_fee) || 5.90,
            isOpen: r.is_open ?? true,
            latitude: r.latitude || -23.55,
            longitude: r.longitude || -46.63,
          }))
        }
      } catch (e) {
        console.warn('Supabase fetch restaurants fallback to mock:', e)
      }
    }

    let results = [...mockRestaurants]
    if (categoryId && categoryId !== 'todos') {
      results = results.filter((r) => r.categoryId === categoryId)
    }
    if (search && search.trim() !== '') {
      const q = search.toLowerCase()
      results = results.filter((r) => 
        r.name.toLowerCase().includes(q) || 
        r.neighborhood.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      )
    }
    return results
  },

  // Get Restaurant by ID
  async getRestaurantById(id: string): Promise<Restaurant | undefined> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single()
        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            description: data.description,
            address: data.address,
            neighborhood: data.neighborhood,
            city: data.city,
            categoryId: data.category_id,
            imageUrl: data.image_url,
            logoUrl: data.logo_url,
            rating: Number(data.rating),
            reviewCount: data.review_count,
            deliveryTime: data.delivery_time,
            deliveryFee: Number(data.delivery_fee),
            isOpen: data.is_open,
            latitude: data.latitude,
            longitude: data.longitude,
          }
        }
      } catch (e) {
        console.warn('Supabase fetch restaurant by id fallback:', e)
      }
    }
    return mockRestaurants.find((r) => r.id === id) || mockRestaurants[0]
  },

  // Get Menu Items for a restaurant
  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            restaurantId: item.restaurant_id,
            name: item.name,
            description: item.description,
            price: Number(item.price),
            imageUrl: item.image_url,
            category: item.category,
            isAvailable: item.is_available,
          }))
        }
      } catch (e) {
        console.warn('Supabase fetch menu items fallback to mock:', e)
      }
    }

    return mockMenuItems[restaurantId] || mockMenuItems['rest-1'] || []
  },

  // Create Order
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert({
            restaurant_id: order.restaurantId,
            total_amount: order.totalAmount,
            delivery_fee: order.deliveryFee,
            status: order.status,
            delivery_address: order.deliveryAddress,
            payment_method: order.paymentMethod,
            customer_name: order.customerName,
            customer_phone: order.customerPhone,
          })
          .select()
          .single()

        if (!error && data) {
          // insert order items
          const itemsToInsert = order.items.map((i) => ({
            order_id: data.id,
            menu_item_id: i.menuItemId,
            item_name: i.itemName,
            unit_price: i.unitPrice,
            quantity: i.quantity,
            total_price: i.totalPrice,
          }))
          await supabase.from('order_items').insert(itemsToInsert)

          return {
            ...newOrder,
            id: data.id,
            createdAt: data.created_at,
          }
        }
      } catch (e) {
        console.warn('Supabase create order fallback:', e)
      }
    }

    // Save in local storage orders
    const stored = localStorage.getItem('achou_food_orders')
    const currentOrders: Order[] = stored ? JSON.parse(stored) : mockOrders
    localStorage.setItem('achou_food_orders', JSON.stringify([newOrder, ...currentOrders]))
    return newOrder
  },

  // Get Orders
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, restaurants(name, logo_url), order_items(*)')
          .order('created_at', { ascending: false })
        if (!error && data && data.length > 0) {
          return data.map((o: any) => ({
            id: o.id,
            restaurantId: o.restaurant_id,
            restaurantName: o.restaurants?.name || 'Restaurante',
            restaurantLogo: o.restaurants?.logo_url || '',
            totalAmount: Number(o.total_amount),
            deliveryFee: Number(o.delivery_fee),
            status: o.status,
            deliveryAddress: o.delivery_address,
            paymentMethod: o.payment_method,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            createdAt: o.created_at,
            items: (o.order_items || []).map((it: any) => ({
              id: it.id,
              menuItemId: it.menu_item_id,
              itemName: it.item_name,
              unitPrice: Number(it.unit_price),
              quantity: it.quantity,
              totalPrice: Number(it.total_price),
            })),
          }))
        }
      } catch (e) {
        console.warn('Supabase fetch orders fallback:', e)
      }
    }

    const stored = localStorage.getItem('achou_food_orders')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return mockOrders
      }
    }
    return mockOrders
  },
}
