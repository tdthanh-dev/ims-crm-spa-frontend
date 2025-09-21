import React from 'react';
import { CASE_STATUS_MAP } from '@/config/constants';

export default function TreatmentsPanel({
  loading,
  treatments,
  onCreateCase,
  onCreateInvoiceForCase,
  onViewCaseDetail,
  onOpenCasePhotos, // 👈 mới: callback mở panel ảnh, nhận object hồ sơ
  formatDateTimeVN,
}) {
  if (loading) {
    return <div className="text-gray-500">Đang tải...</div>;
  }

  if (!treatments || treatments.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Lịch sử điều trị</h3>
          <button
            className="rounded-lg bg-pink-600 px-3 py-2 text-white hover:bg-pink-700"
            onClick={onCreateCase}
          >
            ➕ Tạo hồ sơ mới
          </button>
        </div>
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <div className="mb-2 text-3xl">💉</div>
          <p className="text-gray-600">Chưa có hồ sơ điều trị nào</p>
          <button
            className="mt-3 rounded-lg bg-pink-600 px-3 py-2 text-white hover:bg-pink-700"
            onClick={onCreateCase}
          >
            Tạo hồ sơ đầu tiên
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Lịch sử điều trị</h3>
        <button
          className="rounded-lg bg-pink-600 px-3 py-2 text-white hover:bg-pink-700"
          onClick={onCreateCase}
        >
          ➕ Tạo hồ sơ mới
        </button>
      </div>

      <div className="divide-y rounded-xl border border-gray-200">
        {treatments.map((t) => {
          const caseId = t.caseId ?? t.id;
          return (
            <div
              key={caseId}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50"
            >
              {/* Thông tin trái */}
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-gray-900">{t.serviceName}</h4>
                <p className="text-sm text-gray-700">
                  <strong>Ngày bắt đầu:</strong> {formatDateTimeVN(t.startDate)}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Ngày kết thúc:</strong>{' '}
                  {t.endDate ? formatDateTimeVN(t.endDate) : 'Chưa có'}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Ghi chú:</strong> {t.intakeNote || 'Không có'}
                </p>
              </div>

              {/* Trạng thái + nút */}
              <div className="flex flex-col items-start sm:items-end gap-2">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      CASE_STATUS_MAP[t.status]?.className || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {CASE_STATUS_MAP[t.status]?.label || t.status}
                  </span>
                  {t.paidStatus && (
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        t.paidStatus === 'UNPAID'
                          ? 'bg-red-100 text-red-800'
                          : t.paidStatus === 'PARTIALLY_PAID'
                          ? 'bg-yellow-100 text-yellow-800'
                          : t.paidStatus === 'FULLY_PAID'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {t.paidStatus === 'UNPAID'
                        ? 'Chưa thanh toán'
                        : t.paidStatus === 'PARTIALLY_PAID'
                        ? 'Thanh toán một phần'
                        : t.paidStatus === 'FULLY_PAID'
                        ? 'Đã thanh toán'
                        : t.paidStatus}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                    onClick={() => onViewCaseDetail?.(t)}
                  >
                    👁 Xem chi tiết
                  </button>

                  {/* 👇 Nút mở panel ảnh */}
                  <button
                    className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm text-white hover:bg-violet-700"
                    onClick={() => onOpenCasePhotos?.(t)}
                    title="Xem ảnh trước/sau của hồ sơ"
                  >
                    📷 Ảnh
                  </button>

                  {(t.paidStatus === 'UNPAID' || t.paidStatus === 'PARTIALLY_PAID') && (
                    <button
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                      onClick={() => onCreateInvoiceForCase?.(t)}
                    >
                      💰 Thanh toán
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
