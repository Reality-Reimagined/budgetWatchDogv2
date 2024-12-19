import { useState, useEffect } from 'react';
import { PaginatedResponse, BudgetData, ApiError } from '../types';

interface UseBudgetDataParams {
  governmentLevel: string;
  province?: string;
  page?: number;
  pageSize?: number;
}

export function useBudgetData({
  governmentLevel,
  province,
  page = 1,
  pageSize = 10
}: UseBudgetDataParams) {
  const [data, setData] = useState<PaginatedResponse<BudgetData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          government_level: governmentLevel,
          page: page.toString(),
          page_size: pageSize.toString()
        });

        if (province) {
          params.append('province', province);
        }

        const response = await fetch(
          `https://budgetwatchdog-production.up.railway.app/api/data?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail?.message || 'Failed to fetch budget data');
        }

        const budgetData = await response.json();
        setData(budgetData);
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : 'Failed to fetch budget data',
          status: err instanceof Error ? 500 : 500
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [governmentLevel, province, page, pageSize]);

  return { data, isLoading, error };
}