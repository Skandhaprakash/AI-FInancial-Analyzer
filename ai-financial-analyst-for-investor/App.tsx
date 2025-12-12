import React, { useState, useEffect, useMemo } from 'react';
import { FinancialYear } from './types';
import { INITIAL_DATA } from './constants';
import { calculateMetrics } from './services/metricsService';
import { fetchFinancialData } from './services/alphaVantageService';
import FinancialTable from './components/FinancialTable';
import MetricsTable from './components/MetricsTable';
import ChartsSection from './components/ChartsSection';
import AgentAnalysis from './components/AgentAnalysis';
import { SunIcon, MoonIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

function App() {
  const [data, setData] = useState<FinancialYear[]>(INITIAL_DATA);
  const [ticker, setTicker] = useState('NEWGEN');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'analysis'>('input');
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  // Computed Metrics
  const metrics = useMemo(() => calculateMetrics(data), [data]);

  const handleSearch = async () => {
    if (!ticker) return;
    setLoading(true);
    try {
      const fetchedData = await fetchFinancialData(ticker);
      // Merge fetched data with the structure to ensure we have 5 years
      const merged = [...INITIAL_DATA];
      fetchedData.forEach((item, index) => {
        if (index < 5) merged[index] = { ...merged[index], ...item };
      });
      setData(merged);
    } catch (error) {
      alert("Error fetching data. Ensure API Key is valid or enter manually.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (index: number, field: keyof FinancialYear, value: number) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);
  };

  const handleExportCSV = () => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${ticker}_financials.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
              AI
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">
              Financial Auditor
            </h1>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:hidden">
              FinAudit
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {installPrompt && (
              <button
                onClick={handleInstallApp}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1.5 px-3 rounded-full transition-colors animate-pulse"
              >
                <DevicePhoneMobileIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
              </button>
            )}

            <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-md p-1">
              <input 
                type="text" 
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="Ticker"
                className="bg-transparent border-none focus:ring-0 text-sm w-16 sm:w-24 px-2 dark:text-white"
              />
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors disabled:opacity-50"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 border-b dark:border-slate-800 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('input')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'input' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Data & Metrics
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'analysis'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            AI Analysis & Charts
          </button>
        </div>

        {activeTab === 'input' && (
          <div className="space-y-8 animate-fade-in">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Input Financials (FY21–FY25)</h2>
                <button onClick={handleExportCSV} className="text-sm flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  <ArrowDownTrayIcon className="w-4 h-4" /> Export
                </button>
              </div>
              <FinancialTable data={data} onChange={handleDataChange} />
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Derived Metrics</h2>
              <MetricsTable metrics={metrics} />
            </section>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-8 animate-fade-in">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 order-2 lg:order-1">
                 <div className="bg-blue-50 dark:bg-slate-800/50 p-6 rounded-lg border border-blue-100 dark:border-slate-700">
                    <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">How it works</h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                      The "Agentic" workflow sends raw financials + calculated metrics to the Gemini API. 
                      A virtual Persona (Senior Auditor) analyzes patterns like cash conversion divergence 
                      and margin compression.
                    </p>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      <strong>Model:</strong> Gemini 2.5 Flash<br/>
                      <strong>Cost:</strong> ~$0.0001 per run
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-2 order-1 lg:order-2">
                <AgentAnalysis financials={data} metrics={metrics} />
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Visual Trends</h2>
              <ChartsSection data={data} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;