import { useState } from 'react';

export type ViewMode = 'list' | 'grid';

export const useProjectView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const toggleView = () => {
    setViewMode((prev) => (prev === 'list' ? 'grid' : 'list'));
  };

  return {
    viewMode,
    setViewMode,
    toggleView,
    isList: viewMode === 'list',
    isGrid: viewMode === 'grid',
  };
};
