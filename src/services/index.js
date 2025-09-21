// Export all services
export { leadsService } from './LeadsService';
export { customersService } from './CustomersService';
export { appointmentsService } from './AppointmentsService';
export { servicesService } from './ServicesService';
export { customerCaseService } from './CustomerCaseService';
export { invoiceService } from './InvoiceService';
export { paymentService } from './PaymentService';
export { tierService } from './TierService';

// Export new API services
export { leadsApi } from './leadsApi';
export { customersApi } from './customersApi';
export { appointmentsApi } from './appointmentsApi'; // 
export { servicesApi } from './servicesApi';
export { customerCasesApi } from './customerCasesApi';
export { invoicesApi } from './invoicesApi';
export { paymentsApi } from './paymentsApi';
export { rolesApi } from './rolesApi';
export { tiersApi } from './tiersApi';
export { staffUsersApi } from './staffUsersApi';
export { photosApi } from './photosApi';
export { accountsApi } from './accountsApi';
export { permissionsApi } from './permissionsApi';
export { staffFieldPermissionsApi } from './staffFieldPermissionsApi';
export { dashboardApi } from './dashboardApi';
export { tokenDebugApi } from './tokenDebugApi';

// Legacy API exports (from api.js)
export { authAPI, leadsAPI, spaCustomersAPI, servicesAPI, appointmentsAPI, invoicesAPI, paymentsAPI, auditAPI, tasksAPI } from './api';

// Export base service for custom implementations
export { BaseService } from './BaseService';

// Export API client for direct usage
export { default as apiClient } from './apiClient';

// Legacy exports for backward compatibility
// NOTE: These are deprecated. Use the new API services (leadsApi, customersApi, etc.) instead
// export { leadsService as leadsApi } from './LeadsService';
// export { customersService as customersApi } from './CustomersService';
// export { appointmentsService as appointmentsApi } from './AppointmentsService';
// export { servicesService as servicesApi } from './ServicesService';
