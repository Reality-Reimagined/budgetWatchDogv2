import { useState, useEffect } from 'react';

interface EconomicData {
  gdpGrowth: number[];
  inflationRate: number[];
  employmentGrowth: number[];
  years: string[];
  months: string[];
}

export function useEconomicData() {
  const [data, setData] = useState<EconomicData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [gdpResponse, inflationResponse, employmentResponse] = await Promise.all([
          fetch('https://budgetwatchdog-production.up.railway.app/api/data?metric=gdp_growth'),
          fetch('https://budgetwatchdog-production.up.railway.app/api/data?metric=inflation_rate'),
          fetch('https://budgetwatchdog-production.up.railway.app/api/data?metric=employment_growth'),
        ]);

        const [gdpData, inflationData, employmentData] = await Promise.all([
          gdpResponse.json(),
          inflationResponse.json(),
          employmentResponse.json(),
        ]);

        setData({
          gdpGrowth: gdpData.values,
          inflationRate: inflationData.values,
          employmentGrowth: employmentData.values,
          years: gdpData.years,
          months: inflationData.months,
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch economic data'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading, error };
}