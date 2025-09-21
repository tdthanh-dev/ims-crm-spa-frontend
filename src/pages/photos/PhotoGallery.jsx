import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Pagination } from '@/components/common/CommonComponents';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { usePhotoGallery } from './usePhotoGallery';
import PhotoCard from './PhotoCard';
import PhotoUploadModal from './PhotoUploadModal';

/**
 * Photo Gallery Component - For viewing and managing treatment photos
 * Technician can upload before/after photos for treatments
 */
const PhotoGallery = ({ userRole }) => {
  const { user } = useAuth();
  const [uploadModal, setUploadModal] = useState(false);

  // Use custom hook for all photo gallery logic
  const {
    photos,
    loading,
    cases,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    filterType,
    setFilterType,
    photoStats,
    handleDownloadPhoto,
    handleDeletePhoto,
    handlePreviewPhoto,
    handleUpload,
  } = usePhotoGallery(userRole, user);

  return (
    <ErrorBoundary>
      <div className="photo-gallery">
        <header className="gallery-header" role="banner">
          <div className="header-main">
            <h1>📷 Thư viện ảnh</h1>
            <div className="photo-stats" role="region" aria-label="Thống kê ảnh">
              <div className="stat-item">
                <span className="stat-label">Tổng ảnh:</span>
                <span className="stat-value">{photoStats.total || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Trước:</span>
                <span className="stat-value">{photoStats.before || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Sau:</span>
                <span className="stat-value">{photoStats.after || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Quá trình:</span>
                <span className="stat-value">{photoStats.progress || 0}</span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <label htmlFor="photo-search" className="sr-only">Tìm kiếm ảnh</label>
              <input
                id="photo-search"
                type="text"
                placeholder="🔍 Tìm kiếm ảnh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                aria-label="Tìm kiếm ảnh theo tên hoặc ghi chú"
              />
            </div>
            {userRole === 'TECHNICIAN' && (
              <button
                className="btn btn-primary"
                onClick={() => setUploadModal(true)}
                aria-label="Upload ảnh mới"
              >
                ⬆️ Upload ảnh
              </button>
            )}
          </div>
        </header>

        {/* Filter Tabs */}
        <nav className="filter-tabs" role="tablist" aria-label="Lọc ảnh theo loại">
          <button
            className={`tab ${filterType === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterType('ALL')}
            aria-pressed={filterType === 'ALL'}
            aria-label="Hiển thị tất cả ảnh"
            role="tab"
          >
            📸 Tất cả
          </button>
          <button
            className={`tab ${filterType === 'BEFORE' ? 'active' : ''}`}
            onClick={() => setFilterType('BEFORE')}
            aria-pressed={filterType === 'BEFORE'}
            aria-label="Hiển thị ảnh trước điều trị"
            role="tab"
          >
            📷 Trước điều trị
          </button>
          <button
            className={`tab ${filterType === 'AFTER' ? 'active' : ''}`}
            onClick={() => setFilterType('AFTER')}
            aria-pressed={filterType === 'AFTER'}
            aria-label="Hiển thị ảnh sau điều trị"
            role="tab"
          >
            📷 Sau điều trị
          </button>
          <button
            className={`tab ${filterType === 'PROGRESS' ? 'active' : ''}`}
            onClick={() => setFilterType('PROGRESS')}
            aria-pressed={filterType === 'PROGRESS'}
            aria-label="Hiển thị ảnh quá trình điều trị"
            role="tab"
          >
            📷 Quá trình
          </button>
          <button
            className={`tab ${filterType === 'OTHER' ? 'active' : ''}`}
            onClick={() => setFilterType('OTHER')}
            aria-pressed={filterType === 'OTHER'}
            aria-label="Hiển thị ảnh khác"
            role="tab"
          >
            📷 Khác
          </button>
        </nav>

        {/* Photo Grid */}
        <div className="content-area">
          <main className="photos-grid" role="main" aria-label="Danh sách ảnh">
            {loading ? (
              <div className="loading" role="status" aria-live="polite">
                Đang tải ảnh...
              </div>
            ) : photos.length === 0 ? (
              <div className="no-photos" role="region" aria-label="Không có ảnh">
                <div className="no-photos-icon" aria-hidden="true">📷</div>
                <h3>Chưa có ảnh nào</h3>
                <p>Hãy upload ảnh đầu tiên để bắt đầu thư viện của bạn!</p>
                {userRole === 'TECHNICIAN' && (
                  <button
                    className="upload-first-btn"
                    onClick={() => setUploadModal(true)}
                  >
                    Upload ảnh đầu tiên
                  </button>
                )}
              </div>
            ) : (
              <div role="grid" aria-label={`Hiển thị ${photos.length} ảnh`}>
                {photos.map(photo => (
                  <PhotoCard
                    key={photo.photoId}
                    photo={photo}
                    onDownload={handleDownloadPhoto}
                    onDelete={handleDeletePhoto}
                    onPreview={handlePreviewPhoto}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Pagination */}
          {photos.length > 0 && totalPages > 1 && (
            <div className="pagination-container">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {/* Upload Modal */}
          <PhotoUploadModal
            isOpen={uploadModal}
            onClose={() => setUploadModal(false)}
            cases={cases}
            onUpload={handleUpload}
            loading={loading}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PhotoGallery;