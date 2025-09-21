import React, { useEffect, useRef, useCallback } from 'react';
import { formatDateTimeVN } from '@/utils/dateUtils';
import useRequestDetailModal from '@/hooks/useRequestDetailModal';
import CustomerCreationModal from '@/components/Customer/CustomerCreationModal';

const STATUS_STYLES = {
  NEW: { bg: 'bg-primary-50', text: 'text-primary-800', ring: 'ring-primary-200', label: 'Mới' },
  IN_PROGRESS: { bg: 'bg-amber-50', text: 'text-amber-800', ring: 'ring-amber-200', label: 'Đang xử lý' },
  WON: { bg: 'bg-green-50', text: 'text-green-800', ring: 'ring-green-200', label: 'Thành công' },
  LOST: { bg: 'bg-red-50', text: 'text-red-800', ring: 'ring-red-200', label: 'Thất bại' },
};

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || { bg: 'bg-gray-100', text: 'text-gray-800', ring: 'ring-gray-200', label: status || '—' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${s.bg} ${s.text} ${s.ring}`}>
      {s.label}
    </span>
  );
}

function TypePill({ existing }) {
  return existing ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 bg-primary-50 text-primary-800 ring-primary-200">
      Khách cũ
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 bg-gray-100 text-gray-800 ring-gray-200">
      Khách mới
    </span>
  );
}

const RequestDetailModalV2 = ({
  isOpen,
  onClose,
  request,
  onCreateCustomer,
  onCreateAppointment
}) => {
  const {
    customerData,
    loading,
    error,
    isFullscreen,
    showCustomerCreationModal,
    statusUpdate,
    setIsFullscreen,
    setStatusUpdate,
    handleOpenCustomerCreationModal,
    handleCloseCustomerCreationModal,
    handleCustomerCreated,
    handleStatusUpdate,
    handleCreateAppointment,
    handleViewCustomerProfile,
  } = useRequestDetailModal(isOpen, request, onCreateCustomer, onCreateAppointment, onClose);

  // --- a11y & UX helpers
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const initialFocusRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    initialFocusRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    dialogRef.current?.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      dialogRef.current?.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  const onOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  const scrollToActions = useCallback(() => {
    actionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (!isOpen || !request) return null;

  const motion = 'transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none';

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={onOverlayClick}
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 ${motion}`}
        role="presentation"
        aria-hidden="true"
      />

      {/* Dialog container */}
      <div
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-detail-title"
      >
        {/* Modal Container */}
        <div
          ref={dialogRef}
          className={`bg-white shadow-2xl ${isFullscreen ? 'w-screen h-screen rounded-none' : 'w-full max-w-6xl rounded-2xl'}
                      relative overflow-hidden outline-none ${motion}`}
          style={isFullscreen ? {} : { maxHeight: '90vh' }}
        >
          {/* Control buttons */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              ref={initialFocusRef}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              title={isFullscreen ? 'Thu nhỏ' : 'Phóng to'}
              aria-label={isFullscreen ? 'Thu nhỏ modal' : 'Phóng to modal'}
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 3l-6 6m0 0V4m0 5h5M3 21l6-6m0 0v5m0-5H4" />
                </svg>
              )}
            </button>
            <button
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              onClick={onClose}
              title="Đóng"
              aria-label="Đóng modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div className="px-6 pt-6">
              <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-base flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5 19h14l-7-14-7 14z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Modal ID Badge */}
          <div className="px-6 pt-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-base font-medium ring-1 bg-gray-50 text-gray-700 ring-gray-200">
              Yêu cầu <span className="ml-1 font-semibold text-gray-900">#{request.leadId}</span>
            </span>
          </div>

          {/* Content */}
          <div className={`${error ? 'pt-8' : 'pt-10'} pb-6 px-6 ${isFullscreen ? 'h-full overflow-y-auto' : 'max-h-[calc(90vh-8rem)] overflow-y-auto'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT: Customer */}
              <section className="rounded-xl border border-primary-100 bg-white shadow-sm">
                <header className="px-4 py-3 border-b border-primary-100 bg-primary-50/60 rounded-t-xl">
                  <h3 id="request-detail-title" className="text-lg font-semibold text-gray-900">Thông tin khách hàng</h3>
                </header>
                <div className="p-4">
                  {request.customerId ? (
                    <>
                      {loading ? (
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="h-5 w-5 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
                          <span className="text-base">Đang tải thông tin khách hàng...</span>
                        </div>
                      ) : customerData ? (
                        <>
                          <div className="space-y-4">
                            <Row label="Tên khách hàng"><span className="font-medium text-gray-900 text-base">{customerData.fullName}</span></Row>
                            <Row label="Số điện thoại"><span className="text-gray-900 text-base">{customerData.phone}</span></Row>
                            <Row label="Email"><span className="text-gray-900 text-base">{customerData.email || 'Chưa cập nhật'}</span></Row>
                            <Row label="Loại khách"><TypePill existing /></Row>
                          </div>

                          {customerData.isVip && (
                            <div className="mt-3 inline-flex items-center gap-2 text-amber-700 bg-amber-50 ring-1 ring-amber-200 px-2.5 py-1 rounded-full text-xs font-medium">
                              <span aria-hidden>👑</span> VIP Customer
                            </div>
                          )}

                          <div className="mt-4 grid grid-cols-3 gap-3">
                            <StatBox label="Tổng chi tiêu" value={`${(customerData.totalSpent || 0).toLocaleString('vi-VN')} VNĐ`} />
                            <StatBox label="Tổng điểm" value={`${customerData.totalPoints || 0} điểm`} />
                            <StatBox label="Tier" value={customerData.tierName || 'Standard'} />
                          </div>

                          <button
                            className="mt-4 inline-flex items-center justify-center rounded-lg bg-white text-primary-700 ring-1 ring-primary-200 px-3 py-2 text-base font-medium hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                            onClick={() => handleViewCustomerProfile(customerData.customerId)}
                          >
                            👤 Mở hồ sơ
                          </button>
                        </>
                      ) : (
                        <div className="text-red-700 bg-red-50 ring-1 ring-red-200 px-3 py-2 rounded-lg text-base">
                          Không thể tải thông tin khách hàng
                        </div>
                      )}
                    </>
                  ) : (
                    // New customer preview
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Khách hàng mới</h4>
                      <p className="text-gray-600 mb-4 text-base">Tạo hồ sơ khách hàng từ yêu cầu tư vấn này</p>

                      <div className="rounded-xl border border-primary-100 bg-white p-3 space-y-2">
                        <PreviewRow label="Tên" value={request.fullName} />
                        <PreviewRow label="SĐT" value={request.phone} />
                        {request.note && (
                          <div className="flex items-start gap-2 text-base">
                            <span className="text-gray-600 min-w-12">Ghi chú:</span>
                            <span className="text-gray-900 font-medium break-words whitespace-pre-wrap">
                              {request.note}
                            </span>
                          </div>
                        )}
                        <button
                          className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary-500 text-white px-3 py-2 text-base font-medium hover:bg-primary-600 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                          onClick={handleOpenCustomerCreationModal}
                          disabled={loading}
                        >
                          ➕ Tạo khách hàng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* RIGHT: Request Info + Actions */}
              <div className="space-y-8">
                {/* Request info */}
                <div className="space-y-6">
                  <Row label="Thời gian tạo"><span className="text-gray-900 text-base">{formatDateTimeVN(request.createdAt)}</span></Row>
                  <Row label="Ghi chú ban đầu">
                    <div className="rounded-xl bg-gray-50 ring-1 ring-gray-200 px-3 py-2 text-base text-gray-800 break-words whitespace-pre-wrap">
                      {request.note || 'Không có ghi chú'}
                    </div>
                  </Row>
                  <Row label="Trạng thái hiện tại">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusPill status={request.status} />
                      <label className="sr-only" htmlFor="status-select">Cập nhật trạng thái</label>
                      <select
                        id="status-select"
                        value={statusUpdate.status}
                        onChange={(e) => setStatusUpdate((prev) => ({ ...prev, status: e.target.value }))}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="NEW">Mới</option>
                        <option value="IN_PROGRESS">Đang xử lý</option>
                        <option value="WON">Thành công</option>
                        <option value="LOST">Thất bại</option>
                      </select>
                    </div>
                  </Row>
                  <Row label="Loại khách"><TypePill existing={!!request.customerId} /></Row>
                </div>

                {/* Actions buttons */}
                <div className="pt-2" ref={actionsRef}>
                  <div className="grid grid-cols-2 gap-3">
                    {request.status === 'NEW' && (
                      <button
                        className="rounded-lg bg-primary-500 text-white px-3 py-2 text-base font-medium hover:bg-primary-600 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                        onClick={() => setStatusUpdate((prev) => ({ ...prev, status: 'IN_PROGRESS' }))}
                        disabled={loading}
                      >
                        💬 Tư vấn
                      </button>
                    )}
                    {request.status === 'IN_PROGRESS' && (
                      <button
                        className="rounded-lg bg-white text-gray-800 ring-1 ring-primary-200 px-3 py-2 text-base font-medium hover:bg-primary-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                        onClick={scrollToActions}
                        disabled={loading}
                      >
                        🧾 Chi tiết
                      </button>
                    )}
                    {request.status === 'WON' && request.customerId && (
                      <button
                        className="rounded-lg bg-green-600 text-white px-3 py-2 text-base font-medium hover:bg-green-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40"
                        onClick={() => handleViewCustomerProfile(request.customerId)}
                        disabled={loading}
                      >
                        👤 Xem hồ sơ
                      </button>
                    )}
                    {!request.customerId && request.status !== 'WON' && (
                      <button
                        className="rounded-lg bg-white text-green-700 ring-1 ring-green-200 px-3 py-2 text-base font-medium hover:bg-green-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
                        onClick={handleOpenCustomerCreationModal}
                        disabled={loading}
                      >
                        🆕 Tạo KH
                      </button>
                    )}
                    <button
                      className="rounded-lg bg-white text-gray-800 ring-1 ring-primary-200 px-3 py-2 text-base font-medium hover:bg-primary-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      onClick={handleCreateAppointment}
                      disabled={loading}
                    >
                      📅 Lịch hẹn
                    </button>
                    <button
                      className="rounded-lg bg-primary-500 text-white px-3 py-2 text-base font-medium hover:bg-primary-600 disabled:opacity-60 col-span-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      onClick={handleStatusUpdate}
                      disabled={loading || statusUpdate.status === request.status}
                    >
                      ⟳ Cập nhật
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal tạo khách hàng - z-index cao hơn để hiển thị trên cùng */}
      {showCustomerCreationModal && (
        <div className="fixed inset-0 z-[110]">
          <CustomerCreationModal
            isOpen={showCustomerCreationModal}
            onClose={handleCloseCustomerCreationModal}
            onCustomerCreated={handleCustomerCreated}
            leadData={request}
          />
        </div>
      )}
    </>
  );
};

export default RequestDetailModalV2;

/* ------ row/box components ------ */
function Row({ label, children }) {
  return (
    <div className="grid grid-cols-12 gap-3 items-start">
      <div className="col-span-4 sm:col-span-3 text-gray-600 text-base pt-0.5">{label}:</div>
      <div className="col-span-8 sm:col-span-9">{children}</div>
    </div>
  );
}
function StatBox({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 ring-1 ring-gray-200 px-3 py-2">
      <div className="text-base text-gray-600">{label}</div>
      <div className="text-base font-semibold text-gray-900 break-words">{value}</div>
    </div>
  );
}
function PreviewRow({ label, value }) {
  return (
    <div className="flex items-start gap-2 text-base">
      <span className="text-gray-600 min-w-12">{label}:</span>
      <span className="text-gray-900 font-medium break-words whitespace-pre-wrap">{value || '—'}</span>
    </div>
  );
}
