import React, { useState } from 'react';
import { photosApi } from '@/services';

/**
 * PhotoUploadModal Component - Modal for uploading photos
 */
const PhotoUploadModal = ({
    isOpen,
    onClose,
    cases,
    onUpload,
    loading
}) => {
    const [selectedCaseId, setSelectedCaseId] = useState('');
    const [uploadCategory, setUploadCategory] = useState('BEFORE');
    const [uploadNote, setUploadNote] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleSubmit = async () => {
        if (selectedFiles.length === 0) {
            alert('Vui lòng chọn ít nhất 1 file ảnh');
            return;
        }

        if (!selectedCaseId) {
            alert('Vui lòng chọn case để upload ảnh');
            return;
        }

        // Validate files
        const validation = photosApi.validatePhotoFiles(selectedFiles);
        if (!validation.isValid) {
            alert('Lỗi validation: ' + validation.errors.join(', '));
            return;
        }

        await onUpload({
            selectedCaseId,
            uploadCategory,
            selectedFiles,
            uploadNote: uploadNote || null
        });

        // Reset form
        setSelectedCaseId('');
        setUploadCategory('BEFORE');
        setUploadNote('');
        setSelectedFiles([]);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>📷 Upload ảnh điều trị</h2>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Đóng modal"
                    >
                        ✕
                    </button>
                </div>

                <div className="upload-form">
                    <div className="form-group">
                        <label htmlFor="case-select">Chọn case điều trị:</label>
                        <select
                            id="case-select"
                            value={selectedCaseId}
                            onChange={(e) => setSelectedCaseId(e.target.value)}
                            required
                        >
                            <option value="">-- Chọn case --</option>
                            {cases.map(caseItem => (
                                <option key={caseItem.caseId} value={caseItem.caseId}>
                                    Case #{caseItem.caseId} - {caseItem.customerName} ({caseItem.serviceName})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="photo-type">Loại ảnh:</label>
                        <select
                            id="photo-type"
                            value={uploadCategory}
                            onChange={(e) => setUploadCategory(e.target.value)}
                        >
                            <option value="BEFORE">📷 Ảnh trước điều trị</option>
                            <option value="AFTER">📷 Ảnh sau điều trị</option>
                            <option value="PROGRESS">📷 Ảnh quá trình</option>
                            <option value="OTHER">📷 Khác</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="upload-note">Ghi chú (tùy chọn):</label>
                        <textarea
                            id="upload-note"
                            value={uploadNote}
                            onChange={(e) => setUploadNote(e.target.value)}
                            placeholder="Nhập ghi chú cho ảnh..."
                            rows={3}
                            className="note-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="file-input">Chọn ảnh:</label>
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="file-input"
                        />
                        {selectedFiles.length > 0 && (
                            <div className="selected-files">
                                <p>Đã chọn {selectedFiles.length} file(s):</p>
                                <div className="file-list">
                                    {selectedFiles.map((file, index) => {
                                        const validation = photosApi.validatePhotoFile(file);
                                        return (
                                            <div
                                                key={index}
                                                className={`file-item ${validation.isValid ? 'valid' : 'invalid'}`}
                                            >
                                                <span className="file-name">{file.name}</span>
                                                <span className="file-size">({photosApi.formatFileSize(file.size)})</span>
                                                {!validation.isValid && (
                                                    <span className="file-error">❌ {validation.errors.join(', ')}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {selectedFiles.length > 0 && photosApi.validatePhotoFiles(selectedFiles).isValid && (
                                    <div className="validation-success">
                                        ✅ Tất cả files đều hợp lệ
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="upload-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={selectedFiles.length === 0 || loading}
                            className="btn btn-primary"
                        >
                            {loading ? '⏳ Đang upload...' : '⬆️ Upload'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoUploadModal;
