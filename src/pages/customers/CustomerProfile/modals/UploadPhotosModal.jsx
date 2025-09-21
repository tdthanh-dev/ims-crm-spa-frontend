import React, { useMemo } from 'react';

export default function UploadPhotosModal({
  isOpen,
  files,
  note,
  uploadType,
  uploading,
  error,
  onClose,
  onSelectFiles,
  onSubmit,
  onChangeNote,
  onRemoveFile,
  onChangeUploadType,
}) {
  if (!isOpen) return null;

  // Tạo preview URLs cho các file ảnh
  const filePreviews = useMemo(() => {
    return files.map((file) => {
      const url = URL.createObjectURL(file);
      return {
        file,
        url,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      };
    });
  }, [files]);

  // Cleanup object URLs khi component unmount
  React.useEffect(() => {
    return () => {
      filePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [filePreviews]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Upload ảnh hồ sơ</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* File input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn ảnh để upload
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={onSelectFiles}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                Chọn nhiều ảnh cùng lúc. Hỗ trợ: JPEG, PNG, GIF, WebP (tối đa 10MB/ảnh)
              </p>
            </div>

            {/* Photo Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại ảnh
              </label>
              <div className="flex gap-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="photoType"
                    value="BEFORE"
                    checked={uploadType === 'BEFORE'}
                    onChange={(e) => onChangeUploadType?.(e.target.value)}
                    className="mr-2 text-pink-600 focus:ring-pink-500"
                    disabled={uploading}
                  />
                  <span className="text-sm text-gray-700">Trước điều trị</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="photoType"
                    value="AFTER"
                    checked={uploadType === 'AFTER'}
                    onChange={(e) => onChangeUploadType?.(e.target.value)}
                    className="mr-2 text-pink-600 focus:ring-pink-500"
                    disabled={uploading}
                  />
                  <span className="text-sm text-gray-700">Sau điều trị</span>
                </label>
              </div>
            </div>

            {/* File previews */}
            {files?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Preview ({files.length} ảnh)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                  {filePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview.url}
                        alt={preview.name}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
                        <span className="text-white text-xs opacity-0 group-hover:opacity-100 font-medium">
                          {preview.size}
                        </span>
                      </div>
                      {/* Remove button */}
                      {!uploading && (
                        <button
                          onClick={() => onRemoveFile?.(index)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200 flex items-center justify-center"
                          title="Xóa ảnh này"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Note input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú (tùy chọn)
              </label>
              <textarea
                value={note}
                onChange={(e) => onChangeNote(e.target.value)}
                placeholder="Thêm ghi chú cho ảnh..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="text-sm text-red-600">{error}</div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={onSubmit}
                disabled={uploading || !files?.length}
                className="flex-1 rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 px-4 py-2.5 text-white font-medium hover:from-pink-700 hover:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang upload...
                  </span>
                ) : (
                  `Upload ${files?.length || 0} ảnh`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
