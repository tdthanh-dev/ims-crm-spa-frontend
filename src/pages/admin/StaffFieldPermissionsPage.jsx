import React from 'react';
import StaffFieldPermissionsManager from '@/components/admin/StaffFieldPermissionsManager';

/**
 * Staff Field Permissions Page - Admin Panel
 * Allows administrators to manage field-level permissions for staff users
 */
const StaffFieldPermissionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <StaffFieldPermissionsManager />
    </div>
  );
};

export default StaffFieldPermissionsPage;
