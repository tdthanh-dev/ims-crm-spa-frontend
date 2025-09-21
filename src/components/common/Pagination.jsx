import React from 'react'


/**
 * Pagination Component
 * Reusable pagination component for API responses
 */
export const Pagination = ({
  currentPage = 0,
  totalPages = 0,
  totalElements = 0,
  pageSize = 20,
  onPageChange,
  onPageSizeChange,
  className = '',
  showPageSizeSelector = true,
  showInfo = true,
  disabled = false
}) => {
  // Calculate display values
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 1;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    range.push(1);

    // Calculate start and end of middle range
    const start = Math.max(2, currentPage + 1 - delta);
    const end = Math.min(totalPages - 1, currentPage + 1 + delta);

    // Add dots if there's a gap after first page
    if (start > 2) {
      rangeWithDots.push(1);
      if (start > 3) {
        rangeWithDots.push('...');
      }
    }

    // Add middle range
    for (let i = start; i <= end; i++) {
      rangeWithDots.push(i);
    }

    // Add dots if there's a gap before last page
    if (end < totalPages - 1) {
      if (end < totalPages - 2) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(totalPages);
    }

    // If we only have one page or start equals 1, just return simple range
    if (totalPages <= 1) {
      return [1];
    }
    
    if (start === 1) {
      for (let i = 1; i <= Math.min(totalPages, end + 1); i++) {
        range.push(i);
      }
      if (end + 1 < totalPages) {
        range.push('...');
        range.push(totalPages);
      }
      return range;
    }

    return rangeWithDots;
  };

  const handlePageChange = (page) => {
    if (disabled || page < 0 || page >= totalPages) return;
    onPageChange?.(page);
  };

  const handlePageSizeChange = (newSize) => {
    if (disabled) return;
    onPageSizeChange?.(newSize);
  };

  if (totalPages <= 1 && !showInfo) {
    return null;
  }

  return (
    <div className={`pagination-container ${className}`}>
      {/* Pagination Info */}
      {showInfo && (
        <div className="pagination-info">
          <span>
            Hiển thị {startItem}-{endItem} trong tổng số {totalElements} kết quả
          </span>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        {/* Previous Page Button */}
        <button
          className={`pagination-btn prev ${isFirstPage ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={disabled || isFirstPage}
          title="Trang trước"
        >
          ‹
        </button>

        {/* Page Numbers */}
        <div className="pagination-pages">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="pagination-dots">...</span>
              ) : (
                <button
                  className={`pagination-btn page ${
                    page === currentPage + 1 ? 'active' : ''
                  }`}
                  onClick={() => handlePageChange(page - 1)}
                  disabled={disabled}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Page Button */}
        <button
          className={`pagination-btn next ${isLastPage ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={disabled || isLastPage}
          title="Trang sau"
        >
          ›
        </button>
      </div>

      {/* Page Size Selector */}
      {showPageSizeSelector && (
        <div className="pagination-size-selector">
          <label htmlFor="pageSize">Hiển thị:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            disabled={disabled}
            className="page-size-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>/ trang</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
