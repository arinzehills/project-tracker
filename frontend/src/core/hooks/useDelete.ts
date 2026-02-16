'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { axiosInstance } from '@/core/api/axiosInstance';
import { formatApiError } from '@/core/api/utils/formatApiError';
import { refreshRegistry } from './useRefreshRegistry';
import SideToast from '@components/Toastify/SideToast';
import type { AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/core/api/types/apiResponse';

export function useDelete<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteItem = async (
    endpoint: string,
    {
      canToastError = true,
      canToastSuccess = true,
      invalidate,
    }: {
      canToastError?: boolean;
      canToastSuccess?: boolean;
      invalidate?: string | string[];
    } = {},
    customOptions: AxiosRequestConfig = {}
  ): Promise<T | null> => {
    setIsDeleting(true);
    setError(null);

    try {
      const config: AxiosRequestConfig = {
        ...customOptions,
        headers: {
          'Content-Type': 'application/json',
          ...(customOptions.headers || {}),
        },
      };

      const response = await axiosInstance.delete<ApiResponse<T>>(endpoint, config);
      setData(response?.data?.data || null);

      if (canToastSuccess) {
        SideToast.FireSuccess({ message: (response.data as any)?.message || 'Deleted successfully' });
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
      setIsDeleting(false);
    }
  };

  return { data, error, isDeleting, deleteItem };
}
