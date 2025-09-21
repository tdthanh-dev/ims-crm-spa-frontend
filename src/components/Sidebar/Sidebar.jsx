// ========================= Sidebar.jsx (Tailwind) =========================
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ menuItems = [], onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (item) => {
    if (item.path) navigate(item.path);
  };

  const isActive = (item) => location.pathname === item.path;

  return (
    <aside className="h-full flex flex-col bg-white border-r border-primary-100 shadow-sm">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-3 border-b border-primary-100 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white grid place-items-center shadow">
            <span className="font-bold">S</span>
          </div>
          <span className="text-black-900 font-semibold">SPA Admin</span>
        </div>

        {/* Nav - Allow scrolling if needed */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          {menuItems.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={
                  `group w-full flex items-center rounded-xl px-3 py-2 mb-1 transition ` +
                  (active
                    ? 'bg-primary-100 text-primary-800 border border-primary-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]'
                    : 'text-black-800 hover:bg-primary-50 border border-transparent')
                }
              >
                <i className={`text-lg mr-3 ${item.iconClass || 'fas fa-circle'} ${active ? 'text-primary-700' : 'text-black-600'}`}></i>
                <span className="truncate text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer - Always visible at bottom */}
        <div className="px-2 pb-3 border-t border-primary-100 flex-shrink-0 bg-white">
          <button
            onClick={onLogout}
            className="w-full flex items-center rounded-xl px-3 py-2 mt-2 border border-primary-200 text-black-800 hover:bg-primary-50"
          >
            <i className="fas fa-sign-out-alt mr-3"></i>
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
