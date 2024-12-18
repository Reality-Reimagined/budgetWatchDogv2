import React, { useState } from 'react';
import { generateReport } from '../lib/api';
import ReportRequestForm from '../components/forms/ReportRequestForm';
import ReportContent from '../components/report/ReportContent';
import ReportActions from '../components/report/ReportActions';
import type { ReportRequest, ReportResponse } from '../types';

export default function RequestReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ReportResponse | null>(null);

  const handleSubmit = async (data: ReportRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateReport(data);
      setReport(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (report) {
      window.open(report.filePath, '_blank');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleExportPDF = () => {
    // Implement PDF export functionality
    console.log('Export to PDF');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Generate Financial Report</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!report ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ReportRequestForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Report Results</h2>
              <ReportActions
                onDownload={handleDownload}
                onShare={handleShare}
                onExportPDF={handleExportPDF}
                onPrint={handlePrint}
              />
            </div>
            <ReportContent report={report} />
          </div>
        </div>
      )}
    </div>
  );
}