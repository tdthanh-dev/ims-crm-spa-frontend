// filepath: admin-spa-management/src/pages/dashboards/TechnicianDashboard.jsx

import React from 'react';
import { formatDateTimeVN } from '@/utils/dateUtils';
import { useTechnicianDashboard } from '@/hooks/useTechnicianDashboard';
import { useNavigate } from 'react-router-dom';

/**
 * Technician Dashboard Component
 * UI component for technician dashboard - logic separated to custom hook
 * Styled with Tailwind CSS for modern, responsive design
 */
const TechnicianDashboard = ({ user }) => {
  const navigate = useNavigate();

  // Use custom hook for all business logic
  const {
    data,
    fetchDashboardData,
    handleUpdateAppointmentStatus,
    getStatusStyle,
    nextAppointment,
    performanceStats,
    recentWork,
    hasCurrentTreatment,
    hasTodayAppointments,
    hasMyAppointments
  } = useTechnicianDashboard(user);

  if (data.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6">
      {/* Enhanced Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white text-3xl mb-4 shadow-lg">
          🎨
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Dashboard Kỹ Thuật Viên
        </h1>
        <p className="text-gray-600 text-lg">Quản lý lịch hẹn và quy trình điều trị một cách chuyên nghiệp</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Enhanced Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center border-l-4 border-blue-500 transform hover:scale-105">
          <div className="text-4xl mb-3">📅</div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{performanceStats.todayTotal}</div>
          <div className="text-sm text-gray-600 font-medium">Lịch hẹn hôm nay</div>
          <div className="mt-2 text-xs text-blue-500">
            {performanceStats.todayTotal > 0 ? `${Math.round((performanceStats.todayCompleted/performanceStats.todayTotal)*100)}% hoàn thành` : 'Chưa có lịch'}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center border-l-4 border-green-500 transform hover:scale-105">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-3xl font-bold text-green-600 mb-2">{performanceStats.todayCompleted}</div>
          <div className="text-sm text-gray-600 font-medium">Đã hoàn thành</div>
          <div className="mt-2 text-xs text-green-500">
            {performanceStats.todayCompleted > 0 ? 'Xuất sắc!' : 'Hãy bắt đầu!'}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center border-l-4 border-purple-500 transform hover:scale-105">
          <div className="text-4xl mb-3">🩺</div>
          <div className="text-3xl font-bold text-purple-600 mb-2">{performanceStats.currentTreatment}</div>
          <div className="text-sm text-gray-600 font-medium">Đang điều trị</div>
          <div className="mt-2 text-xs text-purple-500">
            {performanceStats.currentTreatment > 0 ? 'Đang thực hiện' : 'Sẵn sàng'}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center border-l-4 border-indigo-500 transform hover:scale-105">
          <div className="text-4xl mb-3">🏆</div>
          <div className="text-3xl font-bold text-indigo-600 mb-2">{performanceStats.totalAppointments}</div>
          <div className="text-sm text-gray-600 font-medium">Tổng lịch hẹn</div>
          <div className="mt-2 text-xs text-indigo-500">
            {performanceStats.completionRate}% tỷ lệ hoàn thành
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Current Treatment - Enhanced */}
        {hasCurrentTreatment && (
          <div className="lg:col-span-2 xl:col-span-1 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl border border-purple-200 p-6 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full opacity-10"></div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white mr-3">
                🩺
              </div>
              Đang điều trị
            </h2>

            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl p-5 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{data.currentTreatment.customerName}</h3>
                  <p className="text-purple-700 font-medium">{data.currentTreatment.serviceName}</p>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <span className="mr-3">🕐 {data.currentTreatment.formattedTime}</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      Đang thực hiện
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={() => handleUpdateAppointmentStatus(data.currentTreatment.id, 'COMPLETED')}
                >
                  <span className="mr-2">✅</span>
                  Hoàn thành
                </button>
                <button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span className="mr-2">⏸️</span>
                  Tạm dừng
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-600">Thời gian thực hiện</p>
                <p className="text-lg font-bold text-blue-600">45 phút</p>
              </div>
            </div>
          </div>
        )}

        {/* Today's Schedule - Enhanced */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-3">
                📅
              </div>
              Lịch hẹn hôm nay
              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {data.todayAppointments.length}
              </span>
            </h2>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {!hasTodayAppointments ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📅</span>
                </div>
                <p className="text-gray-500 text-lg font-medium">Không có lịch hẹn nào hôm nay</p>
                <p className="text-gray-400 text-sm mt-2">Hãy nghỉ ngơi hoặc chuẩn bị cho ngày mai!</p>
              </div>
            ) : (
              data.todayAppointments.map((appointment, index) => {
                const statusStyle = getStatusStyle(appointment.status);
                const isNext = index === 0 && ['CONFIRMED', 'CHECKED_IN'].includes(appointment.status);
                
                return (
                  <div 
                    key={appointment.id} 
                    className={`border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-lg ${
                      isNext 
                        ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full mr-3">
                            🕐 {appointment.formattedTime}
                          </span>
                          {isNext && (
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full animate-pulse">
                              TIẾP THEO
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-gray-900 text-lg">{appointment.customerName}</div>
                        <div className="text-blue-600 font-medium">{appointment.serviceName}</div>
                        {appointment.customerNotes && (
                          <div className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded-lg border-l-4 border-blue-300">
                            💬 {appointment.customerNotes}
                          </div>
                        )}
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <span className="mr-4">⏱️ 60 phút</span>
                          <span>👤 Kỹ thuật viên</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <span 
                          className="inline-flex px-3 py-1 rounded-full text-xs font-medium mb-3 shadow-sm"
                          style={{ backgroundColor: statusStyle.background, color: statusStyle.color }}
                        >
                          {statusStyle.label}
                        </span>
                        {(appointment.status === 'CONFIRMED' || appointment.status === 'CHECKED_IN') && (
                          <button
                            className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'IN_PROGRESS')}
                          >
                            <span className="mr-2">▶️</span>
                            {appointment.status === 'CHECKED_IN' ? 'Bắt đầu điều trị' : 'Bắt đầu'}
                          </button>
                        )}
                        {appointment.status === 'COMPLETED' && (
                          <button className="block w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium">
                            <span className="mr-2">👁️</span>
                            Xem chi tiết
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Next Appointment - Enhanced */}
        {nextAppointment && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl border border-amber-200 p-6 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full opacity-10"></div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center text-white mr-3">
                ⏭️
              </div>
              Lịch hẹn tiếp theo
            </h2>
            
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl p-5 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-2xl">👤</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{nextAppointment.customerName}</h3>
                <p className="text-amber-700 font-medium">{nextAppointment.serviceName}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-600 font-medium">🕐 Thời gian:</span>
                  <span className="font-bold text-amber-600">{nextAppointment.formattedTime}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-600 font-medium">⏱️ Thời lượng:</span>
                  <span className="font-bold text-amber-600">{nextAppointment.formattedDuration || '60 phút'}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="mr-2">📝</span>
                  Ghi chú chuẩn bị:
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {nextAppointment.customerNotes || 'Không có ghi chú đặc biệt. Chuẩn bị theo quy trình tiêu chuẩn.'}
                </p>
              </div>

              <button className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                <span className="mr-2">🔔</span>
                Đặt nhắc nhở
              </button>
            </div>
          </div>
        )}

        {/* Performance Overview - Enhanced */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center text-white mr-3">
              🏆
            </div>
            Hiệu suất của tôi
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <span className="text-gray-700 font-medium flex items-center">
                <span className="mr-2">📊</span>
                Hoàn thành hôm nay:
              </span>
              <div className="text-right">
                <span className="font-bold text-gray-900 text-lg">
                  {performanceStats.todayCompleted}/{performanceStats.todayTotal}
                </span>
                <div className="text-xs text-green-600 font-medium">
                  {performanceStats.todayTotal > 0 ? `${Math.round((performanceStats.todayCompleted/performanceStats.todayTotal)*100)}%` : '0%'}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <span className="text-gray-700 font-medium flex items-center">
                <span className="mr-2">📅</span>
                Tổng lịch hẹn:
              </span>
              <span className="font-bold text-blue-600 text-lg">{performanceStats.totalAppointments}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <span className="text-gray-700 font-medium flex items-center">
                <span className="mr-2">✅</span>
                Tỷ lệ hoàn thành:
              </span>
              <div className="text-right">
                <span className="font-bold text-green-600 text-lg">{performanceStats.completionRate}%</span>
                <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${performanceStats.completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
              <span className="text-gray-700 font-medium flex items-center">
                <span className="mr-2">⭐</span>
                Đánh giá trung bình:
              </span>
              <div className="text-right">
                <span className="font-bold text-yellow-600 text-lg">{performanceStats.averageRating}/5</span>
                <div className="text-xs text-yellow-600">
                  {'★'.repeat(Math.floor(performanceStats.averageRating))}{'☆'.repeat(5-Math.floor(performanceStats.averageRating))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-sm text-gray-600 font-medium">Mục tiêu hôm nay</div>
                <div className="text-xl font-bold text-indigo-600">
                  {performanceStats.todayTotal > 0 ? `${performanceStats.todayTotal - performanceStats.todayCompleted} lịch còn lại` : 'Không có mục tiêu'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tools - Enhanced */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white mr-3">
              🛠️
            </div>
            Công cụ nhanh
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => navigate('/technician/photos')}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">📷</div>
              <div className="text-sm font-bold text-blue-700 text-center">Tải ảnh lên</div>
              <div className="text-xs text-blue-600 mt-1">Ghi lại quá trình</div>
            </button>
            
            <button
              className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-2xl transition-all duration-300 border-2 border-green-200 hover:border-green-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => navigate('/technician/treatments')}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">📝</div>
              <div className="text-sm font-bold text-green-700 text-center">Ghi chú điều trị</div>
              <div className="text-xs text-green-600 mt-1">Theo dõi tiến độ</div>
            </button>
            
            <button
              className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-2xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => navigate('/technician/appointments')}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">📅</div>
              <div className="text-sm font-bold text-purple-700 text-center">Tất cả lịch hẹn</div>
              <div className="text-xs text-purple-600 mt-1">Quản lý lịch trình</div>
            </button>
            
            <button
              className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-2xl transition-all duration-300 border-2 border-indigo-200 hover:border-indigo-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => {
                console.log('🔄 Navigating to technician customer list');
                navigate('/technician/customer-list');
              }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">👤</div>
              <div className="text-sm font-bold text-indigo-700 text-center">Khách hàng</div>
              <div className="text-xs text-indigo-600 mt-1">Thông tin chi tiết</div>
            </button>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <span className="mr-2">⚡</span>
              Thao tác nhanh
            </h3>
            <div className="flex space-x-2">
              <button className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 transition-colors duration-200">
                📞 Gọi khách
              </button>
              <button className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 transition-colors duration-200">
                ⏰ Đặt nhắc nhở
              </button>
            </div>
          </div>
        </div>

        {/* Recent Work - Enhanced */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-slate-600 rounded-lg flex items-center justify-center text-white mr-3">
              📋
            </div>
            Công việc gần đây
          </h2>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentWork && recentWork.length > 0 ? (
              recentWork.map((work, index) => (
                <div key={index} className="group bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 hover:from-gray-100 hover:to-blue-100 transition-all duration-200 border border-gray-200 hover:border-blue-300 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {work.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                          {work.customerName}
                        </div>
                        <div className="text-sm text-blue-600 font-medium">{work.serviceName}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <span className="mr-3">📅 {formatDateTimeVN(work.completedAt)}</span>
                          <span>⏱️ {work.duration} phút</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                        work.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {work.status === 'completed' ? '✅ Hoàn thành' : '🔄 Đang xử lý'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ⭐ 4.8/5
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📋</span>
                </div>
                <div className="text-gray-500 text-lg font-medium">Chưa có công việc gần đây</div>
                <div className="text-gray-400 text-sm mt-2">Hãy bắt đầu với lịch hẹn đầu tiên!</div>
              </div>
            )}
          </div>

          {recentWork && recentWork.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full bg-gradient-to-r from-gray-100 to-blue-100 hover:from-gray-200 hover:to-blue-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all duration-200 border border-gray-300 hover:border-blue-300">
                <span className="mr-2">👁️</span>
                Xem tất cả lịch sử
              </button>
            </div>
          )}
        </div>
      </div>

      {data.error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 mt-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white mr-4">
                ⚠️
              </div>
              <div>
                <div className="text-red-800 font-bold text-lg">Có lỗi xảy ra</div>
                <div className="text-red-700">{data.error}</div>
              </div>
            </div>
            <button
              onClick={fetchDashboardData}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="mr-2">🔄</span>
              Thử lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;
