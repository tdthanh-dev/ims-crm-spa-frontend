import React from 'react';

export const EmailLoginForm = ({
  formData,
  showPassword,
  error,
  loading,
  onInputChange,
  onSubmit,
  onSwitchToPhone,
  onTogglePassword,
  onClearError
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-black-800">
        Địa chỉ email
      </label>
      <input
        type="email"
        placeholder="your.email@example.com"
        value={formData.email}
        onChange={(e) => onInputChange('email', e.target.value)}
        onFocus={onClearError}
        className="mt-1 block w-full rounded-xl border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 text-black-900 placeholder:text-black-400 px-3 py-2.5"
        disabled={loading}
      />
    </div>

    <div>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-black-800">
          Mật khẩu
        </label>
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
          onChange={(e) => onInputChange('password', e.target.value)}
          onFocus={onClearError}
          className="block w-full rounded-xl border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 text-black-900 placeholder:text-black-400 px-3 py-2.5 pr-12"
          disabled={loading}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 my-auto h-9 px-3 rounded-lg hover:bg-primary-50"
          onClick={onTogglePassword}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
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
          Đang xử lý...
        </span>
      ) : (
        'Đăng nhập'
      )}
    </button>

    <div className="text-center">
      <button
        type="button"
        onClick={onSwitchToPhone}
        className="text-sm text-primary-600 hover:text-primary-700 underline"
      >
        Đăng nhập bằng số điện thoại
      </button>
    </div>
  </form>
);