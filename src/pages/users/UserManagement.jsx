// filepath: admin-spa-management/src/pages/users/UserManagement.jsx
import React, { useMemo, useState } from 'react';
import { useUserManagement } from '@/hooks';
import { staffUsersApi } from '@/services';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Tạm ngưng' },
  { value: 'LOCKED', label: 'Khóa' },
];

// Đã bỏ username và createdAt
const SORTABLE_COLUMNS = [
  { key: 'fullName', label: 'Tên đầy đủ' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'SĐT' },
  { key: 'role', label: 'Vai trò' },
  { key: 'status', label: 'Trạng thái' },
];

const UserManagement = () => {
  const {
    users,
    roles,
    loading,
    error,
    fetchUsers,
    getRoleStyle,
    getStatusStyle,
  } = useUserManagement();

  // UI state
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ key: 'fullName', dir: 'asc' });

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Derived lists
  const roleOptions = useMemo(
    () => [{ name: 'ALL', displayName: 'Tất cả' }, ...roles.map(r => ({
      name: r.name || r.roleName,
      displayName: r.displayName || r.name || r.roleName
    }))],
    [roles]
  );

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    const list = (users || []).filter(u => {
      const roleName = u.role || u.roleName || '';
      const status = u.status || 'ACTIVE';
      const matchText = !text
        || (u.fullName || '').toLowerCase().includes(text)
        || (u.email || '').toLowerCase().includes(text)
        || (u.phone || '').toLowerCase().includes(text);
      const matchRole = roleFilter === 'ALL' || roleName === roleFilter;
      const matchStatus = statusFilter === 'ALL' || status === statusFilter;
      return matchText && matchRole && matchStatus;
    });

    const sorted = [...list].sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      const ak = sort.key;
      const roleA = a.role || a.roleName || '';
      const roleB = b.role || b.roleName || '';
      const valA =
        ak === 'role' ? roleA :
        ak === 'status' ? (a.status || '') :
        (a[ak] || '');
      const valB =
        ak === 'role' ? roleB :
        ak === 'status' ? (b.status || '') :
        (b[ak] || '');
      return String(valA).localeCompare(String(valB)) * dir;
    });

    return sorted;
  }, [users, query, roleFilter, statusFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const paginated = useMemo(() => {
    const start = currentPage * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const onSort = (key) => {
    setSort(prev => {
      if (prev.key === key) {
        return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
      }
      return { key, dir: 'asc' };
    });
  };

  const SortIcon = ({ colKey }) => {
    if (sort.key !== colKey) return <span className="opacity-40">↕</span>;
    return sort.dir === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  // ===== ACTION HANDLERS =====
  const handleCreateSubmit = async (payload) => {
    try {
      await staffUsersApi.createStaffUser(payload);
      setShowCreate(false);
      fetchUsers();
    } catch (err) {
      console.error('Create user failed:', err);
      alert('Không thể tạo nhân viên');
    }
  };

  const handleEditSubmit = async (payload) => {
    try {
      if (!payload.staffId) throw new Error('Thiếu staffId');
      await staffUsersApi.updateStaffUser(payload.staffId, payload);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Update user failed:', err);
      alert('Không thể cập nhật nhân viên');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Xóa nhân viên ${user.fullName}?`)) return;
    try {
      await staffUsersApi.deleteStaffUser(user.staffId);
      fetchUsers();
    } catch (err) {
      console.error('Delete user failed:', err);
      alert('Không thể xóa nhân viên');
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await staffUsersApi.updateStaffUserStatus(user.staffId, { status: newStatus });
      fetchUsers();
    } catch (err) {
      console.error('Toggle status failed:', err);
      alert('Không thể cập nhật trạng thái');
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center">
        <div className="h-12 w-12 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">Đang tải danh sách nhân viên...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">👥 Quản lý Nhân viên</h1>
          <p className="text-sm text-gray-500">Quản trị tài khoản và vai trò nhân sự</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            🔄 Tải lại
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700"
          >
            ➕ Thêm nhân viên mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        {paginated.length === 0 ? (
          <div className="p-10 text-center text-gray-500">Không có dữ liệu phù hợp</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-pink-50">
              <tr className="text-gray-700">
                <th className="px-4 py-3">#</th>
                {SORTABLE_COLUMNS.map(col => (
                  <th
                    key={col.key}
                    className="px-4 py-3 font-semibold cursor-pointer select-none"
                    onClick={() => onSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{col.label}</span>
                      <SortIcon colKey={col.key} />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((u, idx) => {
                const roleName = u.role || u.roleName || 'ADMIN';
                const status = u.status || 'ACTIVE';
                const r = getRoleStyle(roleName);
                const s = getStatusStyle(status);

                return (
                  <tr key={u.staffId} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{currentPage * pageSize + idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{u.fullName}</td>
                    <td className="px-4 py-3">{u.email || '—'}</td>
                    <td className="px-4 py-3">{u.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ background: r.background, color: r.color }}
                      >
                        {r.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ background: s.background, color: s.color }}
                      >
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          onClick={() => setEditUser({ ...u, __viewOnly: true })}
                        >
                          👁️
                        </button>
                        <button
                          className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => setEditUser(u)}
                        >
                          ✏️
                        </button>
                        <button
                          className="px-2 py-1 rounded bg-yellow-100 hover:bg-yellow-200"
                          onClick={() => handleToggleStatus(u)}
                        >
                          🔒
                        </button>
                        <button
                          className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                          onClick={() => handleDelete(u)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
