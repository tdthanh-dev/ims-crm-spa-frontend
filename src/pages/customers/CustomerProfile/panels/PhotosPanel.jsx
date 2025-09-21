// src/pages/customers/CustomerProfile/panels/PhotosPanel.jsx
import React, { useMemo, useState, useEffect } from 'react';
import usePhotoBlobs from '@/hooks/usePhotoBlobs';
import photosApi from '@/services/photosApi';

export default function PhotosPanel({
  loading,
  caseInfo,          // { caseId, serviceName, status, startDate, endDate, intakeNote, notes }
  photos: initialPhotos = [], // chỉ dùng để khởi tạo lần đầu (tùy chọn)
  onBack,
  onOpenUpload,
  onDeletePhoto,
  formatDateTimeVN,
}) {
  // ✅ khởi tạo từ initialPhotos đúng 1 lần
  const [photos, setPhotos] = useState(() =>
    Array.isArray(initialPhotos) ? initialPhotos : []
  );
  const [photosLoading, setPhotosLoading] = useState(false);
  const [error, setError] = useState(null);

  const blobs = usePhotoBlobs(photos);

  // ✅ Chỉ load theo caseId (không sync lại từ initialPhotos mỗi render)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!caseInfo?.caseId) return;
      setPhotosLoading(true);
      setError(null);
      try {
        const list = await photosApi.getPhotosByCase(caseInfo.caseId);
        if (!cancelled) setPhotos(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Lỗi khi tải ảnh hồ sơ:', err);
        if (!cancelled) {
          setError('Không thể tải ảnh. Vui lòng thử lại.');
          setPhotos([]);
        }
      } finally {
        if (!cancelled) setPhotosLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [caseInfo?.caseId]);

  // ✅ Xoá ảnh (cập nhật local state)
  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Bạn có chắc muốn xóa ảnh này?')) return;
    try {
      const ok = await photosApi.deletePhoto(photoId);
      if (ok === true || ok?.success) {
        setPhotos((prev) => prev.filter((p) => (p.photoId ?? p.id) !== photoId));
        onDeletePhoto?.(photoId);
      } else {
        alert('Không thể xóa ảnh. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Lỗi khi xóa ảnh:', err);
      alert('Có lỗi xảy ra khi xóa ảnh.');
    }
  };

  // Chia ảnh theo BEFORE / AFTER
  const before = useMemo(() => photos.filter((p) => p.type === 'BEFORE'), [photos]);
  const after  = useMemo(() => photos.filter((p) => p.type === 'AFTER'),  [photos]);

  if (loading || photosLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
        <p className="mt-3 text-gray-600">Đang tải ảnh...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => caseInfo?.caseId && (async () => {
            // gọi lại effect bằng cách set lại state nhẹ — hoặc đơn giản để user chuyển tab khác rồi quay lại
            // ở đây ta gọi trực tiếp, nhưng thực ra chỉ cần rely vào effect caseId là đủ
            try {
              setPhotosLoading(true);
              setError(null);
              const list = await photosApi.getPhotosByCase(caseInfo.caseId);
              setPhotos(Array.isArray(list) ? list : []);
            } catch (e) {
              setError('Không thể tải ảnh. Vui lòng thử lại.');
              setPhotos([]);
            } finally {
              setPhotosLoading(false);
            }
          })()}
          className="rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50"
            >
              ← Lịch sử điều trị
            </button>
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Ảnh hồ sơ điều trị #{caseInfo?.caseId}{' '}
              {caseInfo?.serviceName && (
                <span className="font-normal text-gray-700">— {caseInfo.serviceName}</span>
              )}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {caseInfo?.status && <StatusPill status={caseInfo.status} />}
              {caseInfo?.paidStatus && <PaidStatusPill status={caseInfo.paidStatus} />}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenUpload}
          className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-pink-700"
        >
          + Upload ảnh
        </button>
      </div>

      {/* Info hồ sơ */}
      {caseInfo && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="📅 Bắt đầu">{caseInfo.startDate ? formatDateTimeVN(caseInfo.startDate) : '—'}</Info>
            <Info label="🏁 Kết thúc">{caseInfo.endDate ? formatDateTimeVN(caseInfo.endDate) : '—'}</Info>
            <Info label="📋 Trạng thái"><StatusPill status={caseInfo.status} /></Info>
            <Info label="💰 Thanh toán">
              <PaidStatusPill status={caseInfo.paidStatus} />
            </Info>
          </div>

          {/* Tổng tiền - chỉ hiển thị nếu có */}
          {caseInfo.totalAmount && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Info label="💵 Tổng tiền điều trị">
                <span className="text-lg font-bold text-green-600">
                  {typeof caseInfo.totalAmount === 'number'
                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(caseInfo.totalAmount)
                    : caseInfo.totalAmount
                  }
                </span>
              </Info>
            </div>
          )}

          {/* Ghi chú - chỉ hiển thị nếu có */}
          {(caseInfo.intakeNote || caseInfo.notes) && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Info label="📝 Ghi chú điều trị">
                <span className="text-gray-800 bg-gray-50 rounded-lg p-3 block leading-relaxed">
                  {caseInfo.intakeNote || caseInfo.notes}
                </span>
              </Info>
            </div>
          )}
        </div>
      )}

      {/* Hai cột ảnh */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <GalleryColumn
          title={`Trước ${before.length ? `(${before.length})` : ''}`}
          items={before}
          blobs={blobs}
          onDeletePhoto={handleDeletePhoto}
          formatDateTimeVN={formatDateTimeVN}
          emptyText="Chưa có ảnh trước"
        />
        <GalleryColumn
          title={`Sau ${after.length ? `(${after.length})` : ''}`}
          items={after}
          blobs={blobs}
          onDeletePhoto={handleDeletePhoto}
          formatDateTimeVN={formatDateTimeVN}
          emptyText="Chưa có ảnh sau"
        />
      </div>
    </div>
  );
}

/* ---------- Sub components ---------- */
function Info({ label, children }) {
  return (
    <div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    INTAKE:      'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED:   'bg-green-100 text-green-800',
    ON_HOLD:     'bg-amber-100 text-amber-800',
    CANCELLED:   'bg-red-100 text-red-800',
  };
  const cls = map[status] || 'bg-gray-100 text-gray-800';
  const label =
    {
      INTAKE: 'Tiếp nhận',
      IN_PROGRESS: 'Đang điều trị',
      COMPLETED: 'Hoàn thành',
      ON_HOLD: 'Tạm dừng',
      CANCELLED: 'Hủy bỏ',
    }[status] || status || '—';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function PaidStatusPill({ status }) {
  const map = {
    'UNPAID':         'bg-red-100 text-red-800',
    'PARTIALLY_PAID': 'bg-yellow-100 text-yellow-800',
    'FULLY_PAID':     'bg-green-100 text-green-800',
  };
  const cls = map[status] || 'bg-gray-100 text-gray-800';
  const label =
    {
      'UNPAID': 'Chưa thanh toán',
      'PARTIALLY_PAID': 'Thanh toán một phần',
      'FULLY_PAID': 'Đã thanh toán',
    }[status] || status || '—';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function toDate(val) {
  if (!val) return null;
  if (Array.isArray(val)) {
    const [y, M, d, h = 0, m = 0, s = 0] = val;
    return new Date(y, (M ?? 1) - 1, d ?? 1, h, m, s);
  }
  if (typeof val === 'number') return new Date(val < 1e12 ? val * 1000 : val);
  return new Date(val);
}

function GalleryColumn({ title, items, blobs, onDeletePhoto, formatDateTimeVN, emptyText }) {
  return (
    <div className="space-y-3">
      <h4 className="text-base font-semibold text-gray-900">{title}</h4>

      {items?.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((p) => {
            const key = p.photoId ?? p.id;
            const imageUrl = blobs[key] || ''; // blob theo id (qua /api/photos/download/{id})
            const dt = toDate(p.takenAt);

            return (
              <div
                key={key}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <img
                  src={imageUrl}
                  alt={p.fileName || 'Ảnh'}
                  className="h-40 w-full object-cover transition group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGM0Y0RjYiLz48dGV4dCB4PSIxNTAiIHk9IjE1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDOUM5NyI+S2hvbmcgdGFpIGFuZjwvdGV4dD48L3N2Zz4=';
                  }}
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 flex flex-col justify-between bg-black/40 p-2 opacity-0 transition group-hover:opacity-100">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDeletePhoto?.(key)}
                      className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                    >
                      Xoá
                    </button>
                  </div>
                  <div className="text-xs text-white">
                    <div>
                      <span className="font-medium">{p.type}</span>{' '}
                      {dt ? formatDateTimeVN(dt) : ''}
                    </div>
                    {p.note && <div className="truncate">{p.note}</div>}
                  </div>
                </div>

                {/* Ribbon info cho mobile */}
                <div className="flex items-center justify-between bg-black/60 px-2 py-1 text-[11px] text-white md:hidden">
                  <span className="truncate">{p.type}</span>
                  {dt && <span className="ml-2 opacity-90">{formatDateTimeVN(dt)}</span>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
          {emptyText}
        </div>
      )}
    </div>
  );
}
