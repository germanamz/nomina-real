import { useState, useEffect } from 'react';
import { CalculationResult } from '../types';
import { loadCalculations, deleteCalculation } from '../utils/storage';
import { formatCurrency, formatDate, formatPeriod } from '../utils/formatting';

interface CalculationHistoryProps {
  onSelectCalculation: (result: CalculationResult) => void;
  refreshTrigger?: number;
  isOpen?: boolean;
}

export default function CalculationHistory({
  onSelectCalculation,
  refreshTrigger,
  isOpen = true,
}: CalculationHistoryProps) {
  const [calculations, setCalculations] = useState<CalculationResult[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  // Refresh history when trigger changes (new calculation saved)
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const loadHistory = () => {
    const history = loadCalculations();
    setCalculations(history);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('¿Está seguro de eliminar este cálculo?')) {
      deleteCalculation(id);
      loadHistory();
    }
  };

  const handleSelect = (calc: CalculationResult) => {
    // Create a completely new object with all nested objects copied to ensure React detects the change
    const newCalc: CalculationResult = {
      ...calc,
      input: { ...calc.input },
      employerCosts: { ...calc.employerCosts },
      employeeDeductions: { ...calc.employeeDeductions },
      timestamp: new Date(calc.timestamp),
    };
    onSelectCalculation(newCalc);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900">Historial</h2>
        {calculations.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {calculations.length} {calculations.length === 1 ? 'cálculo' : 'cálculos'}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {calculations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No hay cálculos guardados</p>
            <p className="text-gray-400 text-xs mt-2">
              Los cálculos que realices se guardarán aquí
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {calculations.map((calc) => (
              <div
                key={calc.id}
                onClick={() => handleSelect(calc)}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-all relative group"
              >
                <button
                  onClick={(e) => handleDelete(e, calc.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-lg font-bold transition-opacity"
                  title="Eliminar"
                >
                  ×
                </button>
                <div className="pr-6">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-900 text-sm">
                      {formatCurrency(calc.grossSalary)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatPeriod(calc.period)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    Total: {formatCurrency(calc.totalCompanyCost)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(calc.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

