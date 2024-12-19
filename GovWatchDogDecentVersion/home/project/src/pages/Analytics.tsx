import React, { useState } from 'react';
import { useEconomicData } from '../hooks/useEconomicData';
import { useBudgetData } from '../hooks/useBudgetData';
import MetricFilter from '../components/analytics/MetricFilter';
import EconomicIndicators from '../components/charts/EconomicIndicators';
import BudgetChart from '../components/charts/BudgetChart';
import { AlertCircle } from 'lucide-react';

interface FilterState {
  governmentLevel: string;
  province: string | null;
  metric: string;
  page: number;
  pageSize: number;
}

export default function Analytics() {
  const [filters, setFilters] = useState<FilterState>({
    governmentLevel: 'Federal',
    province: null,
    metric: 'gdp_growth',
    page: 1,
    pageSize: 10
  });

  const { 
    data: economicData, 
    isLoading: economicLoading, 
    error: economicError 
  } = useEconomicData({
    metric: filters.metric,
    governmentLevel: filters.governmentLevel,
    province: filters.province,
    page: filters.page,
    pageSize: filters.pageSize
  });

  const { 
    data: budgetData, 
    isLoading: budgetLoading, 
    error: budgetError 
  } = useBudgetData({
    governmentLevel: filters.governmentLevel,
    province: filters.province,
    page: filters.page,
    pageSize: filters.pageSize
  });

  const handleFilterChange = ({ type, value }: { type: string; value: string }) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
      // Reset province if switching to federal
      ...(type === 'governmentLevel' && value === 'Federal' ? { province: null } : {}),
      // Reset page when filters change
      page: 1
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage
    }));
  };

  if (economicError || budgetError) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-700">
            {economicError?.message || budgetError?.message || 'An error occurred while fetching data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Analytics Dashboard</h2>
        <MetricFilter
          governmentLevel={filters.governmentLevel}
          province={filters.province}
          metric={filters.metric}
          onFilterChange={handleFilterChange}
        />
      </div>

      {(economicLoading || budgetLoading) ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Overview</h3>
            {budgetData && budgetData.items.length > 0 && (
              <>
                <BudgetChart data={budgetData.items} />
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={!budgetData.has_previous}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {filters.page} of {budgetData.total_pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={!budgetData.has_next}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Economic Indicators</h3>
            {economicData && economicData.items.length > 0 && (
              <>
                <EconomicIndicators
                  data={economicData.items}
                  indicators={['gdpGrowth', 'inflationRate', 'employmentGrowth']}
                />
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={!economicData.has_previous}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {filters.page} of {economicData.total_pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={!economicData.has_next}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}