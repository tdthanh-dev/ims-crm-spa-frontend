// filepath: src/pages/admin/Permissions.jsx
import React, { useEffect, useState } from "react";
import { staffFieldPermissionsApi } from "@/services/staffFieldPermissionsApi";
import { staffUsersApi } from "@/services/staffUsersApi";

const PERMISSION_OPTIONS = ["NO", "VIEW", "EDIT"];

const fieldGroups = {
  customer: {
    title: "Thông tin khách hàng",
    fields: [
      { key: "customerName", label: "Tên khách hàng" },
      { key: "customerPhone", label: "Số điện thoại" },
      { key: "customerEmail", label: "Email" },
      { key: "customerDob", label: "Ngày sinh" },
      { key: "customerGender", label: "Giới tính" },
      { key: "customerAddress", label: "Địa chỉ" },
      { key: "customerNotes", label: "Ghi chú" }
    ]
  },
  financial: {
    title: "Dữ liệu tài chính",
    fields: [
      { key: "customerTotalSpent", label: "Tổng chi tiêu" },
      { key: "customerTotalPoints", label: "Tổng điểm" },
      { key: "customerTier", label: "Hạng thành viên" },
      { key: "customerVipStatus", label: "VIP" }
    ]
  },
  appointment: {
    title: "Quản lý lịch hẹn",
    fields: [
      { key: "appointmentView", label: "Xem" },
      { key: "appointmentCreate", label: "Tạo" },
      { key: "appointmentUpdate", label: "Cập nhật" },
      { key: "appointmentCancel", label: "Hủy" }
    ]
  },
  invoice: {
    title: "Hóa đơn",
    fields: [
      { key: "invoiceView", label: "Xem" },
      { key: "invoiceCreate", label: "Tạo" },
      { key: "invoiceUpdate", label: "Cập nhật" }
    ]
  },
  history: {
    title: "Lịch sử",
    fields: [
      { key: "historyView", label: "Xem" },
      { key: "historyExport", label: "Xuất file" }
    ]
  }
};

const Permissions = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadStaffList();
  }, []);

  const loadStaffList = async () => {
    try {
      const res = await staffUsersApi.getAll({ size: 50 });
      setStaffList(res?.content ?? res ?? []);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError("Không thể tải danh sách nhân viên");
    }
  };

  const loadPermissions = async (staffId) => {
    if (!staffId) return;
    setLoading(true);
    setError("");
    try {
      const res = await staffFieldPermissionsApi.getByStaffId(staffId);
      if (res?.data) {
        setPermissions(res.data);
      } else {
        // Nếu chưa có thì khởi tạo mặc định
        const created = await staffFieldPermissionsApi.create(staffId);
        setPermissions(created.data ?? created);
      }
    } catch (err) {
      console.error("Error loading permissions:", err);
      setError("Không thể tải phân quyền");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setPermissions((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!selectedStaffId || !permissions) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await staffFieldPermissionsApi.update(selectedStaffId, permissions);
      setPermissions(updated.data ?? updated);
      setSuccess("Cập nhật phân quyền thành công");
    } catch (err) {
      console.error("Error saving permissions:", err);
      setError("Không thể cập nhật phân quyền");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Phân quyền nhân viên</h1>

      {/* Chọn nhân viên */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chọn nhân viên
        </label>
        <select
          value={selectedStaffId ?? ""}
          onChange={(e) => {
            const id = e.target.value ? Number(e.target.value) : null;
            setSelectedStaffId(id);
            if (id) loadPermissions(id);
          }}
          className="w-full md:w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">-- Chọn nhân viên --</option>
          {staffList.map((s) => (
            <option key={s.staffId ?? s.id} value={s.staffId ?? s.id}>
              {s.fullName || s.name || `Staff #${s.staffId ?? s.id}`}
            </option>
          ))}
        </select>
      </div>

      {/* Thông báo */}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Bảng phân quyền */}
      {loading ? (
        <p className="text-gray-600">Đang tải...</p>
      ) : permissions ? (
        <div className="space-y-6">
          {Object.entries(fieldGroups).map(([groupKey, group]) => (
            <div key={groupKey} className="rounded-xl border bg-white shadow p-4">
              <h2 className="font-semibold text-gray-800 mb-3">{group.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.fields.map((field) => (
                  <div key={field.key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{field.label}</span>
                    <select
                      value={permissions[field.key] ?? "NO"}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    >
                      {PERMISSION_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Chưa chọn nhân viên</p>
      )}

      {/* Actions */}
      {permissions && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700 disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Permissions;
  