import { useEffect, useState } from 'react';
import apiClient from '@/services/apiClient';

export default function usePhotoBlobs(photos) {
  const [urls, setUrls] = useState({}); // { [photoId]: objectUrl }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const objectUrls = [];

    async function load() {
      if (!photos?.length) {
        setUrls({});
        return;
      }

      const entries = await Promise.all(
        photos.map(async (p) => {
          const id = p.photoId ?? p.id;
          if (!id) return [undefined, null];

          try {
            // Ưu tiên fileUrl nếu là relative; nếu không có thì fallback theo id
            // apiClient baseURL: '/api' hoặc 'http://localhost:8081/api'
            let path;
            if (p.fileUrl && !p.fileUrl.startsWith('http')) {
              // '/api/photos/...' -> cắt '/api/'
              path = p.fileUrl.startsWith('/api/')
                ? p.fileUrl.slice(5)
                : p.fileUrl.replace(/^\//, '');
            } else {
              path = `photos/download/${id}`;
            }

            const res = await apiClient.get(path, {
              responseType: 'blob',
              signal: controller.signal,
            });

            const objUrl = URL.createObjectURL(res.data);
            objectUrls.push(objUrl);
            return [id, objUrl];
          } catch (e) {
            console.error('Load photo blob failed:', e);
            return [id, null];
          }
        })
      );

      if (!isMounted) return;
      setUrls(Object.fromEntries(entries.filter(([k]) => k != null)));
    }

    load();

    return () => {
      isMounted = false;
      controller.abort();
      objectUrls.forEach((u) => URL.revokeObjectURL(u));
    };
    // refetch khi danh sách id/fileUrl thay đổi
  }, [JSON.stringify(photos?.map((p) => [p.photoId ?? p.id, p.fileUrl ?? null]))]);

  return urls;
}
