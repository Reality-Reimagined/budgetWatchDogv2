import React from 'react';
import type { ReportResponse } from '../../types';

interface ReportContentProps {
  report: ReportResponse;
}

export default function ReportContent({ report }: ReportContentProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {report.graphs.map((graph, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4">
            <img src={graph} alt={`Graph ${index + 1}`} className="w-full h-auto" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Data</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(report.tables[0] || {}).map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {report.tables.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}