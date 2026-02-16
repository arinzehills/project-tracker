'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { axiosInstance } from '@/core/api/axiosInstance';
import { formatApiError } from '@/core/api/utils/formatApiError';
import { refreshRegistry } from './useRefreshRegistry';
import SideToast from '@components/Toastify/SideToast';
import type { AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/core/api/types/apiResponse';

export function usePatch<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateItem = async (
    endpoint: string,
    body: unknown,
    {
      isMultipart = false,
      canToastError = true,
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
    setIsUpdating(true);
    setError(null);

    try {
      const config: AxiosRequestConfig = {
        ...customOptions,
        headers: {
          ...(isMultipart ? { 'Content-Type': undefined } : { 'Content-Type': 'application/json' }),
          ...(customOptions.headers || {}),
        },
      };

      const response = await axiosInstance.patch<ApiResponse<T>>(endpoint, body, config);
      setData(response?.data?.data || null);

      if (canToastSuccess) {
        SideToast.FireSuccess({ message: (response.data as any)?.message || 'Updated successfully' });
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
      setIsUpdating(false);
    }
  };

  return { data, error, isUpdating, updateItem };
}
