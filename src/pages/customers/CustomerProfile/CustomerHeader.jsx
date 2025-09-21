import React from "react";

function defaultFormatCurrency(amount) {
  if (amount == null) return "0 ₫";
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ₫`;
  }
}

export default function CustomerHeader({
  userRole,
  customer,
  onBack,
  onCreateCase,
  onCreateInvoice,
  onEditCustomer,
  formatCurrency, // nhận từ props
}) {
  // ✅ nếu prop không phải function -> dùng fallback
  const fmt =
    typeof formatCurrency === "function" ? formatCurrency : defaultFormatCurrency;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <button
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 hover:bg-gray-50"
          onClick={onBack}
          type="button"
        >
          ← Quay lại
        </button>

        {(userRole === "ADMIN" || userRole === "RECEPTIONIST") && (
          <div className="flex gap-2">
            <button
              className="rounded-lg bg-pink-600 px-3 py-2 text-white hover:bg-pink-700"
              onClick={onCreateCase}
              type="button"
            >
              ➕ Tạo hồ sơ
            </button>
            <button
              className="rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"
              onClick={onCreateInvoice}
              type="button"
            >
              💰 Tạo hóa đơn
            </button>
            {onEditCustomer && (
              <button
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 hover:bg-gray-50"
                onClick={onEditCustomer}
                type="button"
              >
                ✏️ Chỉnh sửa
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-pink-100 text-3xl">👤</div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{customer.fullName}</h1>
            {customer.isVip && (
              <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800">
                👑 VIP
              </span>
            )}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex gap-2">
              <span className="text-gray-500">📞 Điện thoại:</span>
              <span className="font-medium text-gray-900">{customer.phone}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500">📧 Email:</span>
              <span className="font-medium text-gray-900">{customer.email || "Chưa có"}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500">🏷️ Tier:</span>
              <span className="font-medium text-gray-900">{customer.tierName || "Chưa có"}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500">💰 Chi tiêu:</span>
              <span className="font-medium text-gray-900">{fmt(customer.totalSpent || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
