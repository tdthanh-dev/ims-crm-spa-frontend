import React from 'react';

export default function CustomerTabs({ activeTab, onChange }) {
  const tabs = [
    { key: 'overview', label: '📊 Tổng quan' },
    { key: 'treatments', label: '💉 Lịch sử điều trị' },
    { key: 'appointments', label: '📅 Lịch hẹn' },
    { key: 'financial', label: '💳 Tài chính' },
    { key: 'photos', label: '📸 Ảnh' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`rounded-full px-4 py-2 text-sm transition ${
            activeTab === t.key
              ? 'bg-pink-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}