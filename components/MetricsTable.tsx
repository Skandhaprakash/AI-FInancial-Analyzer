import React from 'react';
import { CalculatedMetrics } from '../types';

interface Props {
  metrics: CalculatedMetrics[];
}

const MetricsTable: React.FC<Props> = ({ metrics }) => {
  const formatPercent = (val: number) => val.toFixed(1) + '%';
  const formatRatio = (val: number) => val.toFixed(2) + 'x';
  const formatDays = (val: number) => val.toFixed(0) + 'd';

  const rows = [
    { label: 'EBITDA Margin', key: 'ebitdaMargin', fmt: formatPercent },
    { label: 'PAT Margin', key: 'patMargin', fmt: formatPercent },
    { label: 'Cash Conversion', key: 'cashConversion', fmt: formatRatio },
    { label: 'DSO', key: 'dso', fmt: formatDays },
    { label: 'Equity Growth', key: 'equityGrowth', fmt: formatPercent },
    { label: 'Cash/Equity', key: 'cashEquityRatio', fmt: formatRatio },
    { label: 'Revenue YoY', key: 'revenueYoy', fmt: formatPercent },
  ] as const;

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm dark:border-slate-700 bg-white dark:bg-slate-850 mt-6">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-blue-50 dark:bg-slate-900 dark:text-blue-300">
          <tr>
            <th className="px-4 py-3 sticky left-0 bg-blue-50 dark:bg-slate-900">Derived Metric</th>
            {metrics.map((m) => (
              <th key={m.year} className="px-4 py-3 text-right">{m.year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800">
              <td className="px-4 py-2 font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-slate-850">
                {r.label}
              </td>
              {metrics.map((m) => (
                <td key={`${m.year}-${r.key}`} className="px-4 py-2 text-right text-gray-600 dark:text-gray-300 font-mono">
                  {r.fmt(m[r.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MetricsTable;
