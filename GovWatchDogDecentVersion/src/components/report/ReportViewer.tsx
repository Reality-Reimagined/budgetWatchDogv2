import React from 'react';
import { FileDown, Share2 } from 'lucide-react';
import type { ReportResponse } from '../../types';

interface ReportViewerProps {
  report: ReportResponse;
}

export default function ReportViewer({ report }: ReportViewerProps) {
  const handleDownload = () => {
    window.open(report.filePath, '_blank');
  };

  const handleShare = () => {
    // Implement sharing functionality
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Report Results</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Download Report
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {report.graphs.map((graph, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4">
            <img src={graph} alt={`Graph ${index + 1}`} className="w-full h-auto" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
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