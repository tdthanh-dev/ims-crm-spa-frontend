// filepath: admin-spa-management/src/config/roleMenus.js

/**
 * Role-based menu configuration for CRM Spa system
 * Each role has specific menu items with corresponding components
 */

export const ROLE_MENUS = {
  ADMIN: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      iconClass: 'fas fa-tachometer-alt',
      component: 'AdminDashboard',
      path: '/admin/dashboard'
    },
    {
      id: 'users',
      label: 'Quản lý nhân viên',
      iconClass: 'fas fa-users',
      component: 'UserManagement',
      path: '/admin/users'
    },
    {
      id: 'staff-permissions',
      label: 'Quyền truy cập',
      iconClass: 'fas fa-key',
      component: 'StaffFieldPermissionsPage',
      path: '/admin/staff-permissions'
    },
    {
      id: 'payments',
      label: 'Thanh toán',
      iconClass: 'fas fa-credit-card',
      component: 'PaymentManagement',
      path: '/admin/payments'
    },
    {
      id: 'tasks',
      label: 'Nhiệm vụ',
      iconClass: 'fas fa-tasks',
      component: 'TaskManagement',
      path: '/admin/tasks'
    },
    {
      id: 'customers',
      label: 'Khách hàng',
      iconClass: 'fas fa-user-friends',
      component: 'CustomerManagement',
      path: '/admin/customers'
    },
    {
      id: 'services',
      label: 'Dịch vụ',
      iconClass: 'fas fa-concierge-bell',
      component: 'ServiceManagement',
      path: '/admin/services'
    },
    {
      id: 'appointments',
      label: 'Lịch hẹn',
      iconClass: 'fas fa-calendar-alt',
      component: 'AppointmentCalendar',
      path: '/admin/appointments'
    },
    {
      id: 'reports',
      label: 'Báo cáo',
      iconClass: 'fas fa-chart-line',
      component: 'Reports',
      path: '/admin/reports'
    },
    {
      id: 'permissions',
      label: 'Phân quyền',
      iconClass: 'fas fa-shield-alt',
      component: 'Permissions',
      path: '/admin/permissions'
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      iconClass: 'fas fa-cog',
      component: 'Settings',
      path: '/admin/settings'
    }
  ],

  RECEPTIONIST: [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      iconClass: 'fas fa-tachometer-alt',
      component: 'ReceptionistDashboard',
      path: '/receptionist/dashboard'
    },
    {
      id: 'consultation',
      label: 'Yêu cầu tư vấn',
      iconClass: 'fas fa-comments',
      component: 'ConsultationDashboard',
      path: '/receptionist/consultation'
    },
    {
      id: 'appointments',
      label: 'Quản lý lịch hẹn',
      iconClass: 'fas fa-calendar-check',
      component: 'AppointmentsManagement',
      path: '/receptionist/appointments'
    },
    {
      id: 'customers',
      label: 'Khách hàng',
      iconClass: 'fas fa-user-friends',
      component: 'CustomerList',
      path: '/receptionist/customers'
    },
    {
      id: 'payments',
      label: 'Thanh toán',
      iconClass: 'fas fa-credit-card',
      component: 'PaymentManagement',
      path: '/receptionist/payments'
    }
  ],

  TECHNICIAN: [
    {
      id: 'dashboard',
      label: 'Lịch hôm nay',
      iconClass: 'fas fa-calendar-day',
      component: 'TechnicianDashboard',
      path: '/technician/dashboard'
    },
    {
      id: 'appointments',
      label: 'Lịch hẹn của tôi',
      iconClass: 'fas fa-calendar-check',
      component: 'MyAppointments',
      path: '/technician/appointments'
    },
    {
      id: 'customers',
      label: 'Khách hàng',
      iconClass: 'fas fa-user-friends',
      component: 'CustomerList',
      path: '/technician/customers'
    },
    {
      id: 'treatments',
      label: 'Quá trình điều trị',
      iconClass: 'fas fa-spa',
      component: 'TreatmentProcess',
      path: '/technician/treatments'
    },
    {
      id: 'photos',
      label: 'Hình ảnh',
      iconClass: 'fas fa-camera',
      component: 'PhotoGallery',
      path: '/technician/photos'
    }
  ]
};

/**
 * Default dashboard paths for each role
 */
export const ROLE_DEFAULT_PATHS = {
  ADMIN: '/admin/dashboard',
  RECEPTIONIST: '/receptionist/dashboard',
  TECHNICIAN: '/technician/dashboard'
};

/**
 * All available role names
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  RECEPTIONIST: 'RECEPTIONIST',
  TECHNICIAN: 'TECHNICIAN'
};
