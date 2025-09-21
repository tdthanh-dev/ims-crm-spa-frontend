// filepath: admin-spa-management/src/utils/roleRouting.js

import { ROLE_MENUS, ROLE_DEFAULT_PATHS, ROLES } from '@/config/roleMenus';

/**
 * Get menu items based on user role
 * @param {string} userRole - Role of the current user (ADMIN, TECHNICIAN, RECEPTIONIST)
 * @returns {Array} Array of menu items for the role
 */
export const getRoleBasedMenuItems = (userRole) => {
  if (!userRole || !ROLE_MENUS[userRole]) {
    console.warn(`Invalid role: ${userRole}, returning empty menu`);
    return [];
  }
  
  return ROLE_MENUS[userRole];
};

/**
 * Check if user has access to a specific path
 * @param {string} userRole - Role of the current user
 * @param {string} path - Path to check access for
 * @returns {boolean} True if user has access, false otherwise
 */
export const hasAccess = (userRole, path) => {
  if (!userRole) return false;
  
  const menuItems = getRoleBasedMenuItems(userRole);
  return menuItems.some(item => path.startsWith(item.path));
};

/**
 * Get default dashboard path for user role
 * @param {string} userRole - Role of the current user
 * @returns {string} Default path for the role
 */
export const getRoleDefaultPath = (userRole) => {
  return ROLE_DEFAULT_PATHS[userRole] || '/';
};

/**
 * Check if role is valid
 * @param {string} role - Role to validate
 * @returns {boolean} True if role is valid
 */
export const isValidRole = (role) => {
  return Object.values(ROLES).includes(role);
};

/**
 * Get all valid roles
 * @returns {Array} Array of all valid role names
 */
export const getAllRoles = () => {
  return Object.values(ROLES);
};

/**
 * Get role display name (for UI)
 * @param {string} role - Role name
 * @returns {string} Display name for the role
 */
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [ROLES.ADMIN]: 'Quản trị viên',
    [ROLES.TECHNICIAN]: 'Kỹ thuật viên',
    [ROLES.RECEPTIONIST]: 'Lễ tân'
  };
  
  return displayNames[role] || role;
};

/**
 * Get role color for UI styling
 * @param {string} role - Role name
 * @returns {string} Color code for the role
 */
export const getRoleColor = (role) => {
  const colors = {
    [ROLES.ADMIN]: '#dc2626', // Red
    [ROLES.TECHNICIAN]: '#10b981', // Green  
    [ROLES.RECEPTIONIST]: '#3b82f6' // Blue
  };
  
  return colors[role] || '#6b7280'; // Default gray
};
