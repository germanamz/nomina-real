import { useState, useEffect } from 'react';
import { CalculationInput, CalculationResult, IMSSRiskClassification, CalculationPeriod } from '../types';
import { MEXICAN_STATES } from '../../shared/constants';
import { calculateSalaryCosts } from '../services/calculations';
import { saveCalculation } from '../utils/storage';
import PeriodSelector from './PeriodSelector';

interface CalculatorFormProps {
  onCalculate: (result: CalculationResult) => void;
  selectedCalculation?: CalculationResult | null;
}

export default function CalculatorForm({ onCalculate, selectedCalculation }: CalculatorFormProps) {
  const [grossSalary, setGrossSalary] = useState<string>('');
  const [period, setPeriod] = useState<CalculationPeriod>('monthly');
  const [state, setState] = useState<string>('CDMX');
  const [imssRiskClassification, setImssRiskClassification] = useState<IMSSRiskClassification>('III');
  const [ptuAmount, setPtuAmount] = useState<string>('');
  const [employeeTenureYears, setEmployeeTenureYears] = useState<string>('1');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form fields when a calculation is selected from history
  useEffect(() => {
    if (selectedCalculation) {
      setGrossSalary(selectedCalculation.grossSalary.toString());
      setPeriod(selectedCalculation.period);
      setState(selectedCalculation.input.state);
      setImssRiskClassification(selectedCalculation.input.imssRiskClassification);
      setPtuAmount(selectedCalculation.input.ptuAmount ? selectedCalculation.input.ptuAmount.toString() : '');
      setEmployeeTenureYears(selectedCalculation.input.employeeTenureYears.toString());
      setErrors({});
    }
  }, [selectedCalculation]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!grossSalary || parseFloat(grossSalary) <= 0) {
      newErrors.grossSalary = 'El salario debe ser mayor a 0';
    }

    if (ptuAmount && parseFloat(ptuAmount) < 0) {
      newErrors.ptuAmount = 'El PTU no puede ser negativo';
    }

    const tenure = parseFloat(employeeTenureYears);
    if (!employeeTenureYears || isNaN(tenure) || tenure < 0) {
      newErrors.employeeTenureYears = 'La antigüedad debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const input: CalculationInput = {
      grossSalary: parseFloat(grossSalary),
      period,
      state,
      imssRiskClassification,
      ptuAmount: ptuAmount ? parseFloat(ptuAmount) : undefined,
      employeeTenureYears: parseFloat(employeeTenureYears),
    };

    const result = calculateSalaryCosts(input);
    saveCalculation(result);
    onCalculate(result);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Nuevo Cálculo</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salario Bruto
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.grossSalary ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.grossSalary && (
            <p className="mt-1 text-sm text-red-600">{errors.grossSalary}</p>
          )}
        </div>

        <PeriodSelector value={period} onChange={setPeriod} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {MEXICAN_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clasificación de Riesgo IMSS
          </label>
          <select
            value={imssRiskClassification}
            onChange={(e) => setImssRiskClassification(e.target.value as IMSSRiskClassification)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="I">Clase I (13.206%)</option>
            <option value="II">Clase II (15.206%)</option>
            <option value="III">Clase III (17.206%)</option>
            <option value="IV">Clase IV (20.206%)</option>
            <option value="V">Clase V (27.706%)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Antigüedad del Empleado (años)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={employeeTenureYears}
            onChange={(e) => setEmployeeTenureYears(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.employeeTenureYears ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="1"
          />
          {errors.employeeTenureYears && (
            <p className="mt-1 text-sm text-red-600">{errors.employeeTenureYears}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PTU (Participación de Utilidades) - Opcional
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={ptuAmount}
            onChange={(e) => setPtuAmount(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.ptuAmount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00 (opcional)"
          />
          {errors.ptuAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.ptuAmount}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Ingrese el monto del PTU para el período seleccionado
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
        >
          Calcular
        </button>
      </div>
    </form>
  );
}

