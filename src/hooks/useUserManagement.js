// filepath: src/hooks/useUserManagement.js
import { useState, useEffect } from 'react';
import { staffUsersApi, rolesApi } from '@/services';

/**
 * Hook quản lý người dùng (nhân viên)
 * - Kết nối API staffUsers và roles
 * - Trả về danh sách, loading, error, style utils
 */
export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  /**
   * Lấy danh sách nhân viên từ BE
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await staffUsersApi.getStaffUsers({
        page: 0,
        size: 50,
        sortBy: 'staffId',
        sortDir: 'desc'
      });

      // API response after extractApiResponse: { content: [...], currentPage, totalPages, ... }
      setUsers(res?.content || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Không thể tải danh sách nhân viên. Vui lòng thử lại.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lấy danh sách vai trò từ BE
   */
  const fetchRoles = async () => {
    try {
      const res = await rolesApi.getRoles({
        page: 0,
        size: 50,
        sortBy: 'roleId',
        sortDir: 'asc'
      });

      setRoles(res?.content || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setRoles([]);
    }
  };

  /**
   * Mapping style cho role (UI)
   */
  const getRoleStyle = (roleName) => {
    const styles = {
      ADMIN: { background: '#fee2e2', color: '#dc2626', label: 'Admin' },
      MANAGER: { background: '#fef3c7', color: '#b45309', label: 'Quản lý' },
      RECEPTIONIST: { background: '#dbeafe', color: '#1e40af', label: 'Lễ tân' },
      TECHNICIAN: { background: '#dcfce7', color: '#166534', label: 'Kỹ thuật viên' }
    };
    return styles[roleName] || { background: '#f3f4f6', color: '#374151', label: roleName || 'Khác' };
  };

  /**
   * Mapping style cho status (UI)
   */
  const getStatusStyle = (status) => {
    const styles = {
      ACTIVE: { background: '#dcfce7', color: '#166534', label: 'Hoạt động' },
      INACTIVE: { background: '#f3f4f6', color: '#6b7280', label: 'Tạm ngưng' },
      LOCKED: { background: '#fee2e2', color: '#dc2626', label: 'Khóa' },
      SUSPENDED: { background: '#fef2f2', color: '#b91c1c', label: 'Đình chỉ' }
    };
    return styles[status] || { background: '#e5e7eb', color: '#374151', label: status || '—' };
  };

  return {
    // State
    users,
    roles,
    loading,
    error,

    // Actions
    fetchUsers,
    fetchRoles,

    // Utils
    getRoleStyle,
    getStatusStyle,
  };
};

export default useUserManagement;
