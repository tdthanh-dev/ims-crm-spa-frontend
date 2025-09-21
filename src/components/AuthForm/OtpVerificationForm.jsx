import React from 'react';
import { formatEmailOrPhoneForDisplay } from '@/utils/formatters';

export const OtpVerificationForm = ({
  formData,
  displayEmail,
  isTimerActive,
  formattedTimer,
  error,
  loading,
  onOtpChange,
  onOtpPaste,
  onSubmit,
  onGoBack,
  onResendOtp,
  onClearError
}) => (
  <form onSubmit={onSubmit} className="space-y-5">
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onGoBack}
        className="text-sm text-primary-600 hover:text-primary-700 underline flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Quay lại
      </button>
    </div>

    <div className="text-center space-y-2">
      <h3 className="text-lg font-semibold text-black-900">
        Nhập mã OTP
      </h3>
      <p className="text-sm text-black-600">
        Mã OTP được gửi về "{formatEmailOrPhoneForDisplay(displayEmail)}"
      </p>
    </div>

    <div className="grid grid-cols-6 gap-2 sm:gap-3">
      {formData.otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          name={`otp-${index}`}
          value={digit}
          onChange={(e) => onOtpChange(index, e.target.value)}
          onPaste={onOtpPaste}
          onKeyDown={(e) => {
            // Handle backspace to go to previous input
            if (e.key === 'Backspace' && !digit && index > 0) {
              const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
              if (prevInput) prevInput.focus();
            }
            // Handle arrow keys for navigation
            if (e.key === 'ArrowLeft' && index > 0) {
              const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
              if (prevInput) prevInput.focus();
            }
            if (e.key === 'ArrowRight' && index < 5) {
              const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
              if (nextInput) nextInput.focus();
            }
          }}
          onFocus={onClearError}
          className="h-12 sm:h-14 text-center text-lg font-semibold rounded-xl border border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 text-black-900"
          maxLength="1"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          disabled={loading}
        />
      ))}
    </div>

    <div className="text-center text-sm text-black-600">
      {isTimerActive ? (
        <span>
          Mã xác nhận có hiệu lực trong{' '}
          <strong className="text-black-900">{formattedTimer}</strong>
        </span>
      ) : (
        <button
          type="button"
          onClick={onResendOtp}
          className="underline text-primary-600 hover:text-primary-700"
          disabled={loading}
        >
          Gửi lại mã OTP
        </button>
      )}
    </div>

    {error && (
      <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2">
        <span>⚠️</span>
        <span className="text-sm">{error}</span>
      </div>
    )}

    <button
      type="submit"
      disabled={loading}
      className="w-full inline-flex items-center justify-center rounded-xl bg-primary-500 text-white px-4 py-2.5 font-semibold hover:bg-primary-600 disabled:opacity-60"
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-transparent" />
          Đang xác thực...
        </span>
      ) : (
        'Xác nhận'
      )}
    </button>
  </form>
);