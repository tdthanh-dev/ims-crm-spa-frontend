import React from 'react';

export default function UploadPhotosModal({
  isOpen,
  files,
  note,
  uploading,
  error,
  onClose,
  onSelectFiles,
  onSubmit,
  onChangeNote,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Upload ảnh</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onSelectFiles}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
          {files?.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">Đã chọn {files.length} ảnh</p>
          )}

          <textarea
            value={note}
            onChange={(e) => onChangeNote(e.target.value)}
            placeholder="Thêm ghi chú..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            rows={3}
          />

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={onSubmit}
              disabled={uploading || !files?.length}
              className="flex-1 rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700 disabled:opacity-50"
            >
              {uploading ? 'Đang upload...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
