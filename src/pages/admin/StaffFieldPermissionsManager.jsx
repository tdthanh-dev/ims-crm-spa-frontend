import React, { useEffect, useMemo, useState, useCallback } from 'react'
import staffUsersApi from '@/services/staffUsersApi'
import staffFieldPermissionsApi from '@/services/staffFieldPermissionsApi'
import {
  PERMISSION_LEVEL_MAP,
  STAFF_FIELD_PERMISSIONS_MAP,
  PERMISSION_CATEGORIES
} from '@/config/constants'

/* -------------------- Small UI -------------------- */
const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`} >
    {children}
  </span>
)

const LevelPill = ({ level }) => {
  const m = PERMISSION_LEVEL_MAP[level] || { label: level, color: 'bg-black-100 text-black-700' }
  return <Badge className={m.color}>{m.label}</Badge>
}

const LevelSelect = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="rounded-lg border border-black-200 bg-white px-2.5 py-1.5 text-sm text-black-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
  >
    <option value="NO">{PERMISSION_LEVEL_MAP.NO.label}</option>
    <option value="VIEW">{PERMISSION_LEVEL_MAP.VIEW.label}</option>
    <option value="EDIT">{PERMISSION_LEVEL_MAP.EDIT.label}</option>
  </select>
)

const Skeleton = () => (
  <div className="animate-pulse rounded-xl border border-black-100 bg-white p-4 shadow-sm">
    <div className="mb-2 h-5 w-40 rounded bg-black-100" />
    <div className="h-4 w-64 rounded bg-black-100" />
  </div>
)

/* -------------------- Modal -------------------- */
const PermissionsModal = ({ open, onClose, staff, onSaved }) => {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    if (!open || !staff?.staffId) return
    try {
      setLoading(true)
      setError(null)
      // ✅ dùng đúng API name
      const res = await staffFieldPermissionsApi.getByStaffId(staff.staffId)
      setData(res)
    } catch (e) {
      // nếu BE chưa có sẽ tạo mặc định rồi lấy lại
      try {
        await staffFieldPermissionsApi.create(staff.staffId)
        const res = await staffFieldPermissionsApi.getByStaffId(staff.staffId)
        setData(res)
      } catch (err) {
        setError('Không tải được quyền của nhân viên')
      }
    } finally {
      setLoading(false)
    }
  }, [open, staff])

  useEffect(() => {
    load()
  }, [load])

  const categorized = useMemo(() => {
    if (!data) return {}
    const result = {}
    Object.entries(data).forEach(([key, val]) => {
      if (key === 'staffId') return
      const meta = STAFF_FIELD_PERMISSIONS_MAP[key]
      if (!meta) return
      if (search && !meta.label.toLowerCase().includes(search.toLowerCase())) return
      const cat = meta.category
      if (!result[cat]) result[cat] = []
      result[cat].push({ key, value: val, meta })
    })
    return result
  }, [data, search])

  const setAllInCat = (catKey, level) => {
    setData(prev => {
      const next = { ...prev }
      ;(categorized[catKey] || []).forEach(({ key }) => { next[key] = level })
      return next
    })
  }

  const handleSave = async () => {
    if (!data || !staff?.staffId) return
    setSaving(true)
    try {
      // ✅ dùng đúng API name
      await staffFieldPermissionsApi.update(staff.staffId, data) // PUT
      onSaved?.()
      onClose()
    } catch (e) {
      setError('Lưu quyền thất bại. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[min(100%,900px)] max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black-100 bg-white px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-black-900">Sửa quyền truy cập</h3>
            <p className="text-sm text-black-500">
              Nhân viên: <span className="font-medium text-black-800">{staff?.fullName}</span> — ID: {staff?.staffId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-black-200 bg-white px-3 py-2 text-sm hover:bg-black-50"
          >
            Đóng
          </button>
        </div>

        {/* Toolbar */}
        <div className="sticky top-[64px] z-10 flex items-center justify-between gap-3 border-b border-black-100 bg-white px-5 py-3">
          <input
            placeholder="Tìm quyền theo tên…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 rounded-lg border border-black-200 bg-white px-3 py-2 text-sm text-black-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-black-500">Legend:</span>
            <LevelPill level="NO" />
            <LevelPill level="VIEW" />
            <LevelPill level="EDIT" />
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-4 space-y-4 max-h-[calc(85vh-160px)]">
          {loading && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Skeleton /><Skeleton /><Skeleton /><Skeleton />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-error-200 bg-error-50 p-3 text-error-700">{error}</div>
          )}

          {!loading && data && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Object.entries(PERMISSION_CATEGORIES).map(([catKey, cat]) => {
                const fields = categorized[catKey] || []
                return (
                  <div key={catKey} className="rounded-xl border border-black-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-2 rounded-t-xl border-b border-black-100 bg-black-50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cat.icon}</span>
                        <h4 className="font-semibold text-black-900">{cat.label}</h4>
                        <span className="text-xs text-black-500">({fields.length})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAllInCat(catKey, 'NO')}
                          className="rounded-lg border border-black-200 bg-white px-2.5 py-1 text-xs hover:bg-black-50"
                        >
                          Tất cả NO
                        </button>
                        <button
                          onClick={() => setAllInCat(catKey, 'VIEW')}
                          className="rounded-lg border border-black-200 bg-white px-2.5 py-1 text-xs hover:bg-black-50"
                        >
                          Tất cả VIEW
                        </button>
                        <button
                          onClick={() => setAllInCat(catKey, 'EDIT')}
                          className="rounded-lg border border-black-200 bg-white px-2.5 py-1 text-xs hover:bg-black-50"
                        >
                          Tất cả EDIT
                        </button>
                      </div>
                    </div>

                    <div className="divide-y divide-black-100">
                      {fields.length === 0 ? (
                        <div className="p-4 text-sm text-black-500">Không có quyền khớp từ khóa.</div>
                      ) : (
                        fields.map(({ key, value, meta }) => (
                          <div key={key} className="flex items-center justify-between gap-3 p-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-black-900">{meta.label}</div>
                              <div className="truncate text-xs text-black-500">{meta.description}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <LevelPill level={value} />
                              <LevelSelect
                                value={value}
                                onChange={(v) => setData((prev) => ({ ...prev, [key]: v }))}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 border-t border-black-100 bg-white px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-black-200 bg-white px-3 py-2 text-sm text-black-800 hover:bg-black-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className={`rounded-lg px-3 py-2 text-sm text-white ${saving ? 'bg-primary-300' : 'bg-primary-600 hover:bg-primary-700'}`}
          >
            {saving ? 'Đang lưu…' : 'Lưu quyền'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* -------------------- Page: Staff List + Edit button -------------------- */
const StaffPermissions = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [staff, setStaff] = useState([])
  const [q, setQ] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)

  const filtered = useMemo(() => {
    if (!q) return staff
    const s = q.toLowerCase()
    return staff.filter(it =>
      (it.fullName || '').toLowerCase().includes(s) ||
      (it.phone || '').toLowerCase().includes(s) ||
      (it.email || '').toLowerCase().includes(s)
    )
  }, [q, staff])

  const loadStaff = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await staffUsersApi.getStaffUsers({ size: 200, sortBy: 'fullName', sortDir: 'asc' })
      const list = res?.content || res?.data || []
      setStaff(list)
    } catch (e) {
      setError('Không tải được danh sách nhân viên')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStaff()
  }, [loadStaff])

  const statusBadgeClass = (status) =>
    status === 'ACTIVE'
      ? 'bg-green-100 text-green-800'
      : 'bg-black-100 text-black-800'

  return (
    <div className="space-y-5 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black-900">Quyền truy cập theo nhân viên</h1>
          <p className="text-sm text-black-600">Xem danh sách và sửa quyền từng nhân viên.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên/SĐT/email…"
            className="w-72 rounded-lg border border-black-200 bg-white px-3 py-2 text-sm text-black-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={loadStaff}
            className="rounded-lg border border-black-200 bg-white px-3 py-2 text-sm text-black-800 hover:bg-black-50"
          >
            Tải lại
          </button>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-black-100 bg-white shadow-sm">
        {loading ? (
          <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
            <Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton />
          </div>
        ) : error ? (
          <div className="p-4 text-error-700">⚠️ {error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-black-600">Không có nhân viên phù hợp.</div>
        ) : (
          <ul className="divide-y divide-black-100">
            {filtered.map((s) => (
              <li key={s.staffId} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="truncate text-black-900 font-medium">{s.fullName}</div>
                  <div className="truncate text-sm text-black-600">
                    {s.position || '—'} · {s.phone || '—'} · {s.email || '—'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* ✅ tránh class Tailwind động */}
                  <Badge className={statusBadgeClass(s.status)}>
                    {s.status || '—'}
                  </Badge>
                  <button
                    onClick={() => { setSelectedStaff(s); setModalOpen(true) }}
                    className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
                  >
                    Sửa quyền truy cập
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      <PermissionsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        staff={selectedStaff}
        onSaved={() => {}}
      />
    </div>
  )
}

export default StaffPermissions
