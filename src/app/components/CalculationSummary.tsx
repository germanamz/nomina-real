'use client';

import { useEffect, useState } from 'react';
import { CalculationResult } from '@/app/types';
import { formatCurrency, formatPeriod } from '@/app/lib/utils/formatting';

interface CalculationSummaryProps {
  result: CalculationResult;
}

export default function CalculationSummary({ result }: CalculationSummaryProps) {
  const [displayResult, setDisplayResult] = useState<CalculationResult>(result);

  useEffect(() => {
    // Update display result when prop changes
    setDisplayResult(result);
  }, [result]);

  const { employerCosts, employeeDeductions, grossSalary, netSalary, totalCompanyCost, period } = displayResult;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Resumen del Cálculo ({formatPeriod(period)})
      </h2>

      {/* Employer Costs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Costos para la Empresa</h3>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">IMSS (Patrón)</span>
            <span className="font-medium">{formatCurrency(employerCosts.imss)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">SAR (Patrón)</span>
            <span className="font-medium">{formatCurrency(employerCosts.sar)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">INFONAVIT</span>
            <span className="font-medium">{formatCurrency(employerCosts.infonavit)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">Impuesto Estatal sobre Nómina</span>
            <span className="font-medium">{formatCurrency(employerCosts.statePayrollTax)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">Aguinaldo</span>
            <span className="font-medium">{formatCurrency(employerCosts.aguinaldo)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">Prima Vacacional</span>
            <span className="font-medium">{formatCurrency(employerCosts.vacationPremium)}</span>
          </div>
          {employerCosts.ptu > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700">PTU</span>
              <span className="font-medium">{formatCurrency(employerCosts.ptu)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 mt-4 border-t-2 border-gray-300">
            <span className="text-lg font-semibold text-gray-900">Total Costos Adicionales</span>
            <span className="text-lg font-semibold text-gray-900">{formatCurrency(employerCosts.total)}</span>
          </div>
        </div>
      </div>

      {/* Employee Deductions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Deducciones del Empleado</h3>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">ISR (Impuesto sobre la Renta)</span>
            <span className="font-medium">{formatCurrency(employeeDeductions.isr)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">IMSS (Trabajador)</span>
            <span className="font-medium">{formatCurrency(employeeDeductions.imss)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">SAR (Trabajador)</span>
            <span className="font-medium">{formatCurrency(employeeDeductions.sar)}</span>
          </div>
          <div className="flex justify-between py-3 mt-4 border-t-2 border-gray-300">
            <span className="text-lg font-semibold text-gray-900">Total Deducciones</span>
            <span className="text-lg font-semibold text-gray-900">{formatCurrency(employeeDeductions.total)}</span>
          </div>
        </div>
      </div>

      {/* Final Totals */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Salario Bruto</span>
          <span className="font-medium text-gray-900">{formatCurrency(grossSalary)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Salario Neto (Empleado)</span>
          <span className="font-semibold text-green-700 text-lg">{formatCurrency(netSalary)}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
          <span className="text-xl font-bold text-gray-900">Costo Total para la Empresa</span>
          <span className="text-xl font-bold text-blue-700">{formatCurrency(totalCompanyCost)}</span>
        </div>
      </div>
    </div>
  );
}

