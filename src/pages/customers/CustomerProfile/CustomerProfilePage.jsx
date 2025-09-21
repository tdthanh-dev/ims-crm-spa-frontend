// filepath: src/pages/customers/CustomerProfile/CustomerProfilePage.jsx
import React, { useMemo, useState, useCallback } from "react";
import useCustomerProfile, { formatCurrency, formatDateTimeVN, getStatusBadge } from "@/hooks/useCustomerProfile";
import photosApi from "@/services/photosApi";

// Import các component đã tách
import CustomerHeader from "./CustomerHeader";
import CustomerTabs from "./CustomerTabs";
import OverviewPanel from "./panels/OverviewPanel";
import TreatmentsPanel from "./panels/TreatmentsPanel";
import AppointmentsPanel from "./panels/AppointmentsPanel";
import FinancialPanel from "./panels/FinancialPanel";
import PhotosPanel from "./panels/PhotosPanel";

import CustomerCaseCreationModal from "@/components/Customer/CustomerCaseCreationModal";
import InvoiceCreationModal from "@/components/Billing/InvoiceCreationModal";
import UploadPhotosModal from "./modals/UploadPhotosModal";
import CreateAppointmentModal from "@/components/Appointment/CreateAppointmentModal";
import AppointmentDetailModal from "@/components/Appointment/AppointmentDetailModal";

export default function CustomerProfilePage({ userRole, customerId: customerIdProp }) {
  const {
    customer,
    loading,
    error,
    activeTab,
    showCaseCreationModal,
    showInvoiceCreationModal,
    selectedCaseForInvoice,
    setSelectedCaseForInvoice,
    tabData,
    tabLoading,
    setActiveTab,
    setShowCaseCreationModal,
    setShowInvoiceCreationModal,
    handleCloseInvoiceCreationModal,
    handleBackToList,
    loadCustomerData,
    customerId,
  } = useCustomerProfile(userRole, customerIdProp);

  // ✅ Thêm state để quản lý panel ảnh
  const [showPhotosPanel, setShowPhotosPanel] = useState(false);
  const [selectedCaseForPhotos, setSelectedCaseForPhotos] = useState(null);

  // ✅ State quản lý upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadNote, setUploadNote] = useState('');
  const [uploadType, setUploadType] = useState('BEFORE');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // ✅ State quản lý appointment creation modal
  const [showAppointmentCreationModal, setShowAppointmentCreationModal] = useState(false);

  // ✅ State quản lý appointment detail modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const normalizedTreatments = useMemo(
    () =>
      (tabData.treatments || []).map((t) => ({
        id: t.caseId || t.id,
        caseId: t.caseId, // ✅ giữ nguyên caseId để truyền cho InvoiceCreationModal
        serviceName: t.primaryServiceName || t.serviceName,
        status: t.status,
        paidStatus: t.paidStatus,
        startDate: t.startDate || t.createdAt,
        endDate: t.endDate,
        intakeNote: t.intakeNote || t.notes,
        totalCost: t.totalAmount, // API returns totalAmount, not totalCost
        totalAmount: t.totalAmount, // Direct from API
        amountPaid: t.amountPaid || 0,
        remainingAmount:
          t.paidStatus === "FULLY_PAID"
            ? 0
            : t.paidStatus === "UNPAID"
            ? t.totalAmount || 0
            : t.paidStatus === "PARTIALLY_PAID"
            ? t.totalAmount || 0
            : t.totalAmount || 0,
      })),
    [tabData.treatments]
  );

  const stats = useMemo(
    () => ({
      treatmentsCount: normalizedTreatments.length,
      paymentsCount: (tabData.financial || []).filter((i) => i.type === "PAYMENT").length,
    }),
    [normalizedTreatments.length, tabData.financial]
  );

  // ✅ Hàm xử lý mở panel ảnh
  const handleOpenCasePhotos = (caseData) => {
    setSelectedCaseForPhotos(caseData);
    setShowPhotosPanel(true);
  };

  // ✅ Hàm quay lại panel treatments
  const handleBackToTreatments = () => {
    setShowPhotosPanel(false);
    setSelectedCaseForPhotos(null);
  };

  // ✅ Handlers cho appointment creation modal
  const handleOpenAppointmentCreationModal = () => {
    setShowAppointmentCreationModal(true);
  };

  const handleCloseAppointmentCreationModal = () => {
    setShowAppointmentCreationModal(false);
  };

  const handleAppointmentCreated = () => {
    setShowAppointmentCreationModal(false);
    // Refresh appointment data
    if (loadCustomerData) {
      loadCustomerData(customerId);
    }
  };

  // ✅ Handlers cho appointment detail modal
  const handleViewAppointmentDetail = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseAppointmentDetail = () => {
    setSelectedAppointment(null);
  };

  const handleAppointmentUpdated = () => {
    setSelectedAppointment(null);
    // Refresh appointment data
    if (loadCustomerData) {
      loadCustomerData(customerId);
    }
  };

  // ✅ Handlers cho upload photos modal
  const handleOpenUploadModal = useCallback(() => {
    setShowUploadModal(true);
    setUploadFiles([]);
    setUploadNote('');
    setUploadType('BEFORE');
    setUploadError('');
  }, []);

  const handleCloseUploadModal = useCallback(() => {
    setShowUploadModal(false);
    setUploadFiles([]);
    setUploadNote('');
    setUploadType('BEFORE');
    setUploadError('');
    setUploading(false);
  }, []);

  const handleSelectFiles = useCallback((event) => {
    const files = Array.from(event.target.files);
    setUploadError('');

    // Validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      if (file.size > maxSize) {
        errors.push(`${file.name} quá lớn (tối đa 10MB)`);
      } else if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} không phải định dạng ảnh hợp lệ`);
      } else {
        validFiles.push(file);
      }
    });

    setUploadFiles(validFiles);

    if (errors.length > 0) {
      setUploadError(errors.join('. '));
    }
  }, []);

  const handleChangeUploadNote = useCallback((note) => {
    setUploadNote(note);
  }, []);

  const handleRemoveFile = useCallback((indexToRemove) => {
    setUploadFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleChangeUploadType = useCallback((type) => {
    setUploadType(type);
  }, []);

  const handleSubmitUpload = useCallback(async () => {
    if (!uploadFiles.length || !selectedCaseForPhotos) return;

    setUploading(true);
    setUploadError('');

    try {
      // Gọi API upload
      const uploadedPhotos = await photosApi.uploadPhotos(
        selectedCaseForPhotos.caseId || selectedCaseForPhotos.id,
        uploadFiles,
        uploadNote,
        uploadType // Sử dụng type đã chọn
      );

      // Đóng modal và refresh dữ liệu
      handleCloseUploadModal();

      // Refresh customer data để cập nhật photos
      if (loadCustomerData) {
        loadCustomerData(customerId);
      }

      console.log('Upload thành công:', uploadedPhotos);
    } catch (error) {
      console.error('Upload thất bại:', error);
      setUploadError(
        error.response?.data?.message ||
        error.message ||
        'Có lỗi xảy ra khi upload ảnh. Vui lòng thử lại.'
      );
    } finally {
      setUploading(false);
    }
  }, [uploadFiles, selectedCaseForPhotos, uploadNote, uploadType, handleCloseUploadModal, loadCustomerData, customerId]);

  if (loading) return <div className="p-6 text-gray-500">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!customer) return <div className="p-6 text-gray-600">Không tìm thấy khách hàng</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomerHeader
        userRole={userRole}
        customer={customer}
        onBack={handleBackToList}
        onCreateCase={() => setShowCaseCreationModal(true)}
        onCreateInvoice={() => setShowInvoiceCreationModal(true)}
        formatCurrency={formatCurrency}
      />

      {/* Tabs */}
      <CustomerTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Nội dung */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* ✅ Hiển thị PhotosPanel khi showPhotosPanel = true */}
        {showPhotosPanel && selectedCaseForPhotos ? (
          <PhotosPanel
            loading={false}
            caseInfo={{
              caseId: selectedCaseForPhotos.caseId || selectedCaseForPhotos.id,
              serviceName: selectedCaseForPhotos.serviceName,
              status: selectedCaseForPhotos.status,
              startDate: selectedCaseForPhotos.startDate,
              endDate: selectedCaseForPhotos.endDate,
              intakeNote: selectedCaseForPhotos.intakeNote,
              notes: selectedCaseForPhotos.notes, // ✅ Thêm trường notes
              totalAmount: selectedCaseForPhotos.totalAmount, // ✅ Thêm thông tin tài chính
              paidStatus: selectedCaseForPhotos.paidStatus, // ✅ Thêm trạng thái thanh toán
            }}
            // ✅ Bỏ photos={[]} để component tự gọi API
            onBack={handleBackToTreatments}
            onOpenUpload={handleOpenUploadModal}
            onDeletePhoto={(id) => console.log("Xóa ảnh", id)}
            formatDateTimeVN={formatDateTimeVN}
          />
        ) : (
          <>
            {activeTab === "overview" && (
              <OverviewPanel
                customer={customer}
                stats={stats}
                formatDateTimeVN={formatDateTimeVN}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === "treatments" && (
              <TreatmentsPanel
                loading={tabLoading.treatments}
                treatments={normalizedTreatments}
                onCreateCase={() => setShowCaseCreationModal(true)}
                onCreateInvoiceForCase={(c) => {
                  setSelectedCaseForInvoice(c);
                  setShowInvoiceCreationModal(true);
                }}
                onViewCaseDetail={(c) => console.log("Chi tiết:", c)}
                onOpenCasePhotos={handleOpenCasePhotos} // ✅ Truyền callback
                formatDateTimeVN={formatDateTimeVN}
              />
            )}

            {activeTab === "appointments" && (
              <AppointmentsPanel
                loading={tabLoading.appointments}
                appointments={tabData.appointments || []}
                formatDateTimeVN={formatDateTimeVN}
                getStatusBadge={getStatusBadge}
                onCreate={handleOpenAppointmentCreationModal}
                onViewDetail={handleViewAppointmentDetail}
              />
            )}

            {activeTab === "financial" && (
              <FinancialPanel
                loading={tabLoading.financial}
                items={tabData.financial || []}
                onCreateInvoice={() => setShowInvoiceCreationModal(true)}
                formatDateTimeVN={formatDateTimeVN}
                formatCurrency={formatCurrency}
                getStatusBadge={getStatusBadge}
              />
            )}

            {activeTab === "photos" && (
              <PhotosPanel
                loading={tabLoading.photos}
                photos={tabData.photos || []}
                onOpenUpload={() => console.log("Upload modal")}
                onDeletePhoto={(id) => console.log("Xóa ảnh", id)}
                formatDateTimeVN={formatDateTimeVN}
              />
            )}
          </>
        )}
      </div>

      {/* Modal tạo hồ sơ */}
      {showCaseCreationModal && (
        <CustomerCaseCreationModal
          isOpen={showCaseCreationModal}
          onClose={() => setShowCaseCreationModal(false)}
          onCaseCreated={() => loadCustomerData(customerId)}
          customerId={customerId}
          customerName={customer?.fullName || ""}
        />
      )}

      {/* Modal tạo hóa đơn */}
      {showInvoiceCreationModal && (
        <InvoiceCreationModal
          isOpen={showInvoiceCreationModal}
          onClose={handleCloseInvoiceCreationModal}
          onInvoiceCreated={() => loadCustomerData(customerId)}
          customerId={customerId}
          customerName={customer?.fullName || ""}
          selectedCase={selectedCaseForInvoice}
        />
      )}

      {/* Modal tạo lịch hẹn */}
      {showAppointmentCreationModal && (
        <CreateAppointmentModal
          isOpen={showAppointmentCreationModal}
          onClose={handleCloseAppointmentCreationModal}
          onAppointmentCreated={handleAppointmentCreated}
          context={{
            customerId: customerId,
            customerName: customer?.fullName || "",
            customerPhone: customer?.phone || ""
          }}
        />
      )}

      {/* Modal chi tiết lịch hẹn */}
      <AppointmentDetailModal
        isOpen={!!selectedAppointment}
        onClose={handleCloseAppointmentDetail}
        appointment={selectedAppointment}
        onUpdated={handleAppointmentUpdated}
      />

      {/* Modal upload ảnh */}
      <UploadPhotosModal
        isOpen={showUploadModal}
        files={uploadFiles}
        note={uploadNote}
        uploadType={uploadType}
        uploading={uploading}
        error={uploadError}
        onClose={handleCloseUploadModal}
        onSelectFiles={handleSelectFiles}
        onSubmit={handleSubmitUpload}
        onChangeNote={handleChangeUploadNote}
        onRemoveFile={handleRemoveFile}
        onChangeUploadType={handleChangeUploadType}
      />
    </div>
  );
}
