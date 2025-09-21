import React from 'react'


/**
 * Sortable Header Component
 * Table header component with sorting functionality
 */
export const SortableHeader = ({
  label,
  sortKey,
  currentSort = { sortBy: '', sortDir: 'asc' },
  onSort,
  className = '',
  disabled = false,
  tooltip = ''
}) => {
  const isActive = currentSort.sortBy === sortKey;
  const isAsc = isActive && currentSort.sortDir === 'asc';

  const handleSort = () => {
    if (disabled || !onSort) return;

    let newSortDir = 'asc';

    if (isActive) {
      // If currently sorted by this column, toggle direction
      newSortDir = isAsc ? 'desc' : 'asc';
    }

    onSort({
      sortBy: sortKey,
      sortDir: newSortDir
    });
  };

  const getSortIcon = () => {
    if (!isActive) {
      return <span className="sort-icon sort-none">↕</span>;
    }
    if (isAsc) {
      return <span className="sort-icon sort-asc">↑</span>;
    }
    return <span className="sort-icon sort-desc">↓</span>;
  };

  return (
    <th
      className={`sortable-header ${className} ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleSort}
      title={tooltip || (disabled ? '' : `Sắp xếp theo ${label}`)}
      role="columnheader"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          handleSort();
        }
      }}
    >
      <div className="sortable-header-content">
        <span className="header-label">{label}</span>
        {getSortIcon()}
      </div>
    </th>
  );
};

/**
 * Sort Control Component
 * Dropdown control for sorting options
 */
export const SortControl = ({
  options = [],
  currentSort = { sortBy: '', sortDir: 'asc' },
  onSort,
  className = '',
  disabled = false,
  label = 'Sắp xếp theo:'
}) => {
  const handleSortByChange = (e) => {
    if (disabled) return;
    onSort({
      sortBy: e.target.value,
      sortDir: currentSort.sortDir
    });
  };

  const handleSortDirChange = (e) => {
    if (disabled) return;
    onSort({
      sortBy: currentSort.sortBy,
      sortDir: e.target.value
    });
  };

  return (
    <div className={`sort-control ${className}`}>
      <label className="sort-control-label">{label}</label>

      <div className="sort-control-inputs">
        <select
          value={currentSort.sortBy}
          onChange={handleSortByChange}
          disabled={disabled}
          className="sort-by-select"
        >
          <option value="">-- Chọn trường --</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={currentSort.sortDir}
          onChange={handleSortDirChange}
          disabled={disabled || !currentSort.sortBy}
          className="sort-dir-select"
        >
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </select>
      </div>
    </div>
  );
};

/**
 * Hook for managing sort state
 */
// useSort hook moved to separate file to avoid fast refresh issues
// TODO: Create useSort.js file for better organization

export default SortableHeader;
