'use client';

import { CACHE_DURATIONS, useGet } from './useGet';
import type { Project } from '@/modules/projects/types/project';

interface UseProjectsOptions {
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  canRunImmediately?: boolean;
}

export const useProjects = ({
  status,
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  canRunImmediately = true,
}: UseProjectsOptions = {}) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  params.append('sortBy', sortBy);
  params.append('sortOrder', sortOrder);

  const queryString = params.toString();
  const endpoint = queryString ? `/projects?${queryString}` : '/projects';

  const { data, error, isLoading, refetch } = useGet<Project[]>(
    endpoint,
    canRunImmediately,
    CACHE_DURATIONS.HALF_MINUTE, // 5 minute cache
    {},
    'projects' // Register for automatic refetching
  );

  return {
    projects: data || [],
    loading: isLoading,
    error,
    refetch,
  };
};