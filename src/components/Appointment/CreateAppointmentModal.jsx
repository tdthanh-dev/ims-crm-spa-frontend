// filepath: src/components/Appointment/CreateAppointmentModal.jsx
import React, { useMemo, useState } from 'react';
import { appointmentsApi } from '@/services/appointmentsApi';

const CreateAppointmentModal = ({
  isOpen,
  onClose,
  onAppointmentCreated,
  context // { leadId, customerName, customerPhone, customerId }
}) => {
  const [form, setForm] = useState({
    leadId: null,
    customerId: null,
    customerName: '',
    customerPhone: '',
    appointmentDateTime: '',  // "YYYY-MM-DDTHH:mm"
    status: 'SCHEDULED',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  useMemo(() => {
    if (context?.customerId) {
      setForm((f) => ({
        ...f,
        leadId: context.leadId || null,
        customerId: context.customerId,
        customerName: context.customerName || '',
        customerPhone: context.customerPhone || ''
      }));
    } else if (context?.leadId) {
      setForm((f) => ({
        ...f,
        leadId: context.leadId,
        customerId: context.customerId || null,
        customerName: context.customerName || '',
        customerPhone: context.customerPhone || ''
      }));
    }
  }, [context]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    // Validation logic matching backend AppointmentRequest.isValid()
    // Either leadId, customerId, or both customerName and customerPhone must be provided
    const isValid = form.leadId != null || form.customerId != null ||
                    (form.customerName && form.customerPhone);

    if (!isValid) {
      return setErr('Cần ít nhất một trong các thông tin: Lead ID, Customer ID, hoặc cả Tên và Số điện thoại khách hàng.');
    }

    // Required fields
    if (!form.appointmentDateTime) {
      return setErr('Vui lòng nhập thời gian hẹn.');
    }

    const body = {
      ...(form.leadId ? { leadId: Number(form.leadId) } : {}),
      ...(form.customerId ? { customerId: Number(form.customerId) } : {}),
      customerName: form.customerName || undefined,
      customerPhone: form.customerPhone || undefined,
      appointmentDateTime: form.appointmentDateTime,
      status: form.status,
      notes: form.notes || undefined
    };

    // Log request body for debugging
    console.log('Creating appointment with body:', body);

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
          {/* Customer Information from Context */}
          {(context?.customerId || context?.customerName) && (
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Thông tin khách hàng {context?.customerId ? '(tự động)' : '(từ yêu cầu)'}
              </label>
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-gray-600">Tên:</span>
                    <p className="font-medium text-gray-900">{context.customerName}</p>
                  </div>
                  {context.customerPhone && (
                    <div>
                      <span className="text-xs text-gray-600">Số điện thoại:</span>
                      <p className="font-medium text-gray-900">{context.customerPhone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Thông tin khách hàng</label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                name="customerName"
                placeholder="Tên khách hàng"
                value={form.customerName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
              <input
                type="text"
                name="customerPhone"
                placeholder="Số điện thoại"
                value={form.customerPhone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
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
              <option value="SCHEDULED">Đã lên lịch</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="NO_SHOW">Không đến</option>
              <option value="DONE">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          {/* Appointment Date & Time */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Thời gian hẹn</label>
            <input
              type="datetime-local"
              name="appointmentDateTime"
              value={form.appointmentDateTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
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
