// filepath: src/services/staffFieldPermissionsApi.js
import apiClient from './apiClient';
import { extractApiResponse } from '@/utils/apiUtils';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Staff Field Permissions API - New permission system
 * Handles field-level permissions with PermissionLevel (NO, VIEW, EDIT)
 */
export const staffFieldPermissionsApi = {
  /**
   * Create default permissions for staff
   */
  async create(staffId) {
    const response = await apiClient.post(`${API_ENDPOINTS.STAFF_FIELD_PERMISSIONS}`, null, {
      params: { staffId }
    });
    return extractApiResponse(response);
  },

  /**
   * Get permissions by staff ID
   */
  async getByStaffId(staffId) {
    const response = await apiClient.get(`${API_ENDPOINTS.STAFF_FIELD_PERMISSIONS}/${staffId}`);
    return extractApiResponse(response);
  },

  /**
   * Update permissions for staff
   */
  async update(staffId, permissions) {
    const response = await apiClient.put(
      `${API_ENDPOINTS.STAFF_FIELD_PERMISSIONS}/${staffId}`,
      permissions
    );
    return extractApiResponse(response);
  },

  /**
   * Check if staff has permission for specific field
   */
  async hasFieldPermission(staffId, fieldName, requiredLevel = 'VIEW') {
    try {
      const permissions = await this.getByStaffId(staffId);
      const fieldPermission = permissions[fieldName];

      if (!fieldPermission || fieldPermission === 'NO') {
        return false;
      }

      if (requiredLevel === 'VIEW') {
        return fieldPermission === 'VIEW' || fieldPermission === 'EDIT';
      }

      if (requiredLevel === 'EDIT') {
        return fieldPermission === 'EDIT';
      }

      return false;
    } catch (error) {
      console.error('Error checking field permission:', error);
      return false;
    }
  },

  /**
   * Bulk update multiple field permissions
   */
  async bulkUpdateFieldPermissions(staffId, fieldUpdates) {
    const currentPermissions = await this.getByStaffId(staffId);
    const updatedPermissions = {
      ...currentPermissions,
      ...fieldUpdates
    };
    return this.update(staffId, updatedPermissions);
  },

  /**
   * Grant permission level to specific field
   */
  async grantFieldPermission(staffId, fieldName, permissionLevel) {
    return this.bulkUpdateFieldPermissions(staffId, {
      [fieldName]: permissionLevel
    });
  },

  /**
   * Revoke permission for specific field (set to NO)
   */
  async revokeFieldPermission(staffId, fieldName) {
    return this.grantFieldPermission(staffId, fieldName, 'NO');
  },

  /**
   * Get permissions grouped by category
   */
  async getPermissionsByCategory(staffId) {
    const permissions = await this.getByStaffId(staffId);
    const { STAFF_FIELD_PERMISSIONS_MAP } = await import('@/config/constants');

    const categorized = {};
    Object.entries(permissions).forEach(([fieldName, permissionLevel]) => {
      if (fieldName === 'staffId') return;

      const fieldConfig = STAFF_FIELD_PERMISSIONS_MAP[fieldName];
      if (!fieldConfig) return;

      const category = fieldConfig.category;
      if (!categorized[category]) {
        categorized[category] = {};
      }

      categorized[category][fieldName] = {
        level: permissionLevel,
        label: fieldConfig.label,
        description: fieldConfig.description
      };
    });

    return categorized;
  },

  /**
   * Set default permissions for a role
   */
  async setRoleDefaultPermissions(staffId, roleName) {
    let defaultPermissions = {};
    const { STAFF_FIELD_PERMISSIONS_MAP } = await import('@/config/constants');

    switch (roleName) {
      case 'ADMIN':
        defaultPermissions = Object.keys(STAFF_FIELD_PERMISSIONS_MAP).reduce((acc, key) => {
          acc[key] = 'EDIT';
          return acc;
        }, {});
        break;

      case 'TECHNICIAN':
        defaultPermissions = {
          customerName: 'VIEW',
          customerPhone: 'VIEW',
          customerEmail: 'VIEW',
          customerDob: 'VIEW',
          customerGender: 'VIEW',
          customerAddress: 'VIEW',
          customerNotes: 'EDIT',
          customerTotalSpent: 'VIEW',
          customerTotalPoints: 'VIEW',
          customerTier: 'VIEW',
          customerVipStatus: 'VIEW',
          appointmentView: 'VIEW',
          appointmentCreate: 'NO',
          appointmentUpdate: 'VIEW',
          appointmentCancel: 'NO',
          invoiceView: 'VIEW',
          invoiceCreate: 'NO',
          invoiceUpdate: 'NO',
          historyView: 'VIEW',
          historyExport: 'NO'
        };
        break;

      case 'RECEPTIONIST':
        defaultPermissions = {
          customerName: 'EDIT',
          customerPhone: 'EDIT',
          customerEmail: 'EDIT',
          customerDob: 'EDIT',
          customerGender: 'EDIT',
          customerAddress: 'EDIT',
          customerNotes: 'EDIT',
          customerTotalSpent: 'VIEW',
          customerTotalPoints: 'VIEW',
          customerTier: 'VIEW',
          customerVipStatus: 'VIEW',
          appointmentView: 'EDIT',
          appointmentCreate: 'EDIT',
          appointmentUpdate: 'EDIT',
          appointmentCancel: 'EDIT',
          invoiceView: 'EDIT',
          invoiceCreate: 'EDIT',
          invoiceUpdate: 'VIEW',
          historyView: 'VIEW',
          historyExport: 'VIEW'
        };
        break;

      default:
        defaultPermissions = Object.keys(STAFF_FIELD_PERMISSIONS_MAP).reduce((acc, field) => {
          acc[field] = 'NO';
          return acc;
        }, {});
    }

    return this.update(staffId, defaultPermissions);
  },

  /**
   * Validate permission data
   */
  validatePermissions(permissions) {
    const errors = [];
    const validLevels = ['NO', 'VIEW', 'EDIT'];
    const { STAFF_FIELD_PERMISSIONS_MAP } = require('@/config/constants');

    Object.entries(permissions).forEach(([fieldName, level]) => {
      if (fieldName === 'staffId') return;

      if (!STAFF_FIELD_PERMISSIONS_MAP[fieldName]) {
        errors.push(`Unknown field: ${fieldName}`);
      }

      if (!validLevels.includes(level)) {
        errors.push(
          `Invalid permission level "${level}" for field "${fieldName}". Valid levels: ${validLevels.join(', ')}`
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default staffFieldPermissionsApi;
