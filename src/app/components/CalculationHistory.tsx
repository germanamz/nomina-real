'use client';

import { useState, useEffect } from 'react';
import { CalculationResult } from '@/app/types';
import { loadCalculations, deleteCalculation, clearAllCalculations } from '@/app/lib/utils/storage';
import { formatCurrency, formatDate, formatPeriod } from '@/app/lib/utils/formatting';
import { MEXICAN_STATES } from '@/app/lib/constants';

interface CalculationHistoryProps {
  onSelectCalculation: (result: CalculationResult) => void;
  refreshTrigger?: number;
  isOpen?: boolean;
  onHistoryCleared?: () => void;
}

export default function CalculationHistory({
  onSelectCalculation,
  refreshTrigger,
  isOpen = true,
  onHistoryCleared,
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

  const handleClearAll = () => {
    if (window.confirm('¿Está seguro de eliminar todo el historial? Esta acción no se puede deshacer.')) {
      clearAllCalculations();
      loadHistory();
      if (onHistoryCleared) {
        onHistoryCleared();
      }
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
      // Copy annual fields if they exist
      ...('grossSalaryAnnual' in calc && { grossSalaryAnnual: calc.grossSalaryAnnual }),
      ...('employerCostsAnnual' in calc && { employerCostsAnnual: calc.employerCostsAnnual }),
      ...('employeeDeductionsAnnual' in calc && { employeeDeductionsAnnual: calc.employeeDeductionsAnnual }),
      ...('netSalaryAnnual' in calc && { netSalaryAnnual: calc.netSalaryAnnual }),
      ...('totalCompanyCostAnnual' in calc && { totalCompanyCostAnnual: calc.totalCompanyCostAnnual }),
      ...('additionalBenefitsBreakdown' in calc && { additionalBenefitsBreakdown: calc.additionalBenefitsBreakdown }),
    };
    onSelectCalculation(newCalc);
  };

  const getStateName = (stateCode: string): string => {
    const state = MEXICAN_STATES.find(s => s.code === stateCode);
    return state ? state.name : stateCode;
  };

  const getRiskClassLabel = (riskClass: string): string => {
    return `Clase ${riskClass}`;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Historial</h2>
          {calculations.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
              title="Limpiar todo el historial"
            >
              Limpiar
            </button>
          )}
        </div>
        {calculations.length > 0 && (
          <p className="text-xs text-gray-500">
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-600">
                      Total: {formatCurrency(calc.totalCompanyCost)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                      {getRiskClassLabel(calc.input.imssRiskClassification)}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                      {getStateName(calc.input.state)}
                    </span>
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

