import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import Layout from '@/components/Layout/Layout'
import ConsultationDashboard from '@/pages/ConsultationDashboard/ConsultationDashboard'
import AppointmentsManagement from '@/pages/Receptionist/AppointmentsManagement'
import CheckinProcess from '@/pages/Receptionist/CheckinProcess'
import Login from '@/pages/Login/Login'
import PrivateRoute from '@/components/guards/PrivateRoute'
import RoleGuard, { ForbiddenPage } from '@/components/guards/RoleGuard'
import AdminDashboard from '@/pages/dashboards/AdminDashboard'
import ReceptionistDashboard from '@/pages/dashboards/ReceptionistDashboard'
import TechnicianDashboard from '@/pages/dashboards/TechnicianDashboard'
import CustomerList from '@/pages/customers/CustomerList'
import CustomerProfilePage from '@/pages/customers/CustomerProfile/CustomerProfilePage'
import ServiceManagement from '@/pages/services/ServiceManagement'
import AppointmentCalendar from '@/pages/appointments/AppointmentCalendar'
import PhotoGallery from '@/pages/photos/PhotoGallery'
import UserManagement from '@/pages/users/UserManagement'
import TreatmentProcess from '@/pages/technician/TreatmentProcess'
import TechnicianCustomerList from '@/pages/technician/CustomerList'
import Reports from '@/pages/admin/Reports'
import Settings from '@/pages/admin/Settings'
import PaymentManagement from '@/pages/admin/PaymentManagement'
import TaskManagement from '@/pages/admin/TaskManagement'
import Permissions from '@/pages/admin/Permissions'
import StaffFieldPermissionsPage from '@/pages/admin/StaffFieldPermissionsPage'
import { useAuth } from '@/hooks/useAuth'
import { useRoleRouting } from '@/hooks/useRoleRouting'
import { LoadingSpinner, ErrorPage } from '@/components/common/CommonComponents'
import ErrorBoundary from '@/components/ErrorBoundary'

/**
 * Route Configuration - Centralized route definitions
 */
const ROUTE_CONFIG = {
  ADMIN: {
    dashboard: { path: '/admin/dashboard', component: AdminDashboard, roles: ['ADMIN'] },
    customers: { path: '/admin/customers', component: CustomerList, roles: ['ADMIN'] },
    customerProfile: { path: '/admin/customers/:customerId', component: CustomerProfilePage, roles: ['ADMIN'] },
    services: { path: '/admin/services', component: ServiceManagement, roles: ['ADMIN'] },
    appointments: { path: '/admin/appointments', component: AppointmentCalendar, roles: ['ADMIN'] },
    users: { path: '/admin/users', component: UserManagement, roles: ['ADMIN'] },
    reports: {
      path: '/admin/reports',
      component: Reports,
      roles: ['ADMIN']
    },
    payments: {
      path: '/admin/payments',
      component: PaymentManagement,
      roles: ['ADMIN', 'RECEPTIONIST']
    },
    tasks: {
      path: '/admin/tasks',
      component: TaskManagement,
      roles: ['ADMIN']
    },
    permissions: {
      path: '/admin/permissions',
      component: Permissions,
      roles: ['ADMIN']
    },
    settings: {
      path: '/admin/settings',
      component: Settings,
      roles: ['ADMIN']
    },
    staffPermissions: {
      path: '/admin/staff-permissions',
      component: StaffFieldPermissionsPage,
      roles: ['ADMIN']
    }
  },
  RECEPTIONIST: {
    dashboard: { path: '/receptionist/dashboard', component: ReceptionistDashboard, roles: ['RECEPTIONIST'] },
    consultation: { path: '/receptionist/consultation', component: ConsultationDashboard, roles: ['RECEPTIONIST', 'ADMIN'] },
    appointments: { path: '/receptionist/appointments', component: AppointmentsManagement, roles: ['RECEPTIONIST'] },
    customers: { path: '/receptionist/customers', component: CustomerList, roles: ['RECEPTIONIST'] },
    customerProfile: { path: '/receptionist/customers/:customerId', component: CustomerProfilePage, roles: ['RECEPTIONIST'] },
    checkin: {
      path: '/receptionist/checkin',
      component: CheckinProcess,
      roles: ['RECEPTIONIST']
    },
    payments: {
      path: '/receptionist/payments',
      component: PaymentManagement,
      roles: ['RECEPTIONIST']
    }
  },
  TECHNICIAN: {
    dashboard: { path: '/technician/dashboard', component: TechnicianDashboard, roles: ['TECHNICIAN'] },
    customerList: { path: '/technician/customer-list', component: TechnicianCustomerList, roles: ['TECHNICIAN'] },
    customers: { path: '/technician/customers', component: CustomerList, roles: ['TECHNICIAN'] },
    customerProfile: { path: '/technician/customers/:customerId', component: CustomerProfilePage, roles: ['TECHNICIAN'] },
    appointments: { path: '/technician/appointments', component: AppointmentCalendar, roles: ['TECHNICIAN'] },
    photos: { path: '/technician/photos', component: PhotoGallery, roles: ['TECHNICIAN'] },
    treatments: {
      path: '/technician/treatments',
      component: TreatmentProcess,
      roles: ['TECHNICIAN']
    }
  }
}

// ========= Customer Profile Wrapper Component =========
const CustomerProfileWrapper = ({ Component, user, userRole }) => {
  const { customerId } = useParams()
  return <Component user={user} userRole={userRole} customerId={customerId} />
}

/**
 * Route Content Component - handles role-based content rendering
 */
const RouteContent = ({ user, userRole, onLogout }) => {
  const { getRoleBasedMenuItems, getRoleDefaultPath } = useRoleRouting()
  const menuItems = getRoleBasedMenuItems(userRole)

  const renderProtectedRoute = (routeConfig) => {
    const { component: Component, roles, path } = routeConfig

    // Check if this is a customer profile route that needs customerId
    const isCustomerProfileRoute = path.includes(':customerId')

    return (
      <Route
        key={path}
        path={path}
        element={
          <RoleGuard
            requiredRoles={roles}
            userRole={userRole}
            currentPath={path}
          >
            {isCustomerProfileRoute ? (
              <CustomerProfileWrapper Component={Component} user={user} userRole={userRole} />
            ) : (
              <Component user={user} userRole={userRole} />
            )}
          </RoleGuard>
        }
      />
    )
  }

  const renderAllRoutes = () => {
    const allRoutes = []

    // Add default route
    allRoutes.push(
      <Route
        key="/"
        path="/"
        element={
          <Navigate
            to={getRoleDefaultPath(userRole)}
            replace
          />
        }
      />
    )

    // Add admin routes
    Object.values(ROUTE_CONFIG.ADMIN).forEach(route => {
      allRoutes.push(renderProtectedRoute(route))
    })

    // Add receptionist routes
    Object.values(ROUTE_CONFIG.RECEPTIONIST).forEach(route => {
      allRoutes.push(renderProtectedRoute(route))
    })

    // Add technician routes
    Object.values(ROUTE_CONFIG.TECHNICIAN).forEach(route => {
      allRoutes.push(renderProtectedRoute(route))
    })

    // Add forbidden page
    allRoutes.push(
      <Route key="/403" path="/403" element={<ForbiddenPage />} />
    )

    // Add fallback route
    allRoutes.push(
      <Route
        key="*"
        path="*"
        element={
          <Navigate
            to={getRoleDefaultPath(userRole)}
            replace
          />
        }
      />
    )

    return allRoutes
  }

  return (
    <Layout onLogout={onLogout} user={user} menuItems={menuItems}>
      <Routes>
        {renderAllRoutes()}
      </Routes>
    </Layout>
  )
}

/**
 * Main App Component
 */
function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}

function AppContent() {
  const {
    isLoggedIn,
    user,
    userRole,
    loading,
    error,
    handleLogin,
    handleLogout
  } = useAuth()

  // Show loading spinner
  if (loading) {
    return <LoadingSpinner />
  }

  // Show error page if authentication failed
  if (error) {
    return <ErrorPage error={error} onLogout={handleLogout} />
  }

  // Show login page if not authenticated
  if (!isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </Router>
    )
  }

  // Show main application
  return (
    <Router>
      <PrivateRoute>
        <RouteContent
          user={user}
          userRole={userRole}
          onLogout={handleLogout}
        />
      </PrivateRoute>
    </Router>
  )
}

export default App
