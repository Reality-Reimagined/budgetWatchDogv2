import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface IndicatorData {
  date: string;
  gdpGrowth?: number;
  inflationRate?: number;
  employmentGrowth?: number;
}

interface EconomicIndicatorsProps {
  data: IndicatorData[];
  indicators: ('gdpGrowth' | 'inflationRate' | 'employmentGrowth')[];
}

const indicatorConfig = {
  gdpGrowth: { color: '#4ade80', name: 'GDP Growth' },
  inflationRate: { color: '#f87171', name: 'Inflation Rate' },
  employmentGrowth: { color: '#60a5fa', name: 'Employment Growth' },
};

export default function EconomicIndicators({ data, indicators }: EconomicIndicatorsProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {indicators.map((indicator) => (
            <Line
              key={indicator}
              type="monotone"
              dataKey={indicator}
              stroke={indicatorConfig[indicator].color}
              name={indicatorConfig[indicator].name}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}