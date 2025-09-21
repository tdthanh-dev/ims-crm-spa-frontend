import { useState, useEffect } from 'react';
import { tasksAPI, auditAPI } from '@/services';
import { useAuth } from '@/hooks/useAuth';

export const useTaskManagement = () => {
  const { userRole, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'tasks') {
        const tasksResponse = await tasksAPI.getAll(0, 50);
        setTasks(tasksResponse.data?.content || []);
      } else {
        const auditResponse = await auditAPI.getLogs(0, 50);
        setAuditLogs(auditResponse.data?.content || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Có lỗi khi tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      const statusData = {
        status: newStatus,
        reason: `Updated by ${userRole} at ${new Date().toISOString()}`
      };

      await tasksAPI.updateStatus(taskId, statusData);
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      throw new Error('Có lỗi khi cập nhật trạng thái task');
    }
  };

  const getTaskStatusBadge = (status) => {
    const statusMap = {
      'TODO': { class: 'todo', label: 'Chưa làm', color: '#6b7280', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
      'IN_PROGRESS': { class: 'in-progress', label: 'Đang làm', color: '#3b82f6', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
      'REVIEW': { class: 'review', label: 'Đang review', color: '#f59e0b', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
      'COMPLETED': { class: 'completed', label: 'Hoàn thành', color: '#10b981', bgColor: 'bg-green-100', textColor: 'text-green-800' },
      'CANCELLED': { class: 'cancelled', label: 'Đã hủy', color: '#ef4444', bgColor: 'bg-red-100', textColor: 'text-red-800' }
    };
    return statusMap[status] || statusMap.TODO;
  };

  const getAuditActionBadge = (action) => {
    const actionMap = {
      'CREATE': { class: 'create', label: 'Tạo mới', color: '#10b981', bgColor: 'bg-green-100', textColor: 'text-green-800' },
      'UPDATE': { class: 'update', label: 'Cập nhật', color: '#3b82f6', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
      'DELETE': { class: 'delete', label: 'Xóa', color: '#ef4444', bgColor: 'bg-red-100', textColor: 'text-red-800' },
      'LOGIN': { class: 'login', label: 'Đăng nhập', color: '#8b5cf6', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
      'LOGOUT': { class: 'logout', label: 'Đăng xuất', color: '#6b7280', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
    };
    return actionMap[action] || { class: 'unknown', label: action, color: '#6b7280', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchTerm ||
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = !searchTerm ||
      log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleRetry = () => {
    loadData();
  };

  const canManageTasks = userRole === 'ADMIN' || userRole === 'MANAGER';
  const canUpdateTask = (task) => canManageTasks || task.assignedTo === user?.name;

  return {
    // State
    tasks,
    auditLogs,
    loading,
    error,
    activeTab,
    searchTerm,
    statusFilter,
    selectedTask,

    // Computed
    filteredTasks,
    filteredAuditLogs,

    // Actions
    setActiveTab,
    setSearchTerm,
    setStatusFilter,
    setSelectedTask,
    handleTaskStatusUpdate,
    getTaskStatusBadge,
    getAuditActionBadge,
    handleRetry,

    // Permissions
    userRole,
    user,
    canManageTasks,
    canUpdateTask
  };
};