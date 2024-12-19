import React from 'react';
import MetricCard from './MetricCard';
import { BarChart3, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { useBudgetData } from '../../hooks/useBudgetData';

export default function SummaryMetrics() {
  const { data: federalData } = useBudgetData('federal');
  const { data: ontarioData } = useBudgetData('provincial', 'Ontario');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Federal Debt-to-GDP"
        value="31.8%"
        change="-1.2% from last year"
        changeType="positive"
        icon={Percent}
      />
      <MetricCard
        title="Ontario Budget Balance"
        value="$-6.6B"
        change="-2.1% from projection"
        changeType="negative"
        icon={DollarSign}
      />
      <MetricCard
        title="GDP Growth Rate"
        value="2.4%"
        change="+0.3% from last quarter"
        changeType="positive"
        icon={TrendingUp}
      />
      <MetricCard
        title="Reports Generated"
        value="1,234"
        change="+12% this month"
        changeType="positive"
        icon={BarChart3}
      />
    </div>
  );
}