import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BudgetData {
  year: string;
  revenue: number;
  expenses: number;
  deficit: number;
}

interface BudgetChartProps {
  data: BudgetData[];
}

export default function BudgetChart({ data }: BudgetChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#4ade80" name="Revenue" />
          <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
          <Bar dataKey="deficit" fill="#60a5fa" name="Deficit/Surplus" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}