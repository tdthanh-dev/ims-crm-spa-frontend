import React from 'react';
import { formatDateTimeVN } from '@/utils/dateUtils';
import { useTreatmentProcess } from '@/hooks/useTreatmentProcess';

/**
 * Treatment Process Component
 * UI component for technician treatment management - logic separated to custom hook
 * Styled with Tailwind CSS for modern, responsive design
 */
const TreatmentProcess = () => {
  // Use custom hook for all business logic
  const {
    currentTreatment,
    upcomingTreatments,
    completedTreatments,
    selectedTreatment,
    loading,
    treatmentNotes,
    checklistItems,
    handleStartTreatment,
    handleCompleteTreatment,
    handleCancelTreatment,
    setSelectedTreatment,
    setTreatmentNotes,
    updateChecklistItem,
    getStatusBadge,
    stats,
    hasCurrentTreatment,
    hasUpcomingTreatments,
    hasCompletedTreatments,
    isChecklistComplete
  } = useTreatmentProcess();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu điều trị...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      {/* Enhanced Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white text-3xl mb-4 shadow-lg">
          🩺
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
          Quá trình điều trị
        </h1>
        <p className="text-gray-600 text-lg">Quản lý các buổi điều trị và ghi chú kỹ thuật một cách chuyên nghiệp</p>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Current Treatment */}
      {hasCurrentTreatment && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🔄</span>
            Đang điều trị
          </h2>

          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{currentTreatment.customerName}</h3>
                <p className="text-gray-600">{currentTreatment.serviceName}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Bắt đầu: {formatDateTimeVN(currentTreatment.startAt)}
                </p>
              </div>
              <div className="text-right">
                {(() => {
                  const statusInfo = getStatusBadge(currentTreatment.status);
                  return (
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium`}
                           style={{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }}>
                        {statusInfo.label}
                      </span>
                  );
                })()}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                onClick={() => setSelectedTreatment(currentTreatment)}
              >
                <span className="mr-2">✅</span>
                Hoàn thành điều trị
              </button>
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                onClick={() => handleCancelTreatment(currentTreatment.id, 'Paused by technician')}
              >
                <span className="mr-2">⏸️</span>
                Tạm dừng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Treatment Completion Modal */}
      {selectedTreatment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Hoàn thành điều trị</h2>
              <button
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                onClick={() => setSelectedTreatment(null)}
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Treatment Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">{selectedTreatment.customerName}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Dịch vụ:</span> {selectedTreatment.serviceName}</p>
                  <p><span className="font-medium">Thời gian:</span> {formatDateTimeVN(selectedTreatment.startAt)}</p>
                </div>
              </div>

              {/* Treatment Notes */}
              <div className="mb-6">
                <label htmlFor="treatment-notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú điều trị:
                </label>
                <textarea
                  id="treatment-notes"
                  value={treatmentNotes}
                  onChange={(e) => setTreatmentNotes(e.target.value)}
                  placeholder="Ghi chú về quá trình điều trị, kỹ thuật sử dụng, sản phẩm đã dùng..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Treatment Checklist */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Danh sách kiểm tra:</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklistItems.consultation}
                      onChange={(e) => updateChecklistItem('consultation', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Tư vấn trước điều trị</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklistItems.skinCheck}
                      onChange={(e) => updateChecklistItem('skinCheck', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Kiểm tra da và chống chỉ định</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklistItems.sterilization}
                      onChange={(e) => updateChecklistItem('sterilization', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Vệ sinh và chuẩn bị dụng cụ</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklistItems.technique}
                      onChange={(e) => updateChecklistItem('technique', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Thực hiện kỹ thuật đúng quy trình</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklistItems.aftercare}
                      onChange={(e) => updateChecklistItem('aftercare', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Hướng dẫn chăm sóc sau điều trị</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklistItems.retouch}
                      onChange={(e) => updateChecklistItem('retouch', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Lên lịch retouch (nếu cần)</span>
                  </label>
                </div>

                {!isChecklistComplete() && (
                  <p className="text-sm text-amber-600 mt-3 flex items-center">
                    <span className="mr-1">⚠️</span>
                    Vui lòng hoàn thành tất cả các bước kiểm tra
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setSelectedTreatment(null)}
              >
                Hủy
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                  isChecklistComplete()
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={() => isChecklistComplete() && handleCompleteTreatment(selectedTreatment.id, treatmentNotes)}
                disabled={!isChecklistComplete()}
              >
                <span className="mr-2">✅</span>
                Hoàn thành
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Treatments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📅</span>
            Lịch điều trị sắp tới ({upcomingTreatments.length})
          </h2>

          <div className="space-y-3">
            {!hasUpcomingTreatments ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📅</div>
                <p className="text-gray-500">Không có lịch điều trị nào sắp tới</p>
              </div>
            ) : (
              upcomingTreatments.map(treatment => {
                const statusInfo = getStatusBadge(treatment.status);
                return (
                  <div key={treatment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">
                          {formatDateTimeVN(treatment.startAt)}
                        </div>
                        <div className="font-medium text-gray-900">{treatment.customerName}</div>
                        <div className="text-sm text-gray-600">{treatment.serviceName}</div>
                        <div className="text-xs text-gray-500 mt-1">⏱️ 60 phút</div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mb-2`}
                              style={{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }}>
                          {statusInfo.label}
                        </span>
                        {treatment.status === 'CHECKED_IN' && (
                          <button
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                            onClick={() => handleStartTreatment(treatment.id)}
                          >
                            ▶️ Bắt đầu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Completed Treatments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">✅</span>
            Lịch sử điều trị ({completedTreatments.length})
          </h2>

          <div className="space-y-3">
            {!hasCompletedTreatments ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-gray-500">Chưa có lịch điều trị nào hoàn thành</p>
              </div>
            ) : (
              completedTreatments.map(treatment => {
                const statusInfo = getStatusBadge(treatment.status);
                return (
                  <div key={treatment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">
                          {formatDateTimeVN(treatment.startAt)}
                        </div>
                        <div className="font-medium text-gray-900">{treatment.customerName}</div>
                        <div className="text-sm text-gray-600">{treatment.serviceName}</div>
                        <div className="text-xs text-green-600 mt-1">Hoàn thành thành công</div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mb-2`}
                              style={{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }}>
                          {statusInfo.label}
                        </span>
                        <button className="block w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200">
                          👁️ Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Thống kê nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
            <div className="text-sm text-gray-600">Lịch sắp tới</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.current}</div>
            <div className="text-sm text-gray-600">Đang điều trị</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Hoàn thành</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.rating}</div>
            <div className="text-sm text-gray-600">Đánh giá TB</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentProcess;
