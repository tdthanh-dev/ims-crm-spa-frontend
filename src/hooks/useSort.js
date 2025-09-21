import { useState, useCallback } from 'react';

/**
 * Custom hook for managing sort state
 * @param {Object} initialSort - Initial sort configuration
 * @returns {Object} Sort state and handlers
 */
export const useSort = (initialSort = { sortBy: '', sortDir: 'asc' }) => {
    const [sort, setSort] = useState(initialSort);

    const handleSort = useCallback((newSort) => {
        setSort(newSort);
    }, []);

    const resetSort = useCallback(() => {
        setSort(initialSort);
    }, [initialSort]);

    const isActive = useCallback((sortKey) => {
        return sort.sortBy === sortKey;
    }, [sort.sortBy]);

    const getDirection = useCallback((sortKey) => {
        return sort.sortBy === sortKey ? sort.sortDir : null;
    }, [sort.sortBy, sort.sortDir]);

    return {
        sort,
        handleSort,
        resetSort,
        isActive,
        getDirection,
        // Legacy compatibility
        sortBy: sort.sortBy,
        sortDir: sort.sortDir
    };
};

export default useSort;
