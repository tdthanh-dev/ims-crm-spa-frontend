// filepath: src/components/Customer/CustomerCreationModal.jsx
import React, { useRef, useEffect } from 'react';
import { useCustomerCreationModal } from '@/hooks/useCustomerCreationModal';

const CustomerCreationModal = ({
  isOpen,
  onClose,
  onCustomerCreated,
  leadData = null
}) => {
  const {
    formData,
    validation,
    loading,
    error,
    handleInputChange,
    handleSubmit,
    handleClose
  } = useCustomerCreationModal(leadData, onCustomerCreated, onClose);

  const dialogRef = useRef(null);
  const overlayRef = useRef(null);
  const initialFocusRef = useRef(null);

  // --- Fix "nhảy về ô tên": chỉ focus 1 lần khi mở modal, không cướp focus khi user đang gõ ---
  const loadingRef = useRef(loading);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Chỉ focus nếu bên trong modal hiện chưa có phần tử nào đang focus
    const focusIfNeeded = () => {
      const active = document.activeElement;
      const insideDialog = dialogRef.current?.contains(active);
      if (!insideDialog) {
        initialFocusRef.current?.focus();
      }
    };
    // Đợi DOM ổn định
    const rafId = requestAnimationFrame(focusIfNeeded);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loadingRef.current) {
        handleClose();
      }
      // Trap focus trong modal
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
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

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(rafId);
    };
    // ❗ Chỉ phụ thuộc vào mở/đóng + handleClose, KHÔNG phụ thuộc `loading`
  }, [isOpen, handleClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current && !loading) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  // Tailwind helpers (UI-only)
  const inputBase =
    'w-full px-3 py-2 rounded-lg border bg-white placeholder:text-gray-400 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 ' +
    'disabled:opacity-60 disabled:cursor-not-allowed transition-[box-shadow,border-color] duration-150';
  const labelBase = 'block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap';
  const errorText = 'mt-1 text-sm text-red-600';
  const errorBorder = 'border-red-300 bg-red-50';
  const normalBorder = 'border-gray-300';

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm"
        role="presentation"
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-[111] flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="customer-creation-title"
          className="
            w-full max-w-4xl
            h-[85vh]                /* chiều cao cố định, footer luôn thấy */
            flex flex-col           /* header / body(scroll) / footer */
            overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5
          "
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-primary-50/60 shrink-0">
            <div className="flex items-center justify-between">
              <h2 id="customer-creation-title" className="text-xl font-semibold text-gray-900">
                Tạo khách hàng mới
              </h2>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50"
                aria-label="Đóng modal"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Error banner (giữ ngay dưới header để luôn thấy) */}
            {error && (
              <div className="mt-3" role="alert" aria-live="assertive">
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M5.19 8.19l1.42-1.42m12.38 0l-1.42 1.42M12 2v2m0 16v2" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Body scrollable */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Lưới 2 cột cố định */}
              <div className="grid grid-cols-2 gap-5">
                {/* Full Name (span 2) */}
                <div className="col-span-2">
                  <label htmlFor="fullName" className={labelBase}>
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={initialFocusRef}
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`${inputBase} ${validation.fullName ? errorBorder : normalBorder}`}
                    placeholder="Nhập họ và tên khách hàng"
                    disabled={loading}
                    autoComplete="name"
                    aria-invalid={!!validation.fullName}
                    aria-describedby={validation.fullName ? 'fullName-error' : undefined}
                  />
                  {validation.fullName && (
                    <p id="fullName-error" className={errorText}>{validation.fullName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className={labelBase}>
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`${inputBase} ${validation.phone ? errorBorder : normalBorder}`}
                    placeholder="0xxxxxxxxx"
                    disabled={loading}
                    autoComplete="tel"
                    inputMode="numeric"
                    aria-invalid={!!validation.phone}
                    aria-describedby={validation.phone ? 'phone-error' : undefined}
                  />
                  {validation.phone && (
                    <p id="phone-error" className={errorText}>{validation.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelBase}>Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`${inputBase} ${validation.email ? errorBorder : normalBorder}`}
                    placeholder="email@example.com"
                    disabled={loading}
                    autoComplete="email"
                    aria-invalid={!!validation.email}
                    aria-describedby={validation.email ? 'email-error' : undefined}
                  />
                  {validation.email && (
                    <p id="email-error" className={errorText}>{validation.email}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dob" className={labelBase}>Ngày sinh</label>
                  <input
                    type="date"
                    id="dob"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className={`${inputBase} ${validation.dob ? errorBorder : normalBorder}`}
                    disabled={loading}
                    aria-invalid={!!validation.dob}
                    aria-describedby={validation.dob ? 'dob-error' : undefined}
                  />
                  {validation.dob && (
                    <p id="dob-error" className={errorText}>{validation.dob}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className={labelBase}>Giới tính</label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className={`${inputBase} ${normalBorder}`}
                    disabled={loading}
                  >
                    <option value="FEMALE">Nữ</option>
                    <option value="MALE">Nam</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>

                {/* Address (span 2) */}
                <div className="col-span-2">
                  <label htmlFor="address" className={labelBase}>Địa chỉ</label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`${inputBase} ${validation.address ? errorBorder : normalBorder}`}
                    placeholder="Nhập địa chỉ"
                    disabled={loading}
                    autoComplete="street-address"
                    aria-invalid={!!validation.address}
                    aria-describedby={validation.address ? 'address-error' : undefined}
                  />
                  {validation.address && (
                    <p id="address-error" className={errorText}>{validation.address}</p>
                  )}
                </div>

                {/* Notes (span 2) */}
                <div className="col-span-2">
                  <label htmlFor="notes" className={labelBase}>Ghi chú</label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className={`${inputBase} ${normalBorder} resize-y`}
                    placeholder="Ghi chú thêm về khách hàng"
                    disabled={loading}
                  />
                </div>

                {/* VIP Status (span 2) */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isVip"
                      checked={formData.isVip}
                      onChange={(e) => handleInputChange('isVip', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500"
                      disabled={loading}
                    />
                    <label htmlFor="isVip" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Khách hàng VIP
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer (sticky, luôn thấy) */}
              <div className="border-t pt-5 sticky bottom-0 bg-white -mx-6 px-6 pb-0">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading && (
                      <svg className="h-4 w-4 -ml-1 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path
                          fill="currentColor"
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    )}
                    {loading ? 'Đang tạo...' : 'Tạo khách hàng'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerCreationModal;
