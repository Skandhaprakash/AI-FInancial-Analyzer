import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnomalyReport } from '../types';
import { analyzeFinancialsWithGemini } from '../services/geminiService';
import { FinancialYear, CalculatedMetrics } from '../types';

interface Props {
  financials: FinancialYear[];
  metrics: CalculatedMetrics[];
}

const AgentAnalysis: React.FC<Props> = ({ financials, metrics }) => {
  const [report, setReport] = useState<AnomalyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeFinancialsWithGemini(financials, metrics);
      setReport(result);
    } catch (err) {
      setError("Failed to generate AI analysis. Check API Key or connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-black';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-850 rounded-lg shadow p-6 border dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
          <span className="text-2xl">🤖</span> AI Agent Analyst
        </h2>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`px-4 py-2 rounded-md font-medium text-white transition-all
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-purple-500/30'}`}
        >
          {loading ? 'Analyzing...' : 'Run Agent Analysis'}
        </button>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4 text-sm">{error}</div>}

      {report && (
        <div className="animate-fade-in">
          <div className="flex gap-4 mb-6 flex-wrap">
            <div className={`px-4 py-2 rounded font-bold uppercase tracking-wide text-sm flex items-center ${getRiskColor(report.riskLevel)}`}>
              Risk Level: {report.riskLevel}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Key Red Flags</h3>
            <div className="flex flex-wrap gap-2">
              {report.keyFlags.map((flag, i) => (
                <span key={i} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-sm border border-red-100 dark:border-red-800/30">
                  {flag}
                </span>
              ))}
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300">
            <ReactMarkdown>{report.analysis}</ReactMarkdown>
          </div>
        </div>
      )}

      {!report && !loading && !error && (
        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg">
          <p>Click "Run Agent Analysis" to deploy Gemini Agent on this data.</p>
        </div>
      )}
    </div>
  );
};

export default AgentAnalysis;
