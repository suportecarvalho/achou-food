import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { HomePage } from '@/pages/HomePage'
import { RestaurantPage } from '@/pages/RestaurantPage'
import { RestaurantMenuPage } from '@/pages/RestaurantMenuPage'
import { CartPage } from '@/pages/CartPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { LoginPage } from '@/pages/LoginPage'
import { AdminLayout } from '@/pages/admin/AdminLayout'

export function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-100 flex flex-col font-sans selection:bg-red-base/20 selection:text-red-base">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<HomePage />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/restaurant/:id/menu" element={<RestaurantMenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminLayout />} />
              <Route path="/admin/*" element={<AdminLayout />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </CartProvider>
      </FavoritesProvider>
    </BrowserRouter>
  )
}

export default App
