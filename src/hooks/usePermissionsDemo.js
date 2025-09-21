import { useState, useEffect } from 'react';
import { permissionsApi, staffFieldPermissionsApi } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import { STAFF_FIELD_PERMISSIONS_MAP, PERMISSION_LEVEL_MAP, PERMISSION_CATEGORIES } from '@/config/constants';

export const usePermissionsDemo = () => {
  const { user } = useAuth();
  
  // State for both permission systems
  const [permissions, setPermissions] = useState([]);
  const [fieldPermissions, setFieldPermissions] = useState([]);
  const [staffFieldPermissions, setStaffFieldPermissions] = useState({}); // New system
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Demo state
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedPermissionLevel, setSelectedPermissionLevel] = useState('VIEW');

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Load staff field permissions when staffId changes
  useEffect(() => {
    if (selectedStaffId) {
      loadStaffFieldPermissions(selectedStaffId);
    }
  }, [selectedStaffId]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const [permissionsData, fieldPermissionsData] = await Promise.all([
        permissionsApi.getAllPermissions(),
        permissionsApi.getAllFieldPermissions()
      ]);

      setPermissions(permissionsData || []);
      setFieldPermissions(fieldPermissionsData || []);
      
      // Fetch new staff field permissions if staffId is selected
      if (selectedStaffId) {
        try {
          const staffPerms = await staffFieldPermissionsApi.getPermissions(selectedStaffId);
          setStaffFieldPermissions(staffPerms || {});
        } catch (staffError) {
          console.warn('Staff field permissions not found, will create default:', staffError);
          setStaffFieldPermissions({});
        }
      }
      
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setError('Không thể tải danh sách quyền hạn');
    } finally {
      setLoading(false);
    }
  };

  // Load staff field permissions
  const loadStaffFieldPermissions = async (staffId) => {
    if (!staffId) return;
    
    setLoading(true);
    try {
      const permissions = await staffFieldPermissionsApi.getPermissions(staffId);
      setStaffFieldPermissions(permissions || {});
    } catch (error) {
      console.warn('Staff field permissions not found, creating default permissions');
      try {
        const newPermissions = await staffFieldPermissionsApi.createPermissions(staffId);
        setStaffFieldPermissions(newPermissions || {});
      } catch (createError) {
        console.error('Error creating default permissions:', createError);
        setError('Không thể tạo quyền mặc định');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPermission = async () => {
    if (!selectedStaffId || !selectedCustomerId) {
      setError('Vui lòng nhập Staff ID và Customer ID');
      return;
    }

    try {
      setLoading(true);
      const results = {};

      // Check field permissions for customer data
      const fields = ['NAME', 'PHONE', 'EMAIL', 'ADDRESS', 'DOB', 'NOTES'];
      for (const field of fields) {
        const canRead = await permissionsApi.canReadCustomerField(selectedStaffId, field.toLowerCase(), selectedCustomerId);
        const canWrite = await permissionsApi.canWriteCustomerField(selectedStaffId, field.toLowerCase(), selectedCustomerId);
        results[field] = { canRead, canWrite };
      }

      console.log('Permission check results:', results);
      alert('Kiểm tra quyền thành công! Xem console để xem kết quả.');

    } catch (error) {
      console.error('Error checking permissions:', error);
      setError('Không thể kiểm tra quyền hạn');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantFieldPermission = async (scope, user) => {
    if (!selectedStaffId || !selectedCustomerId) {
      setError('Vui lòng nhập Staff ID và Customer ID');
      return;
    }

    try {
      setLoading(true);
      await permissionsApi.grantFieldPermission(
        selectedStaffId,
        scope,
        selectedCustomerId,
        user?.staffId || 1,
        null,
        `Demo permission for ${scope}`
      );

      alert(`Đã cấp quyền ${scope} thành công!`);
      fetchPermissions(); // Refresh list

    } catch (error) {
      console.error('Error granting permission:', error);
      setError('Không thể cấp quyền');
    } finally {
      setLoading(false);
    }
  };

  // NEW SYSTEM FUNCTIONS

  // Update field permission level
  const handleUpdateFieldPermission = async (fieldName, permissionLevel) => {
    if (!selectedStaffId) {
      setError('Vui lòng nhập Staff ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await staffFieldPermissionsApi.grantFieldPermission(selectedStaffId, fieldName, permissionLevel);
      await loadStaffFieldPermissions(selectedStaffId);
      alert(`Đã cập nhật quyền "${fieldName}" thành "${permissionLevel}"`);
    } catch (error) {
      console.error('Error updating field permission:', error);
      setError('Không thể cập nhật quyền');
    } finally {
      setLoading(false);
    }
  };

  // Set role default permissions
  const handleSetRoleDefaults = async (roleName) => {
    if (!selectedStaffId) {
      setError('Vui lòng nhập Staff ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await staffFieldPermissionsApi.setRoleDefaultPermissions(selectedStaffId, roleName);
      await loadStaffFieldPermissions(selectedStaffId);
      alert(`Đã thiết lập quyền mặc định cho role "${roleName}"`);
    } catch (error) {
      console.error('Error setting role defaults:', error);
      setError('Không thể thiết lập quyền mặc định');
    } finally {
      setLoading(false);
    }
  };

  // Get permissions grouped by category
  const getPermissionsByCategory = () => {
    const categorized = {};
    
    Object.entries(staffFieldPermissions).forEach(([fieldName, permissionLevel]) => {
      if (fieldName === 'staffId') return;
      
      const fieldConfig = STAFF_FIELD_PERMISSIONS_MAP[fieldName];
      if (!fieldConfig) return;
      
      const category = fieldConfig.category;
      if (!categorized[category]) {
        categorized[category] = {
          ...PERMISSION_CATEGORIES[category],
          fields: {}
        };
      }
      
      categorized[category].fields[fieldName] = {
        level: permissionLevel,
        label: fieldConfig.label,
        description: fieldConfig.description,
        config: fieldConfig
      };
    });
    
    return categorized;
  };

  const initializeSystemPermissions = async () => {
    try {
      setLoading(true);
      await permissionsApi.initializeSystemPermissions();
      alert('Khởi tạo system permissions thành công!');
      fetchPermissions();
    } catch (error) {
      console.error('Error initializing system permissions:', error);
      setError('Không thể khởi tạo system permissions');
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultFieldPermissions = async () => {
    try {
      setLoading(true);
      await permissionsApi.initializeDefaultFieldPermissions();
      alert('Khởi tạo field permissions thành công!');
      fetchPermissions();
    } catch (error) {
      console.error('Error initializing field permissions:', error);
      setError('Không thể khởi tạo field permissions');
    } finally {
      setLoading(false);
    }
  };
  
  // Computed values
  const hasStaffPermissions = Object.keys(staffFieldPermissions).length > 0;
  const categorizedPermissions = hasStaffPermissions ? getPermissionsByCategory() : {};

  return {
    // Data
    permissions,
    fieldPermissions,
    staffFieldPermissions,
    categorizedPermissions,
    hasStaffPermissions,
    loading,
    error,

    // State
    selectedStaffId,
    selectedCustomerId,
    selectedPermissionLevel,
    setSelectedStaffId,
    setSelectedCustomerId,
    setSelectedPermissionLevel,

    // Old system functions
    fetchPermissions,
    handleCheckPermission,
    handleGrantFieldPermission,
    initializeSystemPermissions,
    initializeDefaultFieldPermissions,

    // New system functions
    loadStaffFieldPermissions,
    handleUpdateFieldPermission,
    handleSetRoleDefaults,

    // Utilities
    STAFF_FIELD_PERMISSIONS_MAP,
    PERMISSION_LEVEL_MAP,
    PERMISSION_CATEGORIES
  };
};