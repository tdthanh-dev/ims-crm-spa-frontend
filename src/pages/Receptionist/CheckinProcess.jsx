import React, { useState, useEffect } from 'react';
import { appointmentsApi } from '@/services';
import { formatDateTimeVN } from '@/utils/dateUtils';


const CheckinProcess = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTodayAppointments();
  }, []);

  const loadTodayAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsApi.getAll();

      let appointments = [];
      if (response?.content && Array.isArray(response.content)) {
        appointments = response.content;
      } else if (Array.isArray(response)) {
        appointments = response;
      }

      // Filter appointments for today
      const today = new Date().toDateString();
      appointments = appointments.filter(apt => {
        if (!apt.appointmentDateTime) return false;
        return new Date(apt.appointmentDateTime).toDateString() === today;
      });

      setTodayAppointments(appointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await appointmentsApi.updateStatus(appointmentId, { status: newStatus });
      await loadTodayAppointments(); // Refresh data

      if (selectedAppointment && selectedAppointment.id === appointmentId) {
        setSelectedAppointment(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Có lỗi khi cập nhật trạng thái');
    }
  };

  const handleCallCustomer = (phone) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const handleSendSMS = (phone) => {
    if (phone) {
      // In real app, integrate with SMS service
      alert(`Gửi SMS nhắc nhở đến: ${phone}`);
    }
  };

  const filteredAppointments = todayAppointments.filter(apt => {
    if (!searchTerm) return true;
    return apt.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone?.includes(searchTerm);
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      'SCHEDULED': { class: 'scheduled', label: 'Đã đặt' },
      'CONFIRMED': { class: 'confirmed', label: 'Xác nhận' },
      'CHECKED_IN': { class: 'checked-in', label: 'Đã check-in' },
      'IN_PROGRESS': { class: 'in-progress', label: 'Đang thực hiện' },
      'COMPLETED': { class: 'completed', label: 'Hoàn thành' },
      'NO_SHOW': { class: 'no-show', label: 'Không đến' },
      'CANCELLED': { class: 'cancelled', label: 'Đã hủy' }
    };
    return statusMap[status] || statusMap.SCHEDULED;
  };

  if (loading) {
    return (
      <div className="checkin-process">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách check-in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkin-process">
      <div className="header">
        <h1>✅ Check-in Process</h1>
        <p>Quản lý check-in khách hàng và cập nhật trạng thái lịch hẹn</p>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách hàng hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{todayAppointments.length}</div>
          <div className="stat-label">Tổng lịch hẹn</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {todayAppointments.filter(apt => apt.status === 'CHECKED_IN').length}
          </div>
          <div className="stat-label">Đã check-in</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {todayAppointments.filter(apt => apt.status === 'IN_PROGRESS').length}
          </div>
          <div className="stat-label">Đang thực hiện</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {todayAppointments.filter(apt => apt.status === 'COMPLETED').length}
          </div>
          <div className="stat-label">Hoàn thành</div>
        </div>
      </div>

      <div className="checkin-content">
        {/* Appointments List */}
        <div className="appointments-section">
          <h2>Danh sách lịch hẹn hôm nay ({filteredAppointments.length})</h2>

          <div className="appointments-list">
            {filteredAppointments.length === 0 ? (
              <div className="no-appointments">
                <div className="no-data-icon">📅</div>
                <p>Không tìm thấy lịch hẹn nào</p>
              </div>
            ) : (
              filteredAppointments.map(appointment => {
                const statusInfo = getStatusBadge(appointment.status);
                return (
                  <div
                    key={appointment.id}
                    className={`appointment-card ${appointment.status === 'CHECKED_IN' ? 'checked-in' : ''}`}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="appointment-time">
                      {appointment.formattedTime || formatDateTimeVN(appointment.startAt)}
                    </div>

                    <div className="appointment-info">
                      <div className="customer-name">{appointment.customerName}</div>
                      <div className="service-name">{appointment.serviceName}</div>
                      <div className="technician-name">
                        Kỹ thuật viên: {appointment.technicianName || 'Chưa phân công'}
                      </div>
                    </div>

                    <div className="appointment-status">
                      <span className={`status-badge ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="appointment-actions">
                      {appointment.status === 'SCHEDULED' && (
                        <button
                          className="action-btn confirm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(appointment.id, 'CONFIRMED');
                          }}
                        >
                          ✓ Xác nhận
                        </button>
                      )}

                      {(appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED') && (
                        <button
                          className="action-btn checkin"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(appointment.id, 'CHECKED_IN');
                          }}
                        >
                          ✅ Check-in
                        </button>
                      )}

                      <button
                        className="action-btn call"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCallCustomer(appointment.phone);
                        }}
                      >
                        📞 Gọi
                      </button>

                      <button
                        className="action-btn sms"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendSMS(appointment.phone);
                        }}
                      >
                        💬 SMS
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Appointment Details */}
        {selectedAppointment && (
          <div className="appointment-details">
            <h3>Chi tiết lịch hẹn</h3>

            <div className="details-card">
              <div className="detail-row">
                <label>Khách hàng:</label>
                <span>{selectedAppointment.customerName}</span>
              </div>

              <div className="detail-row">
                <label>Số điện thoại:</label>
                <span>{selectedAppointment.phone}</span>
              </div>

              <div className="detail-row">
                <label>Dịch vụ:</label>
                <span>{selectedAppointment.serviceName}</span>
              </div>

              <div className="detail-row">
                <label>Kỹ thuật viên:</label>
                <span>{selectedAppointment.technicianName || 'Chưa phân công'}</span>
              </div>

              <div className="detail-row">
                <label>Thời gian:</label>
                <span>{selectedAppointment.formattedTime || formatDateTimeVN(selectedAppointment.appointmentDateTime)}</span>
              </div>

              <div className="detail-row">
                <label>Ghi chú:</label>
                <span>{selectedAppointment.notes || 'Không có ghi chú'}</span>
              </div>

              <div className="detail-row">
                <label>Trạng thái:</label>
                <span className={`status-badge ${getStatusBadge(selectedAppointment.status).class}`}>
                  {getStatusBadge(selectedAppointment.status).label}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h4>Thao tác nhanh:</h4>
                <div className="action-buttons">
                  {selectedAppointment.status === 'CHECKED_IN' && (
                    <button
                      className="action-btn primary"
                      onClick={() => handleStatusUpdate(selectedAppointment.id, 'IN_PROGRESS')}
                    >
                      ▶️ Bắt đầu điều trị
                    </button>
                  )}

                  <button
                    className="action-btn secondary"
                    onClick={() => handleCallCustomer(selectedAppointment.phone)}
                  >
                    📞 Gọi khách hàng
                  </button>

                  <button
                    className="action-btn neutral"
                    onClick={() => setSelectedAppointment(null)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckinProcess;
