export interface FinancialYear {
  year: string;
  revenue: number;
  ebitda: number;
  pat: number; // Net Profit (Profit After Tax)
  ocf: number; // Operating Cash Flow
  fcf: number; // Free Cash Flow
  ar: number; // Accounts Receivable
  cash: number;
  equity: number;
  debt: number;
  invAdv: number; // Investments / Advances
  dividend: number;
  inventory: number;
  payables: number;
}

export interface CalculatedMetrics {
  year: string;
  ebitdaMargin: number; // %
  patMargin: number; // %
  cashConversion: number; // ratio
  dso: number; // days
  equityGrowth: number; // %
  cashEquityRatio: number; // ratio
  revenueYoy: number; // %
}

export interface AnomalyReport {
  analysis: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  keyFlags: string[];
}
