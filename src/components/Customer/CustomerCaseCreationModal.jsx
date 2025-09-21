// filepath: admin-spa-management/src/components/Customer/CustomerCaseCreationModal.jsx
import React from 'react';
import { useCustomerCaseCreation } from '@/hooks/useCustomerCaseCreation';

const CustomerCaseCreationModal = ({
  isOpen,
  onClose,
  onCaseCreated,
  customerId,
  customerName = ''
}) => {
  const {
    formData,
    validation,
    loading,
    error,
    services,
    servicesLoading,
    statusOptions,
    selectedService,
    handleInputChange,
    handleSubmit,
    handleClose,
    formatCurrency
  } = useCustomerCaseCreation({
    customerId,
    customerName,
    isOpen,
    onClose,
    onCaseCreated
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/80">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🩺</span>
            Tạo hồ sơ điều trị
          </h2>
          <button
            type="button"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            onClick={handleClose}
            disabled={loading}
            aria-label="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body (scrollable) */}
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(90vh-60px-64px)]">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {error && (
              <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700 flex items-start gap-2">
                <span className="text-red-500">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Customer Info */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">👤</span>
                Thông tin khách hàng
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                  {customerName || `Customer #${customerId}`}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                  ID: {customerId}
                </span>
              </div>
            </div>

            {/* Grid: Service + Case details + Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Selection */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-lg">🛍️</span>
                  Dịch vụ điều trị
                </h3>

                {/* Select service */}
                <div className="space-y-2">
                  <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">
                    Chọn dịch vụ <span className="text-red-500">*</span>
                  </label>

                  {servicesLoading ? (
                    <div className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25"/>
                        <path d="M4 12a8 8 0 018-8" fill="currentColor" className="opacity-75"/>
                      </svg>
                      Đang tải dịch vụ...
                    </div>
                  ) : (
                    <select
                      id="serviceId"
                      value={formData.serviceId}
                      onChange={(e) => handleInputChange('serviceId', e.target.value)}
                      disabled={loading}
                      required
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        validation.serviceId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">-- Chọn dịch vụ --</option>
                      {services.map((s) => (
                        <option key={s.serviceId} value={s.serviceId}>
                          {s.name} — {formatCurrency(s.price)}
                          {s.durationMinutes ? ` (${s.durationMinutes} phút)` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                  {validation.serviceId && (
                    <p className="text-sm text-red-600">{validation.serviceId}</p>
                  )}
                </div>

                {/* Selected service details */}
                {selectedService && (
                  <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Chi tiết dịch vụ</h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      {selectedService.code && (
                        <p><strong>Mã:</strong> {selectedService.code}</p>
                      )}
                      {selectedService.category && (
                        <p><strong>Loại:</strong> {selectedService.category}</p>
                      )}
                      <p><strong>Giá:</strong> {formatCurrency(selectedService.price)}</p>
                      {selectedService.durationMinutes && (
                        <p><strong>Thời gian:</strong> {selectedService.durationMinutes} phút</p>
                      )}
                      {selectedService.description && (
                        <p className="text-gray-600">
                          <strong>Mô tả:</strong> {selectedService.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Case Details */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  Chi tiết hồ sơ
                </h3>

                {/* Status */}
                <div className="space-y-2 mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    disabled={loading}
                    required
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      validation.status ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {validation.status && (
                    <p className="text-sm text-red-600">{validation.status}</p>
                  )}
                  {formData.status && (
                    <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      {statusOptions.find((o) => o.value === formData.status)?.description}
                    </div>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      📅 Ngày bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      disabled={loading}
                      required
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        validation.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {validation.startDate && (
                      <p className="text-sm text-red-600">{validation.startDate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      📅 Ngày kết thúc dự kiến
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      disabled={loading}
                      min={formData.startDate}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        validation.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {validation.endDate && (
                      <p className="text-sm text-red-600">{validation.endDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes (full width) */}
              <div className="lg:col-span-2 rounded-xl border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  Ghi chú
                </h3>

                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Ghi chú điều trị
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    disabled={loading}
                    maxLength={1000}
                    placeholder="Nhập ghi chú về quá trình điều trị..."
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none ${
                      validation.notes ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {validation.notes && (
                    <p className="text-sm text-red-600">{validation.notes}</p>
                  )}
                  <div className="text-xs text-gray-500 text-right">
                    {formData.notes.length}/1000 ký tự
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50/80">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !formData.customerId || !formData.serviceId}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                    <path d="M4 12a8 8 0 018-8" fill="currentColor" className="opacity-75"/>
                  </svg>
                  Đang tạo...
                </>
              ) : (
                <>
                  <span>🩺</span>
                  Tạo hồ sơ điều trị
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerCaseCreationModal;
