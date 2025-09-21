// filepath: admin-spa-management/src/components/Billing/InvoiceCreationModal.jsx
import React from 'react';
import { useInvoiceCreation } from '@/hooks/useInvoiceCreation';
import { useAuth } from '@/hooks/useAuth';
import { INVOICE_STATUS_MAP } from '@/config/constants';

const InvoiceCreationModal = ({
  isOpen,
  onClose,
  onInvoiceCreated,
  customerId,
  customerName = '',
  selectedCase = null,
}) => {
  const { user: currentUser } = useAuth();

  const {
    formData,
    loading,
    error,
    customerCases,
    casesLoading,
    handleInputChange,
    handleSubmit,
    handleClose,
    formatCurrency
  } = useInvoiceCreation({
    customerId,
    isOpen,
    onClose,
    onInvoiceCreated,
    currentUser,
    selectedCase
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/80">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">💰</span>
            Tạo hóa đơn mới
          </h2>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            onClick={handleClose}
            disabled={loading}
            aria-label="Đóng"
            title="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Error banner */}
          {error && (
            <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 flex items-start gap-2">
              <span className="text-red-500">⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Customer info */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-lg">👤</span>
              Thông tin khách hàng
            </h3>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-pink-50 text-pink-700 font-medium">
                {customerName || `Customer #${customerId}`}
              </span>
              <span className="text-gray-500">ID: {customerId}</span>
            </div>
          </div>

          {/* Current user info */}
          <div className="rounded-xl border border-gray-200 bg-blue-50/60 px-4 py-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-lg">👨‍💼</span>
              Nhân viên thu tiền
            </h3>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                {currentUser?.fullName || 'Unknown User'}
              </span>
              <span className="text-gray-500">ID: {currentUser?.staffId || currentUser?.userId}</span>
            </div>
          </div>

          {/* Case selection */}
          <div className="rounded-xl border border-gray-200 bg-blue-50/60 px-4 py-3">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">🩺</span>
              Liên kết với hồ sơ điều trị {selectedCase ? '(đã chọn)' : '(tùy chọn)'}
            </h3>
            {selectedCase ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{selectedCase.primaryServiceName}</p>
                    <p className="text-sm text-gray-600">
                      Trạng thái: {selectedCase.status} | Thanh toán: {
                        selectedCase.paidStatus === 'UNPAID' ? 'Chưa thanh toán' :
                        selectedCase.paidStatus === 'PARTIALLY_PAID' ? 'Thanh toán một phần' :
                        selectedCase.paidStatus === 'FULLY_PAID' ? 'Đã thanh toán' :
                        selectedCase.paidStatus
                      }
                    </p>
                    <p className="text-sm font-medium text-blue-700">
                      Tổng tiền: {formatCurrency(selectedCase.totalAmount || 0)}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                    Đã chọn
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label htmlFor="caseId" className="text-sm font-medium text-gray-700">
                  Chọn hồ sơ điều trị
                </label>
                <select
                  id="caseId"
                  value={formData.caseId}
                  onChange={(e) => handleInputChange('caseId', e.target.value)}
                  disabled={loading || casesLoading}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Không liên kết với hồ sơ nào --</option>
                  {customerCases.map((caseItem) => (
                    <option key={caseItem.caseId} value={caseItem.caseId}>
                      {caseItem.primaryServiceName} - {caseItem.status} ({new Date(caseItem.startDate).toLocaleDateString('vi-VN')})
                      {caseItem.totalAmount > 0 && ` - ${formatCurrency(caseItem.totalAmount)}`}
                    </option>
                  ))}
                </select>
                {casesLoading && (
                  <p className="text-xs text-gray-500">Đang tải danh sách hồ sơ...</p>
                )}
                {!casesLoading && customerCases.length === 0 && (
                  <p className="text-xs text-amber-600">Khách hàng chưa có hồ sơ điều trị nào</p>
                )}
              </div>
            )}
          </div>

          {/* Grid: Details + Amount */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Invoice details */}
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">📋</span>
                Chi tiết hóa đơn
              </h3>

              <div className="space-y-4">
                {/* Status */}
                <div className="space-y-1.5">
                  <label htmlFor="status" className="text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    disabled={loading}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    {Object.keys(INVOICE_STATUS_MAP).map((st) => (
                      <option key={st} value={st}>
                        {INVOICE_STATUS_MAP[st].label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due date */}
                <div className="space-y-1.5">
                  <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                    📅 Hạn thanh toán
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    disabled={loading}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                    📝 Ghi chú
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Nhập ghi chú về hóa đơn..."
                    rows={4}
                    disabled={loading}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Total amount */}
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">💰</span>
                Tổng tiền
              </h3>

              <div className="rounded-lg bg-gray-50/70 border border-gray-200 p-4 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="totalAmount" className="text-sm font-medium text-gray-700">
                    Tổng tiền hóa đơn (VNĐ)
                    {selectedCase && (
                      <span className="ml-2 text-xs text-blue-600 font-normal">
                        (Tự động từ hồ sơ điều trị)
                      </span>
                    )}
                  </label>
                  <input
                    id="totalAmount"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.totalAmount}
                    onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                    placeholder={selectedCase ? "Tự động từ hồ sơ" : "Nhập tổng tiền..."}
                    disabled={loading || !!selectedCase}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  {selectedCase && (
                    <p className="text-xs text-gray-600">
                      Tổng tiền được tính tự động từ các dịch vụ trong hồ sơ điều trị đã chọn.
                    </p>
                  )}
                </div>

                {formData.totalAmount > 0 && (
                  <div className="text-center py-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(formData.totalAmount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/80 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}   // ✅ chỉ disable khi đang loading
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tạo...
              </>
            ) : (
              <>💰 Tạo hóa đơn</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreationModal;
