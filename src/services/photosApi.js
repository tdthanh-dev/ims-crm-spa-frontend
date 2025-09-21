// src/services/photosApi.js
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/config/constants';

export const photosApi = {
  // Upload một ảnh cho 1 case
  async uploadPhoto(caseId, file, note = '', type = 'BEFORE') {
    const formData = new FormData();
    formData.append('caseId', caseId.toString());
    formData.append('type', type);
    if (note) formData.append('note', note);
    formData.append('photoFile', file);

    const res = await apiClient.post(
      `${API_ENDPOINTS.PHOTOS}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const photo = res?.data?.data ?? res?.data ?? {};
    // Chuẩn hoá fileUrl (BE trả 'url')
    return { ...photo, fileUrl: photo.fileUrl || photo.url };
  },

  // Upload nhiều ảnh cho 1 case
  async uploadPhotos(caseId, files, note = '', type = 'BEFORE') {
    const formData = new FormData();
    formData.append('caseId', caseId.toString());
    formData.append('type', type);
    if (note) formData.append('note', note);
    files.forEach((f) => formData.append('photoFiles', f));

    const res = await apiClient.post(
      `${API_ENDPOINTS.PHOTOS}/upload/multiple`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const list = res?.data?.data ?? res?.data ?? [];
    // Chuẩn hoá fileUrl (BE trả 'url')
    return list.map(p => ({ ...p, fileUrl: p.fileUrl || p.url }));
  },

  // Lấy ảnh theo caseId
  async getPhotosByCase(caseId) {
    const res = await apiClient.get(`${API_ENDPOINTS.PHOTOS}/case/${caseId}`);
    const list = res?.data?.data ?? res?.data ?? [];
    return list.map(p => ({ ...p, fileUrl: p.fileUrl || p.url }));
  },

  // (Giữ để backward-compat, nhưng cảnh báo)
  async getPhotosByCustomer(customerId) {
    console.warn('getPhotosByCustomer() is deprecated. Use getPhotosByCase(caseId) instead.');
    return this.getPhotosByCase(customerId);
  },

  // Xoá ảnh theo photoId
  async deletePhoto(photoId) {
    const res = await apiClient.delete(`${API_ENDPOINTS.PHOTOS}/${photoId}`);
    // BE thường trả ApiResponse<Void>; coi như xoá thành công nếu không throw
    return res?.data?.success ?? true;
  },
};

export default photosApi;
