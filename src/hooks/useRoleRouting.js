import { getRoleBasedMenuItems, getRoleDefaultPath, isValidRole } from '@/utils/roleRouting'

/**
 * Custom hook for role-based routing
 * Provides role validation and menu generation
 */
export const useRoleRouting = () => {
  /**
   * Get menu items based on user role
   * @param {string} userRole - User's role (ADMIN, RECEPTIONIST, TECHNICIAN)
   * @returns {Array} Array of menu items for the user's role
   */
  const getMenuItems = (userRole) => {
    if (!userRole || !isValidRole(userRole)) {
      return []
    }
    return getRoleBasedMenuItems(userRole)
  }

  /**
   * Get default path for user role
   * @param {string} userRole - User's role
   * @returns {string} Default path for the user's role
   */
  const getDefaultPath = (userRole) => {
    if (!userRole || !isValidRole(userRole)) {
      return '/'
    }
    return getRoleDefaultPath(userRole)
  }

  /**
   * Check if user has access to a specific route
   * @param {string} userRole - User's role
   * @param {Array} requiredRoles - Array of roles that can access the route
   * @returns {boolean} True if user has access
   */
  const hasRouteAccess = (userRole, requiredRoles) => {
    if (!userRole || !Array.isArray(requiredRoles)) {
      return false
    }
    return requiredRoles.includes(userRole)
  }

  /**
   * Get all accessible routes for a user role
   * @param {string} userRole - User's role
   * @returns {Object} Object containing accessible routes
   */
  const getAccessibleRoutes = (userRole) => {
    if (!userRole || !isValidRole(userRole)) {
      return {}
    }

    const baseRoutes = {
      dashboard: `/${userRole.toLowerCase()}/dashboard`
    }

    // Add role-specific routes
    switch (userRole) {
      case 'ADMIN':
        return {
          ...baseRoutes,
          customers: '/admin/customers',
          services: '/admin/services',
          appointments: '/admin/appointments',
          users: '/admin/users',
          reports: '/admin/reports',
          settings: '/admin/settings',
          consultation: '/receptionist/consultation' // Admin can access receptionist features
        }
      case 'RECEPTIONIST':
        return {
          ...baseRoutes,
          consultation: '/receptionist/consultation',
          customers: '/receptionist/customers',
          appointments: '/receptionist/appointments'
        }
      case 'TECHNICIAN':
        return {
          ...baseRoutes,
          customers: '/technician/customers',
          appointments: '/technician/appointments',
          photos: '/technician/photos',
          treatments: '/technician/treatments'
        }
      default:
        return baseRoutes
    }
  }

  return {
    getRoleBasedMenuItems: getMenuItems,
    getRoleDefaultPath: getDefaultPath,
    hasRouteAccess,
    getAccessibleRoutes,
    isValidRole
  }
}
