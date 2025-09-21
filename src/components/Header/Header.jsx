import React from 'react';
import { APP_CONFIG as _APP_CONFIG } from '@/config/constants';

const Header = ({ user }) => {
  const brandName = _APP_CONFIG?.name || 'Spa KimKang';
  const initial = (user?.fullName || 'U').trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bar */}
        <div className="h-16 flex items-center gap-4">
          {/* Logo + brand */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo KK bằng Tailwind */}
            <div
              className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 via-rose-400 to-yellow-400
                         flex items-center justify-center border-2 border-yellow-300 shadow-md select-none"
              title={brandName}
              aria-label={`Logo ${brandName}`}
            >
              <span className="text-white font-bold text-lg tracking-wide">KK</span>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-black-900 font-bold text-base sm:text-lg truncate">
                {brandName}
              </span>
              <span className="text-xs text-black-600/80">
                Hệ thống quản lý Spa KimKang
              </span>
            </div>
          </div>

          {/* Search (center) */}
          <div className="flex-1 hidden md:flex justify-center">
            <div className="w-full max-w-xl">
              <div className="group relative flex items-center bg-white border border-primary-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 transition">
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng, lịch hẹn..."
                  aria-label="Tìm kiếm"
                  className="w-full px-4 py-2.5 text-sm text-black-800 placeholder-black-500/70 outline-none"
                />
                <button
                  className="h-10 px-3 border-l border-primary-100 text-black-700 hover:bg-primary-50 transition"
                  title="Tìm kiếm"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-1"
                    aria-hidden="true"
                  >
                    <path
                      d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* User (right) */}
          <div className="ml-auto flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white grid place-items-center font-semibold shadow">
              {initial}
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-black-900 text-sm font-semibold truncate max-w-[180px]">
                {user?.fullName || 'User'}
              </span>
              <span className="text-black-600 text-xs">
                {user?.position || 'Nhân viên'}
              </span>
            </div>
          </div>
        </div>

        {/* Search on mobile (optional row) */}
        <div className="md:hidden pb-3">
          <div className="w-full">
            <div className="group relative flex items-center bg-white border border-primary-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 transition">
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng, lịch hẹn..."
                aria-label="Tìm kiếm"
                className="w-full px-4 py-2.5 text-sm text-black-800 placeholder-black-500/70 outline-none"
              />
              <button
                className="h-10 px-3 border-l border-primary-100 text-black-700 hover:bg-primary-50 transition"
                title="Tìm kiếm"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-1"
                  aria-hidden="true"
                >
                  <path
                    d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
