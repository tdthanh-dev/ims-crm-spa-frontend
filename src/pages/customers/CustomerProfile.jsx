// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { customersService, customerCaseService, invoiceService, paymentService, servicesService } from '@/services';
// import { formatDateTimeVN } from '@/utils/dateUtils';
// import { CASE_STATUS_MAP, PAYMENT_METHOD_MAP, INVOICE_STATUS_MAP } from '@/config/constants';
// import CustomerCaseCreationModal from '@/components/Customer/CustomerCaseCreationModal';
// import InvoiceCreationModal from '@/components/Billing/InvoiceCreationModal';
// import './CustomerProfile.css';

// const CustomerProfile = ({ userRole }) => {
//   const { customerId } = useParams();
//   const navigate = useNavigate();

//   const [customer, setCustomer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('overview');

//   // Modal states
//   const [showCaseCreationModal, setShowCaseCreationModal] = useState(false);
//   const [showInvoiceCreationModal, setShowInvoiceCreationModal] = useState(false);

//   // Tab data
//   const [tabData, setTabData] = useState({
//     treatments: [],
//     appointments: [],
//     financial: [],
//     photos: []
//   });

//   const [tabLoading, setTabLoading] = useState({
//     treatments: false,
//     appointments: false,
//     financial: false,
//     photos: false
//   });

//   useEffect(() => {
//     if (customerId) {
//       loadCustomerData();
//     }
//   }, [customerId]);

//   useEffect(() => {
//     if (customer && activeTab !== 'overview') {
//       loadTabData(activeTab);
//     }
//   }, [customer, activeTab]);

//   const loadCustomerData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const customerData = await customersService.getById(customerId);
//       if (customerData) {
//         setCustomer(customerData);
//       } else {
//         throw new Error('Không tìm thấy khách hàng');
//       }
//     } catch (err) {
//       console.error('Error loading customer:', err);
//       setError('Không thể tải thông tin khách hàng');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadTabData = async (tab) => {
//     if (!customer) return;

//     setTabLoading(prev => ({ ...prev, [tab]: true }));

//     try {
//       let data = [];

//       switch (tab) {
//         case 'treatments':
//           try {
//             const response = await customerCaseService.getByCustomerId(customerId);
//             data = response?.content || [];
//           } catch (err) {
//             console.error('Error loading treatments:', err);
//             data = [];
//           }
//           break;

//         case 'appointments':
//           // TODO: Implement appointments loading
//           data = [
//             {
//               id: 1,
//               serviceName: 'Phun môi',
//               technician: 'Nguyễn Thị Hoa',
//               date: '2024-01-15',
//               time: '14:00',
//               status: 'DONE',
//               notes: 'Khách hài lòng với kết quả'
//             }
//           ];
//           break;

//         case 'financial':
//           try {
//             const [invoicesResponse, paymentsResponse] = await Promise.all([
//               invoiceService.getByCustomerId(customerId),
//               paymentService.getByCustomerId(customerId)
//             ]);

//             const invoices = (invoicesResponse?.content || []).map(invoice => ({
//               id: `inv_${invoice.invoiceId}`,
//               type: 'INVOICE',
//               amount: invoice.finalAmount || invoice.totalAmount,
//               description: `Hóa đơn #${invoice.invoiceNumber}`,
//               date: invoice.createdAt,
//               status: invoice.status,
//               invoiceId: invoice.invoiceId
//             }));

//             const payments = (paymentsResponse?.content || []).map(payment => ({
//               id: `pay_${payment.paymentId}`,
//               type: 'PAYMENT',
//               amount: payment.amount,
//               description: `Thanh toán - ${payment.method}`,
//               date: payment.paidAt || payment.createdAt,
//               status: payment.status,
//               paymentId: payment.paymentId,
//               pointsEarned: Math.floor(payment.amount / 100000)
//             }));

//             data = [...invoices, ...payments].sort((a, b) =>
//               new Date(b.date) - new Date(a.date)
//             );
//           } catch (err) {
//             console.error('Error loading financial data:', err);
//             data = [];
//           }
//           break;

//         case 'photos':
//           // TODO: Implement photos loading
//           data = [
//             {
//               id: 1,
//               type: 'BEFORE',
//               url: '/api/photos/1',
//               description: 'Ảnh trước khi phun',
//               uploadedAt: '2024-01-10'
//             }
//           ];
//           break;
//       }

//       setTabData(prev => ({
//         ...prev,
//         [tab]: data
//       }));
//     } catch (err) {
//       console.error(`Error loading ${tab} data:`, err);
//     } finally {
//       setTabLoading(prev => ({ ...prev, [tab]: false }));
//     }
//   };

//   const handleCreateCase = () => {
//     setShowCaseCreationModal(true);
//   };

//   const handleCreateInvoice = () => {
//     setShowInvoiceCreationModal(true);
//   };

//   const handleCloseCaseCreationModal = () => {
//     setShowCaseCreationModal(false);
//   };

//   const handleCloseInvoiceCreationModal = () => {
//     setShowInvoiceCreationModal(false);
//   };

//   const handleCaseCreated = (newCase) => {
//     console.log('New case created:', newCase);
//     loadTabData('treatments');
//     setShowCaseCreationModal(false);
//   };

//   const handleInvoiceCreated = (newInvoice) => {
//     console.log('New invoice created:', newInvoice);
//     loadTabData('financial');
//     setShowInvoiceCreationModal(false);
//   };

//   const handleBackToList = () => {
//     navigate('/customers');
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND'
//     }).format(amount);
//   };

//   const getStatusBadge = (type, status) => {
//     if (type === 'INVOICE') {
//       const statusMap = {
//         'DRAFT': 'status-draft',
//         'UNPAID': 'status-unpaid',
//         'PAID': 'status-paid',
//         'OVERDUE': 'status-overdue',
//         'CANCELLED': 'status-cancelled'
//       };
//       return (
//         <span className={`status-badge ${statusMap[status] || 'status-default'}`}>
//           {status === 'PAID' ? 'Đã thanh toán' :
//            status === 'UNPAID' ? 'Chưa thanh toán' :
//            status === 'DRAFT' ? 'Nháp' :
//            status === 'OVERDUE' ? 'Quá hạn' :
//            status === 'CANCELLED' ? 'Đã hủy' : status}
//         </span>
//       );
//     } else {
//       return (
//         <span className="status-badge status-payment">
//           Đã thanh toán
//         </span>
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <div className="customer-profile">
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>Đang tải thông tin khách hàng...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="customer-profile">
//         <div className="error-container">
//           <div className="error-icon">⚠️</div>
//           <p>{error}</p>
//           <div className="error-actions">
//             <button className="btn btn-secondary" onClick={handleBackToList}>
//               Quay lại danh sách
//             </button>
//             <button className="btn btn-primary" onClick={loadCustomerData}>
//               Thử lại
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!customer) {
//     return (
//       <div className="customer-profile">
//         <div className="error-container">
//           <div className="error-icon">👤</div>
//           <p>Không tìm thấy khách hàng</p>
//           <button className="btn btn-primary" onClick={handleBackToList}>
//             Quay lại danh sách
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="customer-profile">
//       {/* Header */}
//       <div className="profile-header">
//         <div className="header-actions">
//           <button className="btn btn-secondary back-btn" onClick={handleBackToList}>
//             ← Quay lại
//           </button>
//         </div>

//         <div className="customer-header">
//           <div className="customer-avatar">
//             <span className="avatar-icon">👤</span>
//           </div>

//           <div className="customer-info">
//             <div className="customer-name-row">
//               <h1>{customer.fullName}</h1>
//               {customer.isVip && <span className="vip-badge">👑 VIP</span>}
//             </div>

//             <div className="customer-details">
//               <div className="detail-item">
//                 <span className="label">📞 Điện thoại:</span>
//                 <span className="value">{customer.phone}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="label">📧 Email:</span>
//                 <span className="value">{customer.email || 'Chưa có'}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="label">🏷️ Tier:</span>
//                 <span className="value">{customer.tierName || 'Chưa có'}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="label">💰 Chi tiêu:</span>
//                 <span className="value">{formatCurrency(customer.totalSpent || 0)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="quick-actions">
//           {(userRole === 'ADMIN' || userRole === 'RECEPTIONIST') && (
//             <>
//               <button className="btn btn-primary" onClick={handleCreateCase}>
//                 ➕ Tạo hồ sơ
//               </button>
//               <button className="btn btn-success" onClick={handleCreateInvoice}>
//                 💰 Tạo hóa đơn
//               </button>
//               <button className="btn btn-secondary">
//                 ✏️ Chỉnh sửa
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="profile-nav">
//         <button
//           className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
//           onClick={() => setActiveTab('overview')}
//         >
//           📊 Tổng quan
//         </button>
//         <button
//           className={`nav-tab ${activeTab === 'treatments' ? 'active' : ''}`}
//           onClick={() => setActiveTab('treatments')}
//         >
//           💉 Lịch sử điều trị
//         </button>
//         <button
//           className={`nav-tab ${activeTab === 'appointments' ? 'active' : ''}`}
//           onClick={() => setActiveTab('appointments')}
//         >
//           📅 Lịch hẹn
//         </button>
//         <button
//           className={`nav-tab ${activeTab === 'financial' ? 'active' : ''}`}
//           onClick={() => setActiveTab('financial')}
//         >
//           💳 Tài chính
//         </button>
//         <button
//           className={`nav-tab ${activeTab === 'photos' ? 'active' : ''}`}
//           onClick={() => setActiveTab('photos')}
//         >
//           📸 Ảnh
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div className="profile-content">
//         {activeTab === 'overview' && (
//           <div className="overview-tab">
//             <div className="overview-grid">
//               {/* Personal Information */}
//               <div className="info-card">
//                 <h3>👤 Thông tin cá nhân</h3>
//                 <div className="info-grid">
//                   <div className="info-item">
//                     <label>Họ tên:</label>
//                     <span>{customer.fullName}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Ngày sinh:</label>
//                     <span>{customer.dob ? formatDateTimeVN(customer.dob) : 'Chưa có'}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Giới tính:</label>
//                     <span>{customer.gender || 'Chưa có'}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Địa chỉ:</label>
//                     <span>{customer.address || 'Chưa có'}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Ghi chú:</label>
//                     <span>{customer.notes || 'Không có'}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Statistics */}
//               <div className="info-card">
//                 <h3>📈 Thống kê</h3>
//                 <div className="stats-grid">
//                   <div className="stat-item">
//                     <div className="stat-number">{customer.totalPoints || 0}</div>
//                     <div className="stat-label">Điểm tích lũy</div>
//                   </div>
//                   <div className="stat-item">
//                     <div className="stat-number">{formatCurrency(customer.totalSpent || 0)}</div>
//                     <div className="stat-label">Tổng chi tiêu</div>
//                   </div>
//                   <div className="stat-item">
//                     <div className="stat-number">{tabData.treatments.length}</div>
//                     <div className="stat-label">Hồ sơ điều trị</div>
//                   </div>
//                   <div className="stat-item">
//                     <div className="stat-number">
//                       {tabData.financial.filter(item => item.type === 'PAYMENT').length}
//                     </div>
//                     <div className="stat-label">Lần thanh toán</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'treatments' && (
//           <div className="treatments-tab">
//             <div className="tab-header">
//               <h3>Lịch sử điều trị</h3>
//               <button className="btn btn-primary" onClick={handleCreateCase}>
//                 ➕ Tạo hồ sơ mới
//               </button>
//             </div>

//             {tabLoading.treatments ? (
//               <div className="tab-loading">Đang tải...</div>
//             ) : (
//               <div className="treatments-list">
//                 {tabData.treatments.length === 0 ? (
//                   <div className="no-data">
//                     <div className="no-data-icon">💉</div>
//                     <p>Chưa có hồ sơ điều trị nào</p>
//                     <button className="btn btn-primary" onClick={handleCreateCase}>
//                       Tạo hồ sơ đầu tiên
//                     </button>
//                   </div>
//                 ) : (
//                   tabData.treatments.map(treatment => (
//                     <div key={treatment.caseId} className="treatment-card">
//                       <div className="treatment-header">
//                         <h4>{treatment.serviceName}</h4>
//                         <span className={`status-badge ${CASE_STATUS_MAP[treatment.status]?.className || 'status-default'}`}>
//                           {CASE_STATUS_MAP[treatment.status]?.label || treatment.status}
//                         </span>
//                       </div>
//                       <div className="treatment-details">
//                         <p><strong>Ngày bắt đầu:</strong> {formatDateTimeVN(treatment.startDate)}</p>
//                         <p><strong>Ngày kết thúc:</strong> {treatment.endDate ? formatDateTimeVN(treatment.endDate) : 'Chưa có'}</p>
//                         <p><strong>Ghi chú:</strong> {treatment.notes || 'Không có'}</p>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === 'financial' && (
//           <div className="financial-tab">
//             <div className="tab-header">
//               <h3>Lịch sử giao dịch</h3>
//               <button className="btn btn-primary" onClick={handleCreateInvoice}>
//                 ➕ Tạo hóa đơn
//               </button>
//             </div>

//             {tabLoading.financial ? (
//               <div className="tab-loading">Đang tải...</div>
//             ) : (
//               <div className="financial-list">
//                 {tabData.financial.length === 0 ? (
//                   <div className="no-data">
//                     <div className="no-data-icon">💰</div>
//                     <p>Chưa có giao dịch nào</p>
//                     <button className="btn btn-primary" onClick={handleCreateInvoice}>
//                       Tạo hóa đơn đầu tiên
//                     </button>
//                   </div>
//                 ) : (
//                   tabData.financial.map(transaction => (
//                     <div key={transaction.id} className="transaction-card">
//                       <div className="transaction-info">
//                         <div className="transaction-header">
//                           <span className="transaction-icon">
//                             {transaction.type === 'INVOICE' ? '📄' : '💳'}
//                           </span>
//                           <h4>{transaction.description}</h4>
//                           {getStatusBadge(transaction.type, transaction.status)}
//                         </div>
//                         <p><strong>Ngày:</strong> {formatDateTimeVN(transaction.date)}</p>
//                         {transaction.pointsEarned && (
//                           <p><strong>Điểm được:</strong> +{transaction.pointsEarned} điểm</p>
//                         )}
//                       </div>
//                       <div className={`transaction-amount ${transaction.type === 'INVOICE' ? 'invoice-amount' : 'payment-amount'}`}>
//                         {transaction.type === 'INVOICE' ? '-' : '+'}{formatCurrency(transaction.amount)}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === 'appointments' && (
//           <div className="appointments-tab">
//             <div className="tab-header">
//               <h3>Lịch hẹn</h3>
//               <button className="btn btn-primary">📅 Tạo lịch hẹn</button>
//             </div>

//             {tabLoading.appointments ? (
//               <div className="tab-loading">Đang tải...</div>
//             ) : (
//               <div className="appointments-list">
//                 {tabData.appointments.length === 0 ? (
//                   <div className="no-data">
//                     <div className="no-data-icon">📅</div>
//                     <p>Chưa có lịch hẹn nào</p>
//                     <button className="btn btn-primary">Tạo lịch hẹn đầu tiên</button>
//                   </div>
//                 ) : (
//                   tabData.appointments.map(appointment => (
//                     <div key={appointment.id} className="appointment-card">
//                       <div className="appointment-header">
//                         <h4>{appointment.serviceName}</h4>
//                         <span className="technician">{appointment.technician}</span>
//                       </div>
//                       <div className="appointment-details">
//                         <p><strong>Ngày:</strong> {formatDateTimeVN(appointment.date)}</p>
//                         <p><strong>Giờ:</strong> {appointment.time}</p>
//                         <p><strong>Ghi chú:</strong> {appointment.notes}</p>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === 'photos' && (
//           <div className="photos-tab">
//             <div className="tab-header">
//               <h3>Thư viện ảnh</h3>
//               <button className="btn btn-primary">📸 Upload ảnh</button>
//             </div>

//             {tabLoading.photos ? (
//               <div className="tab-loading">Đang tải...</div>
//             ) : (
//               <div className="photos-gallery">
//                 {tabData.photos.length === 0 ? (
//                   <div className="no-data">
//                     <div className="no-data-icon">📸</div>
//                     <p>Chưa có ảnh nào</p>
//                     <button className="btn btn-primary">Upload ảnh đầu tiên</button>
//                   </div>
//                 ) : (
//                   tabData.photos.map(photo => (
//                     <div key={photo.id} className="photo-card">
//                       <img src={photo.url} alt={photo.description} />
//                       <div className="photo-info">
//                         <p>{photo.description}</p>
//                         <small>{formatDateTimeVN(photo.uploadedAt)}</small>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       <CustomerCaseCreationModal
//         isOpen={showCaseCreationModal}
//         onClose={handleCloseCaseCreationModal}
//         onCaseCreated={handleCaseCreated}
//         customerId={customerId}
//         customerName={customer.fullName}
//       />

//       <InvoiceCreationModal
//         isOpen={showInvoiceCreationModal}
//         onClose={handleCloseInvoiceCreationModal}
//         onInvoiceCreated={handleInvoiceCreated}
//         customerId={customerId}
//         customerName={customer.fullName}
//       />
//     </div>
//   );
// };

// export default CustomerProfile;
