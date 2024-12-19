import { useState, useEffect } from 'react';

interface BudgetData {
  years: string[];
  revenue: number[];
  expenses: number[];
  deficit: number[];
}

export function useBudgetData(governmentLevel: string, province?: string) {
  const [data, setData] = useState<BudgetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://budgetwatchdog-production.up.railway.app/api/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            government_level: governmentLevel,
            province,
            dataset: 'budget',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch budget data');
        }

        const budgetData = await response.json();
        setData(budgetData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch budget data'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [governmentLevel, province]);

  return { data, isLoading, error };
}