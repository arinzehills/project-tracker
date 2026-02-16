'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { axiosInstance } from '@/core/api/axiosInstance';
import { formatApiError } from '@/core/api/utils/formatApiError';
import { refreshRegistry } from './useRefreshRegistry';
import SideToast from '@components/Toastify/SideToast';
import type { ApiResponse } from '@/core/api/types/apiResponse';
import type { AxiosRequestConfig } from 'axios';

export function usePost<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (
    endpoint: string,
    body: unknown,
    {
      isMultipart = false,
      canToastError = false,
      canToastSuccess = true,
      invalidate,
    }: {
      isMultipart?: boolean;
      canToastError?: boolean;
      canToastSuccess?: boolean;
      invalidate?: string | string[];
    } = {},
    customOptions: AxiosRequestConfig = {}
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const config: AxiosRequestConfig = {
        ...customOptions,
        headers: {
          ...(isMultipart ? { 'Content-Type': undefined } : { 'Content-Type': 'application/json' }),
          ...(customOptions.headers || {}),
        },
      };

      const response = await axiosInstance.post<ApiResponse<T>>(endpoint, body, config);
      setData(response?.data?.data || null);

      if (canToastSuccess) {
        SideToast.FireSuccess({ message: (response.data as any)?.message || 'Success' });
      }

      if (invalidate) {
        refreshRegistry.invalidate(invalidate);
      }

      return response.data.data || null;
    } catch (err) {
      const formattedError = formatApiError(err);
      setError(formattedError);
      if (canToastError) SideToast.FireError({ message: formattedError });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, execute };
}
