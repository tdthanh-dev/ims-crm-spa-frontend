import React from 'react';
import { useSettings } from '@/hooks/useSettings';


const Settings = () => {
  const {
    settings,
    activeTab,
    loading,
    message,
    error,
    setActiveTab,
    handleSaveSettings,
    updateBusinessInfo,
    updateBusinessHours,
    updateSystemSettings,
    updatePricingSettings,
    getDayName
  } = useSettings();

  const renderBusinessTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
        <span className="mr-2">🏢</span>
        Thông tin doanh nghiệp
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tên spa</label>
          <input
            type="text"
            value={settings.businessInfo.name}
            onChange={(e) => updateBusinessInfo('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập tên spa"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <input
            type="text"
            value={settings.businessInfo.address}
            onChange={(e) => updateBusinessInfo('address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập địa chỉ"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
            type="tel"
            value={settings.businessInfo.phone}
            onChange={(e) => updateBusinessInfo('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0123 456 789"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={settings.businessInfo.email}
            onChange={(e) => updateBusinessInfo('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="contact@example.com"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            value={settings.businessInfo.website}
            onChange={(e) => updateBusinessInfo('website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.example.com"
          />
        </div>
      </div>
    </div>
  );

  const renderHoursTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
        <span className="mr-2">�</span>
        Giờ làm việc
      </h3>

      <div className="space-y-4">
        {Object.entries(settings.businessHours).map(([day, hours]) => (
          <div key={day} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">
                {day === 'monday' && 'Thứ Hai'}
                {day === 'tuesday' && 'Thứ Ba'}
                {day === 'wednesday' && 'Thứ Tư'}
                {day === 'thursday' && 'Thứ Năm'}
                {day === 'friday' && 'Thứ Sáu'}
                {day === 'saturday' && 'Thứ Bảy'}
                {day === 'sunday' && 'Chủ Nhật'}
              </h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={!hours.closed}
                  onChange={(e) => updateBusinessHours(day, 'closed', !e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Mở cửa</span>
              </label>
            </div>

            {!hours.closed && (
              <div className="flex items-center space-x-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Giờ mở cửa</label>
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <span className="text-gray-500 mt-6">đến</span>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Giờ đóng cửa</label>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
        <span className="mr-2">⚙️</span>
        Cài đặt hệ thống
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sao lưu tự động</label>
            <p className="text-sm text-gray-500">Tự động sao lưu dữ liệu hệ thống</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.systemSettings.autoBackup}
              onChange={(e) => updateSystemSettings('autoBackup', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tần suất sao lưu</label>
          <select
            value={settings.systemSettings.backupFrequency}
            onChange={(e) => updateSystemSettings('backupFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="daily">Hàng ngày</option>
            <option value="weekly">Hàng tuần</option>
            <option value="monthly">Hàng tháng</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Lịch hẹn tối đa/ngày</label>
          <input
            type="number"
            value={settings.systemSettings.maxAppointmentPerDay}
            onChange={(e) => updateSystemSettings('maxAppointmentPerDay', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
            max="100"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Đặt lịch trước tối đa (ngày)</label>
          <input
            type="number"
            value={settings.systemSettings.advanceBookingDays}
            onChange={(e) => updateSystemSettings('advanceBookingDays', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
            max="365"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Thông báo SMS</label>
            <p className="text-sm text-gray-500">Gửi thông báo qua SMS</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.systemSettings.smsNotifications}
              onChange={(e) => updateSystemSettings('smsNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Thông báo Email</label>
            <p className="text-sm text-gray-500">Gửi thông báo qua email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.systemSettings.emailNotifications}
              onChange={(e) => updateSystemSettings('emailNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg md:col-span-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nhắc nhở tự động</label>
            <p className="text-sm text-gray-500">Tự động gửi nhắc nhở cho khách hàng</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.systemSettings.autoReminders}
              onChange={(e) => updateSystemSettings('autoReminders', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
        <span className="mr-2">💰</span>
        Cài đặt giá cả
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Đơn vị tiền tệ</label>
          <select
            value={settings.pricingSettings.currency}
            onChange={(e) => updatePricingSettings('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="VND">VNĐ</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Thuế (%)</label>
          <input
            type="number"
            value={settings.pricingSettings.taxRate}
            onChange={(e) => updatePricingSettings('taxRate', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            max="100"
            step="0.1"
            placeholder="10.0"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Ngưỡng giảm giá (VNĐ)</label>
          <input
            type="number"
            value={settings.pricingSettings.discountThreshold}
            onChange={(e) => updatePricingSettings('discountThreshold', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="100000"
            placeholder="1000000"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tỷ lệ tích điểm (VNĐ = 1 điểm)</label>
          <input
            type="number"
            value={settings.pricingSettings.loyaltyPointsRate}
            onChange={(e) => updatePricingSettings('loyaltyPointsRate', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="0.1"
            placeholder="10000"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-3">⚙️</span>
            Cài đặt hệ thống
          </h1>
          <p className="mt-2 text-gray-600">Cấu hình và quản lý cài đặt của spa</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${message.includes('✅') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {message.includes('✅') ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'business'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('business')}
              >
                🏢 Doanh nghiệp
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hours'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('hours')}
              >
                🕐 Giờ làm việc
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'system'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('system')}
              >
                ⚙️ Hệ thống
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pricing'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('pricing')}
              >
                💰 Giá cả
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'business' && renderBusinessTab()}
            {activeTab === 'hours' && renderHoursTab()}
            {activeTab === 'system' && renderSystemTab()}
            {activeTab === 'pricing' && renderPricingTab()}
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
                onClick={handleSaveSettings}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span>
                    Lưu cài đặt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
