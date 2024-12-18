import React from 'react';

interface MetricFilterProps {
  governmentLevel: string;
  province: string | null;
  metric: string;
  onFilterChange: (filter: { type: string; value: string }) => void;
}

export default function MetricFilter({
  governmentLevel,
  province,
  metric,
  onFilterChange,
}: MetricFilterProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Government Level</label>
        <select
          value={governmentLevel}
          onChange={(e) => onFilterChange({ type: 'governmentLevel', value: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="federal">Federal</option>
          <option value="provincial">Provincial</option>
        </select>
      </div>

      {governmentLevel === 'provincial' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Province</label>
          <select
            value={province || ''}
            onChange={(e) => onFilterChange({ type: 'province', value: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Province</option>
            <option value="Ontario">Ontario</option>
            {/* Add other provinces as needed */}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Metric</label>
        <select
          value={metric}
          onChange={(e) => onFilterChange({ type: 'metric', value: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="gdp_growth">GDP Growth</option>
          <option value="inflation_rate">Inflation Rate</option>
          <option value="employment_growth">Employment Growth</option>
          <option value="debt_to_gdp">Debt to GDP</option>
        </select>
      </div>
    </div>
  );
}