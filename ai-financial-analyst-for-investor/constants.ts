import { FinancialYear } from './types';

// Alpha Vantage Config (Ideally this should be proxied in production to hide key)
// Using the key provided in the prompt for continuity.
export const AV_API_KEY = "NW3UXNYOJGUSJCR2"; 
export const AV_BASE = "https://www.alphavantage.co/query";

export const INITIAL_DATA: FinancialYear[] = [
  { year: 'FY21', revenue: 0, ebitda: 0, pat: 0, ocf: 0, fcf: 0, ar: 0, cash: 0, equity: 0, debt: 0, invAdv: 0, dividend: 0, inventory: 0, payables: 0 },
  { year: 'FY22', revenue: 0, ebitda: 0, pat: 0, ocf: 0, fcf: 0, ar: 0, cash: 0, equity: 0, debt: 0, invAdv: 0, dividend: 0, inventory: 0, payables: 0 },
  { year: 'FY23', revenue: 0, ebitda: 0, pat: 0, ocf: 0, fcf: 0, ar: 0, cash: 0, equity: 0, debt: 0, invAdv: 0, dividend: 0, inventory: 0, payables: 0 },
  { year: 'FY24', revenue: 0, ebitda: 0, pat: 0, ocf: 0, fcf: 0, ar: 0, cash: 0, equity: 0, debt: 0, invAdv: 0, dividend: 0, inventory: 0, payables: 0 },
  { year: 'FY25', revenue: 0, ebitda: 0, pat: 0, ocf: 0, fcf: 0, ar: 0, cash: 0, equity: 0, debt: 0, invAdv: 0, dividend: 0, inventory: 0, payables: 0 },
];
