'use client';

import { useState } from 'react';

export interface FilterField {
  key: string;
  label: string;
  type: 'select' | 'text' | 'checkbox';
  options?: { value: string; label: string }[];
}

export const useProjectFilters = () => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch('');
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (key: string) => {
    setFilters((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleClearAllFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || search;

  return {
    // State
    filters,
    search,
    hasActiveFilters,

    // Handlers
    handleSearchChange,
    clearSearch,
    handleFilterChange,
    handleRemoveFilter,
    handleClearAllFilters,
  };
};
