import { AV_API_KEY, AV_BASE } from '../constants';
import { FinancialYear } from '../types';

// Helper to safely parse numbers from API strings
const parseNum = (val: string | undefined): number => {
  if (!val || val === 'None') return 0;
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

// Generic fetcher
async function fetchAV(functionName: string, symbol: string) {
  const url = `${AV_BASE}?function=${functionName}&symbol=${symbol}&apikey=${AV_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json["Information"] || json["Note"] || json["Error Message"]) {
    console.warn("Alpha Vantage API Note:", json);
  }
  return json.annualReports || [];
}

export const fetchFinancialData = async (symbol: string): Promise<FinancialYear[]> => {
  const [income, balance, cashflow] = await Promise.all([
    fetchAV("INCOME_STATEMENT", symbol),
    fetchAV("BALANCE_SHEET", symbol),
    fetchAV("CASH_FLOW", symbol)
  ]);

  if (!income.length && !balance.length && !cashflow.length) {
    throw new Error("No data found for this ticker.");
  }

  // Map by year (taking last 5 years)
  // Alpha Vantage returns newest first. We need to construct a map to join tables.
  const yearsMap = new Map<string, Partial<FinancialYear>>();

  const processReport = (reports: any[], type: 'income' | 'balance' | 'cash') => {
    // Take top 5
    reports.slice(0, 5).forEach(r => {
      const year = r.fiscalDateEnding?.split('-')[0];
      if (!year) return;
      
      const current: Partial<FinancialYear> = yearsMap.get(year) || { year };
      
      if (type === 'income') {
        current.revenue = parseNum(r.totalRevenue);
        const opInc = parseNum(r.operatingIncome);
        const dep = parseNum(r.depreciationAndAmortization);
        current.ebitda = opInc + dep; 
        current.pat = parseNum(r.netIncome);
      } else if (type === 'balance') {
        current.equity = parseNum(r.totalShareholderEquity);
        const stDebt = parseNum(r.shortTermDebt);
        const ltDebt = parseNum(r.longTermDebtNoncurrent);
        // Fallback to totalLiabilities if debt not explicit
        current.debt = (stDebt + ltDebt) || parseNum(r.totalLiabilities) * 0.5; 
        current.ar = parseNum(r.currentNetReceivables);
        current.inventory = parseNum(r.inventory);
        current.cash = parseNum(r.cashAndCashEquivalentsAtCarryingValue);
        current.payables = parseNum(r.currentAccountsPayable);
        
        const stInv = parseNum(r.shortTermInvestments);
        const ltInv = parseNum(r.longTermInvestments);
        current.invAdv = stInv + ltInv;
      } else if (type === 'cash') {
        current.ocf = parseNum(r.operatingCashflow);
        const capex = parseNum(r.capitalExpenditures);
        current.fcf = current.ocf - capex;
        current.dividend = parseNum(r.dividendPayout);
      }

      yearsMap.set(year, current);
    });
  };

  processReport(income, 'income');
  processReport(balance, 'balance');
  processReport(cashflow, 'cash');

  // Convert map to array, sort ascending by year
  const sortedData = Array.from(yearsMap.values())
    .map(y => {
        // Ensure all fields exist
        return {
            year: y.year || 'Unknown',
            revenue: y.revenue || 0,
            ebitda: y.ebitda || 0,
            pat: y.pat || 0,
            ocf: y.ocf || 0,
            fcf: y.fcf || 0,
            ar: y.ar || 0,
            cash: y.cash || 0,
            equity: y.equity || 0,
            debt: y.debt || 0,
            invAdv: y.invAdv || 0,
            dividend: y.dividend || 0,
            inventory: y.inventory || 0,
            payables: y.payables || 0,
        } as FinancialYear;
    })
    .sort((a, b) => parseInt(a.year) - parseInt(b.year))
    .slice(-5); // Ensure only 5

  return sortedData;
};