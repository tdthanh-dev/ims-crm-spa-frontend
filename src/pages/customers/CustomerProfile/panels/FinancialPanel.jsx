import React from "react";

/**
 * Cho phép truyền getStatusBadge theo 2 kiểu:
 * 1) Trả về ReactNode: render thẳng
 * 2) Trả về object { text, className }: tự wrap thành badge
 */
function renderStatusBadge(getStatusBadge, type, status) {
  if (typeof getStatusBadge !== "function") return null;
  const out = getStatusBadge(type, status);
  if (!out) return null;

  // Nếu là React element -> trả nguyên
  if (React.isValidElement(out)) return out;

  // Nếu là object { text, className }
  if (typeof out === "object") {
    const { text, className } = out;
    const safeText = text ?? String(status ?? "");
    const safeClass =
      className ??
      "bg-gray-100 text-gray-800"; // fallback
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${safeClass}`}>
        {safeText}
      </span>
    );
  }

  // Nếu là string -> bọc badge mặc định
  if (typeof out === "string") {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
        {out}
      </span>
    );
  }

  return null;
}

export default function FinancialPanel({
  loading,
  items = [],
  onCreateInvoice,
  formatDateTimeVN,
  formatCurrency,
  getStatusBadge,
}) {
  if (loading) {
    return <div className="text-gray-500">Đang tải...</div>;
  }

  if (!items.length) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Lịch sử giao dịch</h3>
          <button
            type="button"
            onClick={onCreateInvoice}
            className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
          >
            ➕ Tạo hóa đơn
          </button>
        </div>

        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <div className="mb-2 text-3xl">💰</div>
          <p className="text-gray-600">Chưa có giao dịch nào</p>
          <button
            type="button"
            onClick={onCreateInvoice}
            className="mt-3 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
          >
            Tạo hóa đơn đầu tiên
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Lịch sử giao dịch</h3>
        <button
          type="button"
          onClick={onCreateInvoice}
          className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
        >
          ➕ Tạo hóa đơn
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map((invoice) => {
          const isPaid = invoice?.paid === true || invoice?.status === "PAID";
          const hasBalanceDue = invoice?.balanceDue > 0;
          const isOverdue = invoice?.overdue === true;

          return (
            <div
              key={invoice?.invoiceId ?? `invoice-${invoice?.createdAt}`}
              className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg">📄</span>
                  <h4 className="truncate font-semibold text-gray-900">
                    {invoice?.invoiceNumber || `Hóa đơn #${invoice?.invoiceId}`}
                  </h4>
                  {renderStatusBadge(getStatusBadge, "INVOICE", invoice?.status)}
                  {isOverdue && (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                      Quá hạn
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                  <p>
                    <strong>Ngày tạo:</strong>{" "}
                    {typeof formatDateTimeVN === "function"
                      ? formatDateTimeVN(invoice?.createdAt)
                      : invoice?.createdAt || "—"}
                  </p>

                  <p>
                    <strong>Hạn thanh toán:</strong>{" "}
                    {typeof formatDateTimeVN === "function"
                      ? formatDateTimeVN(invoice?.dueDate)
                      : invoice?.dueDate || "—"}
                  </p>

                  <p>
                    <strong>Dịch vụ:</strong> {invoice?.caseId ? `Hồ sơ #${invoice?.caseId}` : "—"}
                  </p>

                  <p>
                    <strong>Nhân viên:</strong> {invoice?.userName || "—"}
                  </p>
                </div>

                {/* Payment Information */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">Tổng tiền:</span>
                    <span className="text-gray-900">
                      {typeof formatCurrency === "function"
                        ? formatCurrency(invoice?.totalAmount)
                        : invoice?.totalAmount ?? 0}
                    </span>
                  </div>

                  {invoice?.totalPaid > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-emerald-700">Đã thanh toán:</span>
                      <span className="text-emerald-700">
                        {typeof formatCurrency === "function"
                          ? formatCurrency(invoice?.totalPaid)
                          : invoice?.totalPaid}
                      </span>
                    </div>
                  )}

                  {hasBalanceDue && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-red-700">Còn nợ:</span>
                      <span className="text-red-700">
                        {typeof formatCurrency === "function"
                          ? formatCurrency(invoice?.balanceDue)
                          : invoice?.balanceDue}
                      </span>
                    </div>
                  )}
                </div>

                {/* Payment Status */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                  <span className={`text-sm font-medium ${
                    isPaid ? 'text-emerald-700' :
                    hasBalanceDue ? 'text-orange-700' : 'text-gray-700'
                  }`}>
                    {invoice?.paymentStatus || invoice?.displayStatus || invoice?.status}
                  </span>
                </div>
              </div>

              <div className="ml-4 whitespace-nowrap text-right">
                <div className={`text-lg font-semibold ${
                  isPaid ? 'text-emerald-600' :
                  hasBalanceDue ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {typeof formatCurrency === "function"
                    ? formatCurrency(invoice?.totalAmount)
                    : invoice?.totalAmount ?? 0}
                </div>
                {hasBalanceDue && (
                  <div className="text-sm text-red-600 font-medium">
                    Còn nợ: {typeof formatCurrency === "function"
                      ? formatCurrency(invoice?.balanceDue)
                      : invoice?.balanceDue}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
