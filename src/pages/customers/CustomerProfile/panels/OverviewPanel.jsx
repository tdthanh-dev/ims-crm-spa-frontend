import React from "react";

export default function OverviewPanel({
  customer,
  stats,
  formatDateTimeVN,
  formatCurrency,
}) {
  const safe = (v, fallback = "Chưa có") => (v == null || v === "" ? fallback : v);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Personal info */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl">👤</span>
          <h3 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h3>
        </div>

        <dl className="grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50/60 p-3">
            <dt className="text-xs uppercase tracking-wide text-gray-500">Họ tên</dt>
            <dd className="mt-0.5 text-sm font-medium text-gray-900">
              {safe(customer?.fullName, "—")}
            </dd>
          </div>

          <div className="rounded-lg bg-gray-50/60 p-3">
            <dt className="text-xs uppercase tracking-wide text-gray-500">Ngày sinh</dt>
            <dd className="mt-0.5 text-sm font-medium text-gray-900">
              {customer?.dob ? formatDateTimeVN(customer.dob) : "Chưa có"}
            </dd>
          </div>

          <div className="rounded-lg bg-gray-50/60 p-3">
            <dt className="text-xs uppercase tracking-wide text-gray-500">Giới tính</dt>
            <dd className="mt-0.5 text-sm font-medium text-gray-900">
              {safe(customer?.gender)}
            </dd>
          </div>

          <div className="rounded-lg bg-gray-50/60 p-3">
            <dt className="text-xs uppercase tracking-wide text-gray-500">Địa chỉ</dt>
            <dd className="mt-0.5 text-sm font-medium text-gray-900">
              {safe(customer?.address)}
            </dd>
          </div>

          <div className="sm:col-span-2 rounded-lg bg-gray-50/60 p-3">
            <dt className="text-xs uppercase tracking-wide text-gray-500">Ghi chú</dt>
            <dd className="mt-0.5 text-sm font-medium text-gray-900">
              {safe(customer?.notes, "Không có")}
            </dd>
          </div>
        </dl>
      </section>

      {/* Stats */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl">📈</span>
          <h3 className="text-lg font-semibold text-gray-900">Thống kê</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            value={customer?.totalPoints ?? 0}
            label="Điểm tích lũy"
          />
          <StatCard
            value={formatCurrency ? formatCurrency(customer?.totalSpent ?? 0) : (customer?.totalSpent ?? 0)}
            label="Tổng chi tiêu"
          />
          <StatCard value={stats?.treatmentsCount ?? 0} label="Hồ sơ điều trị" />
          <StatCard value={stats?.paymentsCount ?? 0} label="Lần thanh toán" />
        </div>
      </section>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 text-center ring-1 ring-gray-200">
      <div className="text-2xl font-bold leading-none text-gray-900">{value}</div>
      <div className="mt-1 text-xs font-medium text-gray-500">{label}</div>
    </div>
  );
}
