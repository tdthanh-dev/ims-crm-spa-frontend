import React from 'react';
import { formatDateTimeVN } from '@/utils/dateUtils';
import { useTaskManagement } from '@/hooks/useTaskManagement';


const TaskManagement = () => {
  const {
    loading,
    error,
    activeTab,
    searchTerm,
    statusFilter,
    selectedTask,
    filteredTasks,
    filteredAuditLogs,
    setActiveTab,
    setSearchTerm,
    setStatusFilter,
    setSelectedTask,
    handleTaskStatusUpdate,
    getTaskStatusBadge,
    getAuditActionBadge,
    handleRetry,
    canManageTasks,
    canUpdateTask
  } = useTaskManagement();

  const renderTasksTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="mr-2">📋</span>
          Quản lý nhiệm vụ
        </h3>
        {canManageTasks && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
            onClick={() => alert('Create task modal - TODO: Implement')}
          >
            <span className="mr-2">➕</span>
            Tạo nhiệm vụ
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, mô tả, người thực hiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="TODO">Chưa làm</option>
              <option value="IN_PROGRESS">Đang làm</option>
              <option value="REVIEW">Đang review</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => {
          const statusInfo = getTaskStatusBadge(task.status);
          return (
            <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-gray-900 flex-1 pr-2">{task.title}</h4>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                  {statusInfo.label}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <p className="text-gray-600 text-sm">
                  {task.description || 'Không có mô tả'}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Người thực hiện:</span>
                    <span className="text-gray-900">{task.assignedTo || 'Chưa phân công'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Người tạo:</span>
                    <span className="text-gray-900">{task.createdBy || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hạn hoàn thành:</span>
                    <span className="text-gray-900">
                      {task.dueDate ? formatDateTimeVN(task.dueDate) : 'Không có hạn'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                <div>
                  <div>Tạo: {formatDateTimeVN(task.createdAt)}</div>
                  {task.updatedAt && task.updatedAt !== task.createdAt && (
                    <div>Cập nhật: {formatDateTimeVN(task.updatedAt)}</div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                  onClick={() => setSelectedTask(task)}
                >
                  <span className="mr-1">👁️</span>
                  Chi tiết
                </button>

                {canUpdateTask(task) && (
                  <>
                    {task.status === 'TODO' && (
                      <button
                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                        onClick={() => handleTaskStatusUpdate(task.id, 'IN_PROGRESS')}
                      >
                        <span className="mr-1">▶️</span>
                        Bắt đầu
                      </button>
                    )}

                    {task.status === 'IN_PROGRESS' && (
                      <button
                        className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                        onClick={() => handleTaskStatusUpdate(task.id, 'REVIEW')}
                      >
                        <span className="mr-1">👁️</span>
                        Review
                      </button>
                    )}

                    {task.status === 'REVIEW' && (
                      <button
                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                        onClick={() => handleTaskStatusUpdate(task.id, 'COMPLETED')}
                      >
                        <span className="mr-1">✅</span>
                        Hoàn thành
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy nhiệm vụ nào</h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      )}
    </div>
  );

  const renderAuditTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="mr-2">📊</span>
          Nhật ký hoạt động
        </h3>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
          <span className="mr-2">📊</span>
          Xuất báo cáo
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên người dùng, hành động, đối tượng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đối tượng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAuditLogs.map(log => {
                const actionInfo = getAuditActionBadge(log.action);
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTimeVN(log.timestamp)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${actionInfo.bgColor} ${actionInfo.textColor}`}>
                        {actionInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.entityType}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{log.details || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ipAddress || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAuditLogs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy nhật ký nào</h3>
          <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  );

  // Task Details Modal
  const renderTaskDetailsModal = () => {
    if (!selectedTask) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setSelectedTask(null)}>
        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Chi tiết nhiệm vụ #{selectedTask.id}</h2>
            <button
              className="text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setSelectedTask(null)}
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">{selectedTask.title}</h3>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTaskStatusBadge(selectedTask.status).bgColor} ${getTaskStatusBadge(selectedTask.status).textColor}`}>
                {getTaskStatusBadge(selectedTask.status).label}
              </span>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Mô tả</h4>
              <p className="text-gray-600">{selectedTask.description || 'Không có mô tả'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Người thực hiện:</label>
                <span className="text-gray-900">{selectedTask.assignedTo || 'Chưa phân công'}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Người tạo:</label>
                <span className="text-gray-900">{selectedTask.createdBy || 'N/A'}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hạn hoàn thành:</label>
                <span className="text-gray-900">{selectedTask.dueDate ? formatDateTimeVN(selectedTask.dueDate) : 'Không có hạn'}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Độ ưu tiên:</label>
                <span className="text-gray-900">{selectedTask.priority || 'Normal'}</span>
              </div>
            </div>

            {selectedTask.comments && selectedTask.comments.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Bình luận</h4>
                <div className="space-y-3">
                  {selectedTask.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-gray-900">{comment.author}</div>
                        <div className="text-sm text-gray-500">{formatDateTimeVN(comment.createdAt)}</div>
                      </div>
                      <div className="text-gray-600 mt-1">{comment.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              onClick={() => setSelectedTask(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu nhiệm vụ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-3">📋</span>
            Quản lý nhiệm vụ & Nhật ký
          </h1>
          <p className="mt-2 text-gray-600">Quản lý nhiệm vụ và theo dõi hoạt động hệ thống</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tasks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('tasks')}
              >
                📋 Nhiệm vụ
              </button>
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'audit'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('audit')}
              >
                📊 Nhật ký
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'tasks' && renderTasksTab()}
          {activeTab === 'audit' && renderAuditTab()}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-600 mr-2">⚠️</span>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
              <button
                onClick={handleRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        {renderTaskDetailsModal()}
      </div>
    </div>
  );
};

export default TaskManagement;
