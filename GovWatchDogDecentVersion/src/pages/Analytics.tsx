import React, { useState } from 'react';
import { useEconomicData } from '../hooks/useEconomicData';
import { useBudgetData } from '../hooks/useBudgetData';
import MetricFilter from '../components/analytics/MetricFilter';
import EconomicIndicators from '../components/charts/EconomicIndicators';
import BudgetChart from '../components/charts/BudgetChart';

export default function Analytics() {
  const [filters, setFilters] = useState({
    governmentLevel: 'federal',
    province: null,
    metric: 'gdp_growth',
  });

  const { data: economicData, isLoading: economicLoading } = useEconomicData();
  const { data: budgetData, isLoading: budgetLoading } = useBudgetData(
    filters.governmentLevel,
    filters.province
  );

  const handleFilterChange = ({ type, value }: { type: string; value: string }) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
      // Reset province if switching to federal
      ...(type === 'governmentLevel' && value === 'federal' ? { province: null } : {}),
    }));
  };

  if (economicLoading || budgetLoading) {
    return <div>Loading...</div>;
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Overview</h3>
          {budgetData && <BudgetChart data={budgetData} />}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Economic Indicators</h3>
          {economicData && (
            <EconomicIndicators
              data={economicData}
              indicators={['gdpGrowth', 'inflationRate', 'employmentGrowth']}
            />
          )}
        </div>
      </div>
    </div>
  );
}