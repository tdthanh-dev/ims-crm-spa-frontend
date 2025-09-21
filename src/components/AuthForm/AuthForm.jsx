import React from 'react';
import { useAuthForm } from '@/hooks/useAuthForm';
import { formatEmailOrPhoneForDisplay } from '@/utils/formatters';

const AuthForm = ({ onLogin }) => {
  const {
    // States
    formType,
    formData,
    showPassword,
    error,
    loading,
    isTimerActive,
    displayEmail,

    // Handlers
    handleInputChange,
    handleOtpChange,
    handleOtpPaste,
    handleSubmit,
    switchToEmail,
    switchToPhone,
    goBackFromOtp,
    togglePasswordVisibility,
    clearError,
    resendOtp,

    // Computed values
    formattedTimer,
    canSubmitEmail,
    canSubmitPhone,
    canSubmitOtp
  } = useAuthForm(onLogin);

  return (
    <div className="w-full grid place-items-center px-0 py-0">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-md border border-primary-200/60 shadow-2xl rounded-2xl p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-black-900">
              {formType === 'otp' ? 'Nhập mã OTP' : 'Đăng nhập'}
            </h2>
            <p className="mt-1 text-sm text-black-600">
              {formType === 'email' && (
                <button 
                  type="button" 
                  className="underline text-primary-600 hover:text-primary-700" 
                  onClick={switchToPhone}
                >
                  Đăng nhập bằng số điện thoại
                </button>
              )}
              {formType === 'phone' && (
                <button 
                  type="button" 
                  className="underline text-primary-600 hover:text-primary-700" 
                  onClick={switchToEmail}
                >
                  Đăng nhập bằng email
                </button>
              )}
              {formType === 'otp' && (
                <span>Mã OTP được gửi về "{formatEmailOrPhoneForDisplay(displayEmail)}"</span>
              )}
            </p>
          </div>

          {/* Email/Phone Login Form */}
          {(formType === 'email' || formType === 'phone') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formType === 'email' ? (
                <div>
                  <label className="block text-sm font-medium text-black-800">Địa chỉ email</label>
                  <input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    value={formData.email} 
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={clearError}
                    className="mt-1 block w-full rounded-xl border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 text-black-900 placeholder:text-black-400 px-3 py-2.5" 
                    disabled={loading}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-black-800">Số điện thoại</label>
                  <input 
                    type="tel" 
                    placeholder="Nhập số điện thoại" 
                    value={formData.phone} 
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onFocus={clearError}
                    className="mt-1 block w-full rounded-xl border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 text-black-900 placeholder:text-black-400 px-3 py-2.5" 
                    disabled={loading}
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-black-800">Mật khẩu</label>
                  <button 
                    type="button" 
                    className="text-sm text-primary-600 hover:text-primary-700 underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="mt-1 relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Nhập mật khẩu" 
                    value={formData.password} 
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={clearError}
                    className="block w-full rounded-xl border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 text-black-900 placeholder:text-black-400 px-3 py-2.5 pr-12" 
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 my-auto h-9 px-3 rounded-lg hover:bg-primary-50"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-error-200 bg-error-50 text-error-700 px-3 py-2">
                  <span>⚠️</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (formType === 'email' ? !canSubmitEmail : !canSubmitPhone)}
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary-500 text-white px-4 py-2.5 font-semibold hover:bg-primary-600 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-transparent" />
                    Đang xử lý...
                  </span>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </form>
          )}

          {/* OTP Verification Form */}
          {formType === 'otp' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <button 
                  type="button" 
                  onClick={goBackFromOtp}
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Quay lại
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {formData.otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onPaste={handleOtpPaste}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) {
                        const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
                        if (prevInput) prevInput.focus();
                      }
                    }}
                    className="w-full h-12 text-center text-lg font-semibold border-2 border-primary-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-200 text-black-900"
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
                    Mã xác nhận có hiệu lực trong <strong className="text-black-900">{formattedTimer}</strong>
                  </span>
                ) : (
                  <button 
                    type="button" 
                    onClick={resendOtp}
                    className="underline text-primary-600 hover:text-primary-700"
                    disabled={loading}
                  >
                    Gửi lại mã OTP
                  </button>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-error-200 bg-error-50 text-error-700 px-3 py-2">
                  <span>⚠️</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !canSubmitOtp}
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
          )}
        </div>
        
        <p className="mt-6 text-center text-xs text-black-500">
          * Khi tiếp tục, bạn đồng ý với Điều khoản & Chính sách bảo mật.
        </p>
      </div>
    </div>
  );
};

export default AuthForm;