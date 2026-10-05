import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { AdminProvider } from '@/context/AdminContext'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { DashboardView } from './views/DashboardView'
import { RestaurantsView } from './views/RestaurantsView'
import { OrdersKanbanView } from './views/OrdersKanbanView'
import { MenusView } from './views/MenusView'
import { CustomersView } from './views/CustomersView'
import { DeliveriesView } from './views/DeliveriesView'
import { FinanceView } from './views/FinanceView'
import { AdminMapView } from './views/AdminMapView'
import { ReportsView } from './views/ReportsView'
import { CouponsView } from './views/CouponsView'
import { NotificationsView } from './views/NotificationsView'
import { SettingsView } from './views/SettingsView'

const AdminContent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'dashboard'
  const [currentTab, setCurrentTab] = useState<string>(initialTab)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Atualiza tab quando URL mudar
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && tabParam !== currentTab) {
      setCurrentTab(tabParam)
    }
  }, [searchParams])

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab)
    setSearchParams({ tab })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView onNavigate={handleSelectTab} />
      case 'restaurants':
        return <RestaurantsView onNavigateToMap={() => handleSelectTab('map')} />
      case 'orders':
        return <OrdersKanbanView />
      case 'menus':
        return <MenusView />
      case 'customers':
        return <CustomersView />
      case 'deliveries':
        return <DeliveriesView />
      case 'finance':
        return <FinanceView />
      case 'map':
        return <AdminMapView />
      case 'reports':
        return <ReportsView />
      case 'coupons':
        return <CouponsView />
      case 'notifications':
        return <NotificationsView onNavigate={handleSelectTab} />
      case 'settings':
        return <SettingsView />
      default:
        return <DashboardView onNavigate={handleSelectTab} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans antialiased text-gray-900">
      {/* Sidebar (Desktop fixa à esquerda, mobile menu lateral retrátil) */}
      <AdminSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      {/* Área Principal de Conteúdo (Margem esquerda na largura da sidebar em desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Header Superior Fixo com Busca, Notificações e Perfil */}
        <AdminHeader
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
        />

        {/* Conteúdo Dinâmico */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  )
}

export const AdminLayout: React.FC = () => {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  )
}
