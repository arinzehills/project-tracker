'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@iconify/react';

interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: { value: string; label: string }[];
}

interface ActiveFilterChipsProps {
  filters: Record<string, any>;
  filterFields: FilterField[];
  onRemoveFilter: (key: string) => void;
  onClearAll?: () => void;
}

const ActiveFilterChips = ({
  filters,
  filterFields,
  onRemoveFilter,
  onClearAll,
}: ActiveFilterChipsProps) => {
  const getFilterDisplayValue = (key: string, value: any): string => {
    const field = filterFields.find((f) => f.key === key);
    if (!field) return String(value);

    if (field.type === 'select' && field.options) {
      const stringValue = typeof value === 'boolean' ? String(value) : value;
      const option = field.options.find((opt) => opt.value === stringValue);
      return option?.label || String(value);
    }

    return String(value);
  };

  const getFilterLabel = (key: string): string => {
    const field = filterFields.find((f) => f.key === key);
    return field?.label || key;
  };

  const activeFilters = Object.entries(filters).filter(
    ([, value]) => {
      if (value === undefined || value === null || value === '') return false;
      return true;
    }
  );

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <span className="text-sm font-medium text-gray-700">Active Filters:</span>
      {activeFilters.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 rounded-full text-sm"
        >
          <span className="font-medium text-gray-700">{getFilterLabel(key)}:</span>
          <span className="text-gray-600">{getFilterDisplayValue(key, value)}</span>
          <button
            onClick={() => onRemoveFilter(key)}
            className="ml-1 hover:bg-gray-100 rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${getFilterLabel(key)} filter`}
          >
            <Icon icon="mdi:close" className="text-gray-500 hover:text-gray-700" width={16} />
          </button>
        </div>
      ))}
      {onClearAll && activeFilters.length > 0 && (
        <button
          onClick={onClearAll}
          className="ml-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-full transition-colors font-medium"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default ActiveFilterChips;
