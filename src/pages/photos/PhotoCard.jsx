import React, { memo, useCallback, useMemo } from 'react';
import { photosApi } from '@/services';

/**
 * PhotoCard Component - Individual photo card with actions
 * Optimized with memo and useCallback for performance
 */
const PhotoCard = memo(({ photo, onDownload, onDelete, onPreview }) => {
    const handleDownload = useCallback(() => onDownload(photo), [photo, onDownload]);
    const handleDelete = useCallback(() => onDelete(photo.photoId), [photo.photoId, onDelete]);
    const handlePreview = useCallback(() => onPreview(photo), [photo, onPreview]);

    const photoTypeDisplay = useMemo(() =>
        photosApi.getPhotoTypeDisplayName(photo.photoType),
        [photo.photoType]
    );

    const fileSizeDisplay = useMemo(() =>
        photosApi.formatFileSize(photo.fileSize),
        [photo.fileSize]
    );

    return (
        <div className="photo-card">
            <div className="photo-image">
                <img
                    src={photo.photoUrl}
                    alt={photo.filename}
                    loading="lazy"
                    onClick={handlePreview}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handlePreview();
                        }
                    }}
                />
                <div className="photo-overlay">
                    <button
                        onClick={handlePreview}
                        title="Xem ảnh"
                        aria-label={`Xem ảnh ${photo.filename}`}
                    >
                        👁️
                    </button>
                    <button
                        onClick={handleDownload}
                        title="Tải xuống"
                        aria-label={`Tải xuống ảnh ${photo.filename}`}
                    >
                        ⬇️
                    </button>
                </div>
            </div>

            <div className="photo-info">
                <div className="photo-title">
                    {photoTypeDisplay}
                </div>
                <div className="photo-details">
                    <span className="file-size">{fileSizeDisplay}</span>
                    <span className="photo-date">{new Date(photo.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                {photo.note && <div className="photo-note">{photo.note}</div>}

                <div className="photo-actions">
                    <button
                        onClick={handleDelete}
                        className="delete-btn"
                        title="Xóa ảnh"
                        aria-label={`Xóa ảnh ${photo.filename}`}
                    >
                        🗑️ Xóa
                    </button>
                </div>
            </div>
        </div>
    );
});

PhotoCard.displayName = 'PhotoCard';

export default PhotoCard;