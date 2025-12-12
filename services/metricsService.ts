import { FinancialYear, CalculatedMetrics } from '../types';

export const calculateMetrics = (data: FinancialYear[]): CalculatedMetrics[] => {
  return data.map((row, idx) => {
    const prev = idx > 0 ? data[idx - 1] : null;

    const ebitdaMargin = row.revenue ? (row.ebitda / row.revenue) * 100 : 0;
    const patMargin = row.revenue ? (row.pat / row.revenue) * 100 : 0;
    const cashConversion = row.ebitda ? row.ocf / row.ebitda : 0;
    const dso = row.revenue ? (row.ar / row.revenue) * 365 : 0;
    
    const equityGrowth = (prev && prev.equity) 
      ? ((row.equity - prev.equity) / prev.equity) * 100 
      : 0;

    const cashEquityRatio = row.equity ? row.cash / row.equity : 0;
    
    const revenueYoy = (prev && prev.revenue) 
      ? ((row.revenue - prev.revenue) / prev.revenue) * 100 
      : 0;

    return {
      year: row.year,
      ebitdaMargin,
      patMargin,
      cashConversion,
      dso,
      equityGrowth,
      cashEquityRatio,
      revenueYoy
    };
  });
};
