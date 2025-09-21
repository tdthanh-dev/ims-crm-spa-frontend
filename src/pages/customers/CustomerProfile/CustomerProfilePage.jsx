// filepath: src/pages/customers/CustomerProfile/CustomerProfilePage.jsx
import React, { useMemo, useState } from "react";
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

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
            }}
            // ✅ Bỏ photos={[]} để component tự gọi API
            onBack={handleBackToTreatments}
            onOpenUpload={() => console.log("Upload modal")}
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
    </div>
  );
}
