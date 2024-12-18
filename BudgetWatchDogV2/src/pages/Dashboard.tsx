import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp } from 'lucide-react';
import SummaryMetrics from '../components/metrics/SummaryMetrics';
import BudgetChart from '../components/charts/BudgetChart';
import EconomicIndicators from '../components/charts/EconomicIndicators';

export default function Dashboard() {
  // Mock data - replace with actual API calls
  const budgetData = [
    { year: '2020', revenue: 300.5, expenses: 350.2, deficit: -49.7 },
    { year: '2021', revenue: 310.8, expenses: 365.5, deficit: -54.7 },
    { year: '2022', revenue: 325.2, expenses: 370.1, deficit: -44.9 },
    { year: '2023', revenue: 340.6, expenses: 380.2, deficit: -39.6 },
  ];

  const economicData = [
    { date: '2023-Q1', gdpGrowth: 2.1, inflationRate: 3.2, employmentGrowth: 1.5 },
    { date: '2023-Q2', gdpGrowth: 2.3, inflationRate: 3.0, employmentGrowth: 1.7 },
    { date: '2023-Q3', gdpGrowth: 2.4, inflationRate: 2.8, employmentGrowth: 1.8 },
    { date: '2023-Q4', gdpGrowth: 2.5, inflationRate: 2.7, employmentGrowth: 1.9 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
        <div className="flex space-x-4">
          <Link
            to="/request-report"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Link>
          <Link
            to="/analytics"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Analytics
          </Link>
        </div>
      </div>

      <SummaryMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Budget Overview</h2>
          <BudgetChart data={budgetData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Economic Indicators</h2>
          <EconomicIndicators 
            data={economicData}
            indicators={['gdpGrowth', 'inflationRate', 'employmentGrowth']}
          />
        </div>
      </div>
    </div>
  );
}