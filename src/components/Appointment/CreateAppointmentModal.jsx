// filepath: src/components/Appointment/CreateAppointmentModal.jsx
import React, { useMemo, useState } from 'react';
import { appointmentsApi } from '@/services/appointmentsApi';

const CreateAppointmentModal = ({
  isOpen,
  onClose,
  onAppointmentCreated,
  services = [],
  customers = [],
  context // { leadId }
}) => {
  const [form, setForm] = useState({
    leadId: null,
    customerId: null,
    serviceId: '',
    startAt: '',   // "YYYY-MM-DDTHH:mm"
    endAt: '',
    status: 'SCHEDULED',
    notes: '',
    technicianId: '',    // optional
    receptionistId: ''   // tuỳ BE, nếu map JWT thì có thể bỏ
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  useMemo(() => {
    if (context?.leadId) {
      setForm((f) => ({ ...f, leadId: context.leadId, customerId: null }));
    }
  }, [context]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleSelectCustomer = (e) => {
    const val = e.target.value ? Number(e.target.value) : null;
    setForm(prev => ({ ...prev, customerId: val, leadId: null }));
  };

  const normalizeLocal = (s) => {
    if (!s) return s;
    // input "YYYY-MM-DDTHH:mm" -> thêm :00, và chắc chắn KHÔNG có 'Z'
    return s.length === 16 ? `${s}:00` : s.replace('Z', '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    // XOR lead/customer
    if (!form.leadId && !form.customerId) return setErr('Vui lòng chọn 1 trong 2: Lead hoặc Khách hàng.');
    if (form.leadId && form.customerId) return setErr('Chỉ chọn một trong hai: Lead hoặc Khách hàng.');

    if (!form.serviceId || !form.startAt || !form.endAt) {
      return setErr('Vui lòng nhập đủ Dịch vụ, thời gian Bắt đầu & Kết thúc.');
    }

    const startLocal = normalizeLocal(form.startAt);
    const endLocal = normalizeLocal(form.endAt);

    // FE validate end > start
    if (new Date(startLocal) >= new Date(endLocal)) {
      return setErr('Thời gian kết thúc phải sau thời gian bắt đầu.');
    }

    const body = {
      ...(form.leadId ? { leadId: Number(form.leadId) } : {}),
      ...(form.customerId ? { customerId: Number(form.customerId) } : {}),
      serviceId: Number(form.serviceId),
      startAt: startLocal, // <<<<<< gửi local-naive
      endAt: endLocal,     // <<<<<< gửi local-naive
      status: form.status,
      notes: form.notes || undefined,
      technicianId: form.technicianId ? Number(form.technicianId) : null, // optional
      receptionistId: form.receptionistId ? Number(form.receptionistId) : undefined
    };

    try {
      setSubmitting(true);
      await appointmentsApi.createAppointment(body);
      onAppointmentCreated?.();
    } catch (error) {
      console.error('Create appointment error:', error);
      setErr(
        error?.response?.data?.message ||
        error?.message ||
        'Tạo lịch hẹn thất bại'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Tạo lịch hẹn</h3>
          <button onClick={onClose} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">Đóng</button>
        </div>

        {err && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* One-of: Lead or Customer */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Chọn khách hàng (hoặc nhập Lead ID)</label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <select
                name="customerId"
                value={form.customerId ?? ''}
                onChange={handleSelectCustomer}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                disabled={!!form.leadId}
              >
                <option value="">-- Chọn khách hàng --</option>
                {customers.map((c) => (
                  <option key={c.customerId ?? c.id} value={c.customerId ?? c.id}>
                    {c.fullName} {c.phone ? `(${c.phone})` : ''}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="leadId"
                placeholder="Lead ID (nếu tạo từ lead)"
                value={form.leadId ?? ''}
                onChange={(e) => setForm(prev => ({ ...prev, leadId: e.target.value ? Number(e.target.value) : null, customerId: null }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                disabled={!!form.customerId}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Chỉ chọn một trong hai: Khách hàng hoặc Lead.</p>
          </div>

          {/* Service */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Dịch vụ</label>
            <select
              name="serviceId"
              value={form.serviceId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            >
              <option value="">-- Chọn dịch vụ --</option>
              {services.map((s) => (
                <option key={s.serviceId ?? s.id} value={s.serviceId ?? s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="NO_SHOW">NO_SHOW</option>
              <option value="DONE">DONE</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Start/End */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Bắt đầu</label>
            <input
              type="datetime-local"
              name="startAt"
              value={form.startAt}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Kết thúc</label>
            <input
              type="datetime-local"
              name="endAt"
              value={form.endAt}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          {/* Technician (optional) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Technician ID (tuỳ chọn)</label>
            <input
              type="number"
              name="technicianId"
              value={form.technicianId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Ví dụ: 4"
            />
          </div>

          {/* Receptionist (nếu BE chưa map JWT thì cần) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Receptionist ID</label>
            <input
              type="number"
              name="receptionistId"
              value={form.receptionistId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Ví dụ: 3"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Ghi chú</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Ghi chú thêm..."
            />
          </div>

          {/* Actions */}
          <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
            <button type="button" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50" onClick={onClose} disabled={submitting}>Hủy</button>
            <button type="submit" className="rounded-lg bg-pink-600 px-4 py-2 text-sm text-white hover:bg-pink-700 disabled:opacity-60" disabled={submitting}>
              {submitting ? 'Đang tạo...' : 'Tạo lịch hẹn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointmentModal;
