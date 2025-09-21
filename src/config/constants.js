// filepath: src/config/constants.js

// Base API URL
export const API_BASE_URL = 'http://localhost:8081/api';

// API endpoints - clean & consistent with backend
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REQUEST_OTP: `${API_BASE_URL}/auth/otp/request`,
    VERIFY_OTP: `${API_BASE_URL}/auth/otp/verify`,
    ME: `${API_BASE_URL}/auth/me`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  },

  LEADS: `${API_BASE_URL}/leads`,
  CUSTOMERS: `${API_BASE_URL}/customers`,
  SERVICES: `${API_BASE_URL}/services`,
  APPOINTMENTS: `${API_BASE_URL}/appointments`,
  CUSTOMER_CASES: `${API_BASE_URL}/customer-cases`,
  INVOICES: `${API_BASE_URL}/invoices`,
  PAYMENTS: `${API_BASE_URL}/payments`,
  TIERS: `${API_BASE_URL}/tiers`,
  ROLES: `${API_BASE_URL}/roles`,
  PERMISSIONS: `${API_BASE_URL}/permissions`,
  STAFF_FIELD_PERMISSIONS: `${API_BASE_URL}/staff-field-permissions`,
  STAFF_USERS: `${API_BASE_URL}/staff-users`,
  PHOTOS: `${API_BASE_URL}/photos`,
  AUDIT: `${API_BASE_URL}/audit`,
  DASHBOARD: `${API_BASE_URL}/dashboard`,
  ACCOUNTS: `${API_BASE_URL}/accounts`,

  DEBUG: {
    TOKEN: `${API_BASE_URL}/debug/token`,
  },
};

// Lead Status mappings (matching backend LeadStatus enum)
export const LEAD_STATUS_MAP = {
  NEW: { label: 'Mới', className: 'status-new', icon: '🆕', description: 'Lead mới được tạo' },
  IN_PROGRESS: { label: 'Đang tư vấn', className: 'status-in-progress', icon: '⏳', description: 'Đang trong quá trình tư vấn' },
  WON: { label: 'Thành công', className: 'status-success', icon: '✅', description: 'Đã chuyển đổi thành khách hàng' },
  LOST: { label: 'Thất bại', className: 'status-cancelled', icon: '❌', description: 'Không thể chuyển đổi' },
};

// Backward compatibility
export const STATUS_MAP = {
  NEW: { label: 'Mới', className: 'status-new' },
  IN_PROGRESS: { label: 'Đang tư vấn', className: 'status-in-progress' },
  WON: { label: 'Thành công', className: 'status-success' },
  LOST: { label: 'Thất bại', className: 'status-cancelled' },
  SUCCESS: { label: 'Thành công', className: 'status-success' },
  CANCELLED: { label: 'Đã hủy', className: 'status-cancelled' },
};

// Customer type mappings (for source field)
export const CUSTOMER_TYPE_MAP = {
  Web: 'Web',
  Phone: 'Điện thoại',
  'Walk-in': 'Trực tiếp',
  Social: 'Mạng xã hội',
};

// Customer type mappings (for customerType field)
export const CUSTOMER_TYPE_STATUS_MAP = {
  NEW: 'Khách mới',
  EXISTING: 'Khách cũ',
  VIP: 'Khách VIP',
};

// Case Status mappings (matching backend CaseStatus enum)
export const CASE_STATUS_MAP = {
  INTAKE: { label: 'Tiếp nhận', className: 'status-intake' },
  IN_PROGRESS: { label: 'Đang điều trị', className: 'status-in-progress' },
  COMPLETED: { label: 'Hoàn thành', className: 'status-completed' },
  ON_HOLD: { label: 'Tạm dừng', className: 'status-on-hold' },
  CANCELLED: { label: 'Hủy bỏ', className: 'status-cancelled' },
};

// Service Category mappings
export const SERVICE_CATEGORY_MAP = {
  LIP: { label: 'Phun môi', icon: '💋' },
  BROW: { label: 'Phun mày', icon: '👀' },
  OTHER: { label: 'Khác', icon: '✨' },
};

// Payment Method mappings
export const PAYMENT_METHOD_MAP = {
  CASH: { label: 'Tiền mặt', icon: '💵' },
  CARD: { label: 'Thẻ', icon: '💳' },
  BANK: { label: 'Chuyển khoản', icon: '🏦' },
  EWALLET: { label: 'Ví điện tử', icon: '📱' },
};

// Invoice Status mappings
export const INVOICE_STATUS_MAP = {
  DRAFT: { label: 'Nháp', className: 'status-draft' },
  UNPAID: { label: 'Chưa thanh toán', className: 'status-unpaid' },
  PAID: { label: 'Đã thanh toán', className: 'status-paid' },
  OVERDUE: { label: 'Quá hạn', className: 'status-overdue' },
  CANCELLED: { label: 'Đã hủy', className: 'status-cancelled' },
};

// Appointment Status mappings
export const APPOINTMENT_STATUS_MAP = {
  SCHEDULED: { label: 'Đã đặt', className: 'status-scheduled' },
  CONFIRMED: { label: 'Đã xác nhận', className: 'status-confirmed' },
  NO_SHOW: { label: 'Không đến', className: 'status-no-show' },
  DONE: { label: 'Hoàn thành', className: 'status-done' },
  CANCELLED: { label: 'Đã hủy', className: 'status-cancelled' },
};

// Staff Status mappings
export const STAFF_STATUS_MAP = {
  ACTIVE: { label: 'Hoạt động', className: 'status-active' },
  INACTIVE: { label: 'Không hoạt động', className: 'status-inactive' },
  SUSPENDED: { label: 'Tạm dừng', className: 'status-suspended' },
};

// Task Status mappings
export const TASK_STATUS_MAP = {
  OPEN: { label: 'Mở', className: 'status-open' },
  DONE: { label: 'Hoàn thành', className: 'status-done' },
  CANCELLED: { label: 'Đã hủy', className: 'status-cancelled' },
};

// Retouch Status mappings
export const RETOUCH_STATUS_MAP = {
  SCHEDULED: { label: 'Đã lên lịch', className: 'status-scheduled' },
  COMPLETED: { label: 'Đã hoàn thành', className: 'status-completed' },
  CANCELLED: { label: 'Đã hủy', className: 'status-cancelled' },
};

// Permission Level mappings
export const PERMISSION_LEVEL_MAP = {
  NO: { label: 'Không truy cập', className: 'permission-no', color: 'bg-red-100 text-red-800' },
  VIEW: { label: 'Chỉ xem', className: 'permission-view', color: 'bg-blue-100 text-blue-800' },
  EDIT: { label: 'Chỉnh sửa', className: 'permission-edit', color: 'bg-green-100 text-green-800' },
};

// Field Permission mappings
export const STAFF_FIELD_PERMISSIONS_MAP = {
  // Customer field permissions
  customerName: { label: 'Tên khách hàng', category: 'customer', description: 'Quyền truy cập tên khách hàng' },
  customerPhone: { label: 'Số điện thoại', category: 'customer', description: 'Quyền truy cập số điện thoại khách hàng' },
  customerEmail: { label: 'Email', category: 'customer', description: 'Quyền truy cập email khách hàng' },
  customerDob: { label: 'Ngày sinh', category: 'customer', description: 'Quyền truy cập ngày sinh khách hàng' },
  customerGender: { label: 'Giới tính', category: 'customer', description: 'Quyền truy cập giới tính khách hàng' },
  customerAddress: { label: 'Địa chỉ', category: 'customer', description: 'Quyền truy cập địa chỉ khách hàng' },
  customerNotes: { label: 'Ghi chú', category: 'customer', description: 'Quyền truy cập ghi chú khách hàng' },

  // Financial data permissions
  customerTotalSpent: { label: 'Tổng chi tiêu', category: 'financial', description: 'Quyền truy cập tổng chi tiêu của khách hàng' },
  customerTotalPoints: { label: 'Điểm tích lũy', category: 'financial', description: 'Quyền truy cập điểm tích lũy khách hàng' },
  customerTier: { label: 'Hạng khách hàng', category: 'financial', description: 'Quyền truy cập hạng khách hàng' },
  customerVipStatus: { label: 'Trạng thái VIP', category: 'financial', description: 'Quyền truy cập trạng thái VIP' },

  // Appointment permissions
  appointmentView: { label: 'Xem lịch hẹn', category: 'appointment', description: 'Quyền xem lịch hẹn' },
  appointmentCreate: { label: 'Tạo lịch hẹn', category: 'appointment', description: 'Quyền tạo lịch hẹn mới' },
  appointmentUpdate: { label: 'Cập nhật lịch hẹn', category: 'appointment', description: 'Quyền cập nhật lịch hẹn' },
  appointmentCancel: { label: 'Hủy lịch hẹn', category: 'appointment', description: 'Quyền hủy lịch hẹn' },

  // Invoice permissions
  invoiceView: { label: 'Xem hóa đơn', category: 'invoice', description: 'Quyền xem hóa đơn' },
  invoiceCreate: { label: 'Tạo hóa đơn', category: 'invoice', description: 'Quyền tạo hóa đơn mới' },
  invoiceUpdate: { label: 'Cập nhật hóa đơn', category: 'invoice', description: 'Quyền cập nhật hóa đơn' },

  // History permissions
  historyView: { label: 'Xem lịch sử', category: 'history', description: 'Quyền xem lịch sử khách hàng' },
  historyExport: { label: 'Xuất lịch sử', category: 'history', description: 'Quyền xuất dữ liệu lịch sử' },
};

// Permission categories for grouping
export const PERMISSION_CATEGORIES = {
  customer: { label: 'Thông tin khách hàng', icon: '👤', color: 'blue' },
  financial: { label: 'Dữ liệu tài chính', icon: '💰', color: 'green' },
  appointment: { label: 'Quản lý lịch hẹn', icon: '📅', color: 'purple' },
  invoice: { label: 'Hóa đơn', icon: '🧾', color: 'yellow' },
  history: { label: 'Lịch sử', icon: '📜', color: 'gray' },
};

// Legacy Permission Scope mappings (kept for backward compatibility)
export const PERMISSION_SCOPE_MAP = {
  CUSTOMER_NAME: { label: 'Tên khách hàng', category: 'customer' },
  CUSTOMER_PHONE: { label: 'Số điện thoại', category: 'customer' },
  CUSTOMER_EMAIL: { label: 'Email', category: 'customer' },
  CUSTOMER_ADDRESS: { label: 'Địa chỉ', category: 'customer' },
  CUSTOMER_DOB: { label: 'Ngày sinh', category: 'customer' },
  CUSTOMER_NOTES: { label: 'Ghi chú', category: 'customer' },
  CUSTOMER_FINANCIAL: { label: 'Thông tin tài chính', category: 'customer' },
  APPOINTMENT_MANAGE: { label: 'Quản lý lịch hẹn', category: 'appointment' },
  INVOICE_MANAGE: { label: 'Quản lý hóa đơn', category: 'invoice' },
  CASE_MANAGE: { label: 'Quản lý case', category: 'case' },
  PHOTO_MANAGE: { label: 'Quản lý hình ảnh', category: 'photo' },
};

// App configuration
export const APP_CONFIG = {
  name: 'Spa Management',
  version: '1.0.0',
  logo: '/vite.svg',
  pagination: {
    defaultPageSize: 20,
    defaultPage: 0,
  },
};
