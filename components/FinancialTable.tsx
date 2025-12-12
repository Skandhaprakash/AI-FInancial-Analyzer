import React from 'react';
import { FinancialYear } from '../types';

interface Props {
  data: FinancialYear[];
  onChange: (index: number, field: keyof FinancialYear, value: number) => void;
}

const formatNumber = (num: number) => num === 0 ? '' : num.toString();

const FinancialTable: React.FC<Props> = ({ data, onChange }) => {
  const fields: { key: keyof FinancialYear; label: string }[] = [
    { key: 'revenue', label: 'Revenue' },
    { key: 'ebitda', label: 'EBITDA' },
    { key: 'pat', label: 'Net Profit (PAT)' },
    { key: 'ocf', label: 'Op. Cash Flow' },
    { key: 'fcf', label: 'Free Cash Flow' },
    { key: 'ar', label: 'Receivables (AR)' },
    { key: 'cash', label: 'Cash Balance' },
    { key: 'equity', label: 'Equity' },
    { key: 'debt', label: 'Total Debt' },
    { key: 'invAdv', label: 'Investments' },
    { key: 'dividend', label: 'Dividends' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'payables', label: 'Payables' },
  ];

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm dark:border-slate-700 bg-white dark:bg-slate-850">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-900 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3 sticky left-0 bg-gray-50 dark:bg-slate-900 z-10">Metric</th>
            {data.map((row) => (
              <th key={row.year} className="px-4 py-3 min-w-[120px]">
                {row.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.key} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800">
              <td className="px-4 py-2 font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-slate-850 z-10">
                {field.label}
              </td>
              {data.map((row, idx) => (
                <td key={`${row.year}-${field.key}`} className="px-2 py-1">
                  <input
                    type="number"
                    className="w-full bg-transparent border border-gray-200 dark:border-slate-700 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none text-right dark:text-gray-200"
                    value={formatNumber(row[field.key] as number)}
                    onChange={(e) => onChange(idx, field.key, parseFloat(e.target.value) || 0)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialTable;
