'use client';

import { useState, useEffect } from 'react';
import { axiosInstance } from '@/core/api/axiosInstance';
import { formatApiError } from '@/core/api/utils/formatApiError';
import { refreshRegistry } from './useRefreshRegistry';
import type { AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/core/api/types/apiResponse';

export const CACHE_DURATIONS = {
  HALF_MINUTE: 0.5 * 60 * 1000,
  ONE_MINUTE: 1 * 60 * 1000,
  TWO_MINUTES: 2.5 * 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  TWO_HOURS: 2 * 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  TWO_DAYS: 48 * 60 * 60 * 1000,
};

const cache = new Map<string, { data: unknown; timestamp: number }>();

refreshRegistry.setCache(cache);

interface UseGetReturn<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => void;
}

export function useGet<T = unknown>(
  endpoint: string,
  canRunImmediately: boolean = true,
  cacheDuration: number | null = null,
  options: AxiosRequestConfig = {},
  resourceName?: string
): UseGetReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cacheKey = `${endpoint}${JSON.stringify(options)}`;
  const shouldUseCache = typeof cacheDuration === 'number';

  const fetchData = async (forceRefresh = false) => {
    if (!forceRefresh && shouldUseCache) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < (cacheDuration ?? 0)) {
        setData(cached.data as T);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<ApiResponse<T>>(endpoint, options);
      const responseData = response.data.data;
      setData(responseData);

      if (shouldUseCache) {
        cache.set(cacheKey, {
          data: responseData,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      const formattedError = formatApiError(err);
      setError(formattedError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (endpoint && canRunImmediately) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, canRunImmediately]);

  useEffect(() => {
    if (resourceName) {
      return refreshRegistry.register(resourceName, () => fetchData(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceName, cacheKey]);

  return {
    data,
    error,
    isLoading,
    refetch: () => fetchData(true),
  };
}
