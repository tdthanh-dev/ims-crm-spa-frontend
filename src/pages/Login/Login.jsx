import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm/AuthForm';

const Login = ({ onLogin }) => {
  const [selectedCountry, setSelectedCountry] = useState('VN');
  const [selectedLanguage, setSelectedLanguage] = useState('vi');

  const countries = [
    { code: 'VN', name: 'Việt Nam', flag: '🇻🇳' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' }
  ];

  const languages = [
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' }
  ];

  return (
    // Nền ảnh gốc (không overlay)
    <div
      className="min-h-screen relative overflow-hidden bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/Images/BackLogin.png')" }} // đảm bảo /public/images/BackLogin.png (chữ thường)
    >
      {/* Header */}
      <header className="relative z-10 bg-white shadow-sm border-b border-primary-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">S</span>
              </div>
              <span className="text-xl font-bold text-black-900 hidden sm:block">
                Trung tâm quản lý SPA
              </span>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              {/* Country */}
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="appearance-none bg-white border-2 border-primary-200 rounded-lg px-3 py-2 text-sm text-black-800 focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-all duration-200"
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Language */}
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none bg-white border-2 border-primary-200 rounded-lg px-3 py-2 text-sm text-black-800 focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-all duration-200"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-5">
              <div className="space-y-3">
             
                <br />
                <h2 className="inline-block bg-white/40 text-black-900 px-3 py-1.5 rounded-xl text-3xl sm:text-4xl lg:text-5xl font-bold">
                  Hệ thống quản lý SPA
                </h2>
                <p className="inline-block bg-white/40 text-black-900 px-4 py-2 rounded-xl text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Trải nghiệm dịch vụ spa đẳng cấp với công nghệ quản lý hiện đại.
                  Nơi sự chăm sóc tận tâm gặp gỡ công nghệ tiên tiến.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0">
                <div className="inline-flex items-center gap-3 bg-white/70 px-3 py-2 rounded-xl shadow-sm text-black-900">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Quản lý dễ dàng</span>
                </div>

                <div className="inline-flex items-center gap-3 bg-white/70 px-3 py-2 rounded-xl shadow-sm text-black-900">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Bảo mật cao</span>
                </div>

                <div className="inline-flex items-center gap-3 bg-white/70 px-3 py-2 rounded-xl shadow-sm text-black-900">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Hiệu suất cao</span>
                </div>

                <div className="inline-flex items-center gap-3 bg-white/70 px-3 py-2 rounded-xl shadow-sm text-black-900">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Chăm sóc tận tâm</span>
                </div>
              </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <AuthForm onLogin={onLogin} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
