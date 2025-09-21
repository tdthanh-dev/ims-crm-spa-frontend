// filepath: admin-spa-management/src/pages/services/ServiceManagement.jsx

import React, { useState, useEffect } from 'react';
import { servicesApi } from '@/services';

/**
 * Service Management Component - ADMIN only
 * CRUD interface for managing spa services
 */
const ServiceManagement = () => {
  const [data, setData] = useState({
    services: [],
    categories: [],
    totalElements: 0,
    loading: true,
    error: null,
  });

  const [filters, setFilters] = useState({
    searchTerm: '',
    categoryFilter: '',
    statusFilter: '',
  });

  const [filteredData, setFilteredData] = useState({
    services: [],
    totalElements: 0,
    categories: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    category: '',
    price: '',
    promotionalPrice: '',
    durationMinutes: '',
    isActive: true,
    notes: '',
    requiresConsultation: false,
  });

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  // Filter services whenever data or filters change
  useEffect(() => {
    let filteredServices = [...data.services];

    // Apply search filter
    if (filters.searchTerm) {
      filteredServices = filteredServices.filter(service =>
        service.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        service.code.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.categoryFilter) {
      filteredServices = filteredServices.filter(service =>
        service.category === filters.categoryFilter
      );
    }

    // Apply status filter
    if (filters.statusFilter) {
      const isActiveFilter = filters.statusFilter === 'ACTIVE';
      filteredServices = filteredServices.filter(service =>
        service.isActive === isActiveFilter
      );
    }

    // Update categories with correct counts
    const updatedCategories = data.categories.map(category => {
      const categoryServices = data.services.filter(service =>
        service.category === category.code
      );

      const filteredCategoryServices = categoryServices.filter(service => {
        let matches = true;

        if (filters.searchTerm) {
          matches = matches && (
            service.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            service.code.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
          );
        }

        if (filters.statusFilter) {
          const isActiveFilter = filters.statusFilter === 'ACTIVE';
          matches = matches && service.isActive === isActiveFilter;
        }

        return matches;
      });

      return {
        ...category,
        serviceCount: filteredCategoryServices.length
      };
    });

    setFilteredData({
      services: filteredServices,
      totalElements: filteredServices.length,
      categories: updatedCategories
    });
  }, [data.services, data.categories, filters]);

  const fetchServices = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      const response = await servicesApi.getServices({
        page: 0,
        size: 50,
        sortBy: 'serviceId',
        sortDir: 'desc',
      });

      setData((prev) => ({
        ...prev,
        services: response.content || [],
        totalElements: response.totalElements || 0,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching services:', error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: 'Không thể tải danh sách dịch vụ. Vui lòng thử lại.',
      }));
    }
  };

  const fetchCategories = async () => {
    const defaultCategories = [
      { code: 'LIP', displayName: 'Dịch vụ môi', icon: '💋', serviceCount: 0 },
      { code: 'BROW', displayName: 'Dịch vụ chân mày', icon: '👀', serviceCount: 0 },
      { code: 'OTHER', displayName: 'Dịch vụ khác', icon: '✨', serviceCount: 0 },
    ];
    setData((prev) => ({
      ...prev,
      categories: defaultCategories,
    }));
  };

  const handleCreateService = () => {
    setEditingService(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      category: '',
      price: '',
      promotionalPrice: '',
      durationMinutes: '',
      isActive: true,
      notes: '',
      requiresConsultation: false,
    });
    setShowModal(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      code: service.code || '',
      description: service.description || '',
      category: service.category || '',
      price: service.price || '',
      promotionalPrice: service.promotionalPrice || '',
      durationMinutes:
        service.durationMin || (service.duration ? parseInt(service.duration.split(' ')[0]) : ''),
      isActive: service.isActive !== undefined ? service.isActive : true,
      notes: service.notes || '',
      requiresConsultation: service.requiresConsultation || false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : null,
        isActive: formData.isActive,
      };

      if (editingService) {
        await servicesApi.updateService(editingService.serviceId, submitData);
      } else {
        await servicesApi.createService(submitData);
      }

      setShowModal(false);
      fetchServices();
      // Keep filters active after update
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Có lỗi xảy ra khi lưu dịch vụ. Vui lòng thử lại.');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        await servicesApi.deleteService(serviceId);
        fetchServices();
        // Categories will be updated automatically by the useEffect
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Có lỗi xảy ra khi xóa dịch vụ. Vui lòng thử lại.');
      }
    }
  };

  const getStatusStyle = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-700 px-2 py-1 rounded text-sm'
      : 'bg-gray-100 text-gray-500 px-2 py-1 rounded text-sm';
  };

  if (data.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-3">Đang tải danh sách dịch vụ...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">💼 Quản lý Dịch vụ</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleCreateService}
        >
          ➕ Thêm dịch vụ mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🔍 Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tên dịch vụ, mã, mô tả..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📂 Danh mục
            </label>
            <select
              value={filters.categoryFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, categoryFilter: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              {data.categories.map(cat => (
                <option key={cat.code} value={cat.code}>
                  {cat.icon} {cat.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📊 Trạng thái
            </label>
            <select
              value={filters.statusFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, statusFilter: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Tạm ngưng</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ searchTerm: '', categoryFilter: '', statusFilter: '' })}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              🗑️ Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex gap-4">
            {filters.searchTerm && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Tìm: "{filters.searchTerm}"
              </span>
            )}
            {filters.categoryFilter && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                Danh mục: {data.categories.find(c => c.code === filters.categoryFilter)?.displayName}
              </span>
            )}
            {filters.statusFilter && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Trạng thái: {filters.statusFilter === 'ACTIVE' ? 'Hoạt động' : 'Tạm ngưng'}
              </span>
            )}
          </div>
          <div className="font-medium">
            Hiển thị: {filteredData.totalElements} / {data.totalElements} dịch vụ
          </div>
        </div>
      </div>

      {/* Categories Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-3">📊 Danh mục dịch vụ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredData.categories.map((cat) => (
            <div
              key={cat.code}
              className="p-4 bg-white rounded-lg shadow flex flex-col items-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setFilters(prev => ({ ...prev, categoryFilter: cat.code }))}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="font-medium">{cat.displayName}</span>
              <span className="text-gray-500">{cat.serviceCount} dịch vụ</span>
            </div>
          ))}
        </div>
      </div>

      {/* Services List */}
      <div>
        <h2 className="text-xl font-semibold mb-3">
          📋 Danh sách dịch vụ ({filteredData.totalElements})
        </h2>
        {data.error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-3 flex justify-between items-center">
            <span>{data.error}</span>
            <button
              onClick={fetchServices}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {filteredData.services.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy dịch vụ nào
            </h3>
            <p className="text-gray-500 mb-4">
              {data.totalElements === 0
                ? 'Chưa có dịch vụ nào được tạo. Hãy thêm dịch vụ mới!'
                : 'Không có dịch vụ nào khớp với bộ lọc hiện tại.'}
            </p>
            {(filters.searchTerm || filters.categoryFilter || filters.statusFilter) && (
              <button
                onClick={() => setFilters({ searchTerm: '', categoryFilter: '', statusFilter: '' })}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Dịch vụ</th>
                  <th className="p-3">Danh mục</th>
                  <th className="p-3">Giá</th>
                  <th className="p-3">Thời gian</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.services.map((service) => (
                  <tr key={service.serviceId} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-semibold">{service.name}</div>
                      <div className="text-sm text-gray-500">Mã: {service.code}</div>
                      <div className="text-sm text-gray-500">{service.description}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                        {service.category}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-green-600">
                      {service.price
                        ? service.price.toLocaleString('vi-VN') + 'đ'
                        : 'Liên hệ'}
                    </td>
                    <td className="p-3">{service.duration || 'N/A'}</td>
                    <td className="p-3">
                      <span className={getStatusStyle(service.isActive)}>
                        {service.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.serviceId)}
                        className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên dịch vụ *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mã dịch vụ *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full border rounded p-2"
                  >
                    <option value="">Chọn danh mục</option>
                    {data.categories.map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.icon} {cat.displayName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giá (VNĐ) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thời gian (phút)</label>
                  <input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                    min="15"
                    max="480"
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Trạng thái</label>
                  <select
                    value={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full border rounded p-2"
                  >
                    <option value={true}>Hoạt động</option>
                    <option value={false}>Tạm ngưng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả dịch vụ</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full border rounded p-2"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingService ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
