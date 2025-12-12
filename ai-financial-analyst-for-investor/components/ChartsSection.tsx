import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart
} from 'recharts';
import { FinancialYear } from '../types';

interface Props {
  data: FinancialYear[];
}

const ChartsSection: React.FC<Props> = ({ data }) => {
  // Filter out years with no data to keep charts clean
  const chartData = data.filter(d => d.revenue > 0 || d.equity > 0);

  if (chartData.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      
      {/* Revenue vs OCF */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-lg shadow border dark:border-slate-700">
        <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4">Revenue vs. Operating Cash Flow</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(val) => `${(val/1000000).toFixed(0)}M`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2} dot={{r: 4}} />
              <Line type="monotone" dataKey="ocf" name="Op. Cash Flow" stroke="#22c55e" strokeWidth={2} dot={{r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Equity vs Cash */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-lg shadow border dark:border-slate-700">
        <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4">Equity Structure</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(val) => `${(val/1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
              <Legend />
              <Bar dataKey="equity" name="Equity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="debt" name="Debt" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cash" name="Cash" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Receivables & Inventory */}
       <div className="bg-white dark:bg-slate-850 p-4 rounded-lg shadow border dark:border-slate-700">
        <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4">Working Capital Assets</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
              <Legend />
              <Bar dataKey="ar" name="Receivables" fill="#f97316" stackId="a" />
              <Bar dataKey="inventory" name="Inventory" fill="#f59e0b" stackId="a" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Margins */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-lg shadow border dark:border-slate-700">
        <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4">Profitability (Raw Values)</h3>
         <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
              <Legend />
              <Bar dataKey="ebitda" name="EBITDA" fill="#0ea5e9" />
              <Bar dataKey="pat" name="Net Profit" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
