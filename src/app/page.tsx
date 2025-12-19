'use client';

import { useState } from 'react';
import CalculatorForm from './components/CalculatorForm';
import CalculationSummary from './components/CalculationSummary';
import CalculationHistory from './components/CalculationHistory';
import { CalculationResult } from './types';

export default function Home() {
  const [currentCalculation, setCurrentCalculation] = useState<CalculationResult | null>(null);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
  const [summaryKey, setSummaryKey] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleCalculate = (result: CalculationResult) => {
    setCurrentCalculation(result);
    setSummaryKey(prev => prev + 1);
    // Trigger history refresh
    setHistoryRefreshTrigger(prev => prev + 1);
  };

  const handleSelectFromHistory = (calc: CalculationResult) => {
    // Increment key first to force remount
    setSummaryKey(prev => prev + 1);
    // Then set the calculation - React will batch these but the key change forces remount
    setCurrentCalculation(calc);
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-80' : 'w-0'
        } overflow-hidden flex-shrink-0`}
      >
        <CalculationHistory
          onSelectCalculation={handleSelectFromHistory}
          refreshTrigger={historyRefreshTrigger}
          isOpen={sidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with toggle button */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {sidebarOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              IMSS Calculator
            </h1>
            <p className="text-sm text-gray-600">
              Calculate total employee salary costs in Mexico
            </p>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <CalculatorForm 
              onCalculate={handleCalculate} 
              selectedCalculation={currentCalculation}
            />
            {currentCalculation && (
              <CalculationSummary key={`calc-${currentCalculation.id}-${summaryKey}`} result={currentCalculation} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

