// filepath: src/components/Appointment/AppointmentDetailModal.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { appointmentsApi } from '@/services/appointmentsApi';
import { formatDateTimeVN } from '@/utils/dateUtils';

const STATUS_OPTIONS = [
  { value: 'SCHEDULED', label: 'Đã lên lịch' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'NO_SHOW',   label: 'Không đến' },
  { value: 'DONE',      label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' }
];

const field = 'mb-2 block text-sm font-medium text-gray-700';
const input =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';

const AppointmentDetailModal = ({
  isOpen,
  onClose,
  appointment,        // object từ list
  onUpdated            // callback refresh list
}) => {
  const [form, setForm] = useState({
    status: 'SCHEDULED',
    notes: ''
  });

  // Status mapping from English to Vietnamese (fallback)
  const getStatusLabel = (status) => {
    const statusMap = {
      'SCHEDULED': 'Đã lên lịch',
      'CONFIRMED': 'Đã xác nhận',
      'NO_SHOW': 'Không đến',
      'DONE': 'Hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  };
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  // Lấy ID đúng: apptId (ưu tiên), fallback appointmentId/id
  const apptId = useMemo(
    () => appointment?.apptId ?? appointment?.appointmentId ?? appointment?.id ?? null,
    [appointment]
  );

  // Khởi tạo form theo dữ liệu đầu vào
  useEffect(() => {
    if (appointment) {
      setForm((prev) => ({
        ...prev,
        status: appointment.status ?? prev.status,
        // không đổ sẵn reason để tránh lưu nhầm
        notes: appointment.note ?? appointment.notes ?? ''
      }));
    }
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErr('');

    if (!apptId) {
      setErr('Không xác định được ID lịch hẹn');
      return;
    }
    if (!form.status) {
      setErr('Vui lòng chọn trạng thái');
      return;
    }

    try {
      setSaving(true);
      await appointmentsApi.updateStatus(apptId, {
        status: form.status,
        reason: form.reason || undefined,
        notes: form.notes || undefined
      });
      onUpdated?.();
      onClose?.();
    } catch (error) {
      console.error('Update status error:', error);
      setErr(
        error?.response?.data?.message ||
          error?.message ||
          'Cập nhật trạng thái thất bại'
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Chi tiết lịch hẹn #{apptId ?? 'N/A'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Đóng
          </button>
        </div>

        {/* Thông tin hiển thị */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoRow label="Khách hàng" value={appointment.customerName || 'N/A'} />
          <InfoRow label="Số điện thoại" value={appointment.customerPhone || 'N/A'} />
          <InfoRow label="Trạng thái" value={appointment.displayStatus || getStatusLabel(appointment.status) || 'N/A'} />
          <InfoRow label="Thời gian hẹn" value={formatDateTimeVN(appointment.appointmentDateTime)} />
          {appointment.reminderSent && (
            <InfoRow label="Đã gửi reminder" value="✓" />
          )}
          {appointment.note && (
            <div className="md:col-span-2">
              <InfoRow label="Ghi chú" value={appointment.note} />
            </div>
          )}
        </div>

        {err && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {err}
          </div>
        )}

        {/* Form chỉ đổi trạng thái */}
        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={field}>Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={input}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.value}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              * Chỉ cập nhật trạng thái, không thay đổi thời gian/dịch vụ.
            </p>
          </div>


          <div className="md:col-span-2">
            <label className={field}>Ghi chú (tuỳ chọn)</label>
            <textarea
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              className={input}
              placeholder="Ghi chú thêm..."
            />
          </div>

          <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
              onClick={onClose}
              disabled={saving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-lg bg-pink-600 px-4 py-2 text-sm text-white hover:bg-pink-700 disabled:opacity-60"
              disabled={saving}
            >
              {saving ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-sm font-medium text-gray-900">{value}</div>
  </div>
);

export default AppointmentDetailModal;
