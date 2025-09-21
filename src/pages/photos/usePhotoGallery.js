import { useState, useCallback, useEffect } from 'react';
import { photosApi, customerCasesApi } from '@/services';

/**
 * Custom hook for PhotoGallery logic
 * Separates business logic from UI components
 */
export const usePhotoGallery = (userRole, user) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filterType, setFilterType] = useState('ALL');
    const [photoStats, setPhotoStats] = useState({
        total: 0,
        before: 0,
        after: 0,
        progress: 0,
        other: 0
    });

    // Load photo statistics
    const loadPhotoStats = useCallback(async () => {
        try {
            const response = await photosApi.getPhotoStatistics();
            setPhotoStats(response || {
                total: 0,
                before: 0,
                after: 0,
                progress: 0,
                other: 0
            });
        } catch (error) {
            console.error('Error loading photo stats:', error);
            // Keep default stats
        }
    }, []);

    // Load photos with search and filter
    const loadPhotos = useCallback(async () => {
        try {
            setLoading(true);

            let params = {
                page: currentPage,
                size: 20
            };

            // Add type filter if not ALL
            if (filterType !== 'ALL') {
                params.type = filterType;
            }

            // Add search term if provided
            if (searchTerm.trim()) {
                params.search = searchTerm.trim();
            }

            const response = await photosApi.searchPhotos(searchTerm, params);

            setPhotos(response.content || []);
            setTotalPages(response.totalPages || 0);

            // Load photo statistics
            await loadPhotoStats();
        } catch (error) {
            console.error('Error loading photos:', error);
            setPhotos([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, filterType, searchTerm, loadPhotoStats]);

    // Load customer cases
    const loadCases = useCallback(async () => {
        try {
            // Load customer cases for the current user (technician)
            if (userRole === 'TECHNICIAN' && user?.staffId) {
                const response = await customerCasesApi.getCasesByStaff(user.staffId, {
                    page: 0,
                    size: 50
                });
                setCases(response.content || []);
            }
        } catch (error) {
            console.error('Error loading cases:', error);
            setCases([]);
        }
    }, [userRole, user?.staffId]);

    // Handle photo download
    const handleDownloadPhoto = useCallback(async (photo) => {
        try {
            await photosApi.downloadPhotoFile(photo.customerId, photo.filename);
        } catch (error) {
            console.error('Download error:', error);
            alert('Không thể tải ảnh xuống');
        }
    }, []);

    // Handle photo deletion
    const handleDeletePhoto = useCallback(async (photoId) => {
        if (confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
            try {
                await photosApi.deletePhoto(photoId);
                loadPhotos();
                alert('Xóa ảnh thành công!');
            } catch (error) {
                console.error('Delete error:', error);
                alert('Không thể xóa ảnh');
            }
        }
    }, [loadPhotos]);

    // Handle photo preview
    const handlePreviewPhoto = useCallback((photo) => {
        // TODO: Open modal to view full image
        console.log('View photo:', photo);
        // For now, just open in new tab
        window.open(photo.photoUrl, '_blank');
    }, []);

    // Handle photo upload
    const handleUpload = useCallback(async (uploadData) => {
        const { selectedCaseId, uploadCategory, selectedFiles, uploadNote } = uploadData;

        setLoading(true);
        try {
            // Upload multiple photos
            const response = await photosApi.uploadMultiplePhotos(
                selectedCaseId,
                uploadCategory,
                selectedFiles,
                uploadNote
            );

            console.log('Upload response:', response);

            // Reload photos
            loadPhotos();

            alert(`Upload thành công ${selectedFiles.length} ảnh!`);

        } catch (error) {
            console.error('Upload error:', error);
            alert('Có lỗi khi upload. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, [loadPhotos]);

    // Effects
    useEffect(() => {
        loadPhotos();
        loadCases();
    }, [loadPhotos, loadCases]);

    useEffect(() => {
        loadPhotos();
    }, [searchTerm, currentPage, filterType, loadPhotos]);

    return {
        // State
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

        // Actions
        loadPhotos,
        loadCases,
        handleDownloadPhoto,
        handleDeletePhoto,
        handlePreviewPhoto,
        handleUpload,
    };
};
