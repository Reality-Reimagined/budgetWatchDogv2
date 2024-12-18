export interface ReportRequest {
  governmentLevel: 'Federal' | 'Province';
  province?: string | null;
  reportType: 'Full Report' | 'Summary Report' | 'Specific Section';
  userName: string;
  email: string;
}

export interface ReportResponse {
  filePath: string;
  graphs: string[];
  tables: {
    [key: string]: string;
  }[];
}

export interface FinancialMetrics {
  gdpGrowth: number;
  debtToGDP: number;
  employmentRate: number;
  deficit: number;
  revenue: number;
  expenses: number;
}

export interface ApiError {
  message: string;
  status: number;
}