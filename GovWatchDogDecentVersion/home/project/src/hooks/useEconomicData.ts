import { useState, useEffect } from 'react';
import { PaginatedResponse, EconomicData, ApiError } from '../types';

interface UseEconomicDataParams {
  metric: string;
  governmentLevel: string;
  province?: string;
  page?: number;
  pageSize?: number;
}

export function useEconomicData({
  metric,
  governmentLevel,
  province,
  page = 1,
  pageSize = 10
}: UseEconomicDataParams) {
  const [data, setData] = useState<PaginatedResponse<EconomicData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          metric,
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
          throw new Error(errorData.detail?.message || 'Failed to fetch economic data');
        }

        const economicData = await response.json();
        setData(economicData);
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : 'Failed to fetch economic data',
          status: err instanceof Error ? 500 : 500
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [metric, governmentLevel, province, page, pageSize]);

  return { data, isLoading, error };
}