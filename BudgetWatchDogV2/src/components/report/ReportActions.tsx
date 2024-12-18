import React from 'react';
import { FileDown, Share2, FileText, Printer } from 'lucide-react';

interface ReportActionsProps {
  onDownload: () => void;
  onShare: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
}

export default function ReportActions({
  onDownload,
  onShare,
  onExportPDF,
  onPrint,
}: ReportActionsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={onDownload}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        <FileDown className="h-4 w-4 mr-2" />
        Download Report
      </button>
      <button
        onClick={onShare}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </button>
      <button
        onClick={onExportPDF}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <FileText className="h-4 w-4 mr-2" />
        Export PDF
      </button>
      <button
        onClick={onPrint}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print
      </button>
    </div>
  );
}