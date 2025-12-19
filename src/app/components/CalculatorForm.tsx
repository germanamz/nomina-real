'use client';

import { useState, useEffect } from 'react';
import { CalculationInput, CalculationResult, IMSSRiskClassification, CalculationPeriod, AdditionalBenefits, AdditionalBenefit } from '@/app/types';
import { MEXICAN_STATES } from '@/app/lib/constants';
import { calculateSalaryCosts } from '@/app/lib/services/calculations';
import { saveCalculation } from '@/app/lib/utils/storage';
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
  const [showAdditionalBenefits, setShowAdditionalBenefits] = useState<boolean>(false);
  const [performanceBonus, setPerformanceBonus] = useState<string>('');
  const [signingBonus, setSigningBonus] = useState<string>('');
  const [retentionBonus, setRetentionBonus] = useState<string>('');
  const [mealVouchers, setMealVouchers] = useState<string>('');
  const [transportation, setTransportation] = useState<string>('');
  const [healthInsurance, setHealthInsurance] = useState<string>('');
  const [lifeInsurance, setLifeInsurance] = useState<string>('');
  const [otherBenefits, setOtherBenefits] = useState<Array<{ name: string; amount: string; isAnnual: boolean }>>([]);

  // Update form fields when a calculation is selected from history
  useEffect(() => {
    if (selectedCalculation) {
      setGrossSalary(selectedCalculation.grossSalary.toString());
      setPeriod(selectedCalculation.period);
      setState(selectedCalculation.input.state);
      setImssRiskClassification(selectedCalculation.input.imssRiskClassification);
      setPtuAmount(selectedCalculation.input.ptuAmount ? selectedCalculation.input.ptuAmount.toString() : '');
      setEmployeeTenureYears(selectedCalculation.input.employeeTenureYears.toString());
      
      // Load additional benefits if they exist
      if (selectedCalculation.input.additionalBenefits) {
        const ab = selectedCalculation.input.additionalBenefits;
        setPerformanceBonus(ab.performanceBonus?.toString() || '');
        setSigningBonus(ab.signingBonus?.toString() || '');
        setRetentionBonus(ab.retentionBonus?.toString() || '');
        setMealVouchers(ab.mealVouchers?.toString() || '');
        setTransportation(ab.transportation?.toString() || '');
        setHealthInsurance(ab.healthInsurance?.toString() || '');
        setLifeInsurance(ab.lifeInsurance?.toString() || '');
        setOtherBenefits(ab.other?.map(b => ({ name: b.name, amount: b.amount.toString(), isAnnual: b.isAnnual })) || []);
        setShowAdditionalBenefits(true);
      } else {
        setShowAdditionalBenefits(false);
      }
      
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

  const addOtherBenefit = () => {
    setOtherBenefits([...otherBenefits, { name: '', amount: '', isAnnual: false }]);
  };

  const removeOtherBenefit = (index: number) => {
    setOtherBenefits(otherBenefits.filter((_, i) => i !== index));
  };

  const updateOtherBenefit = (index: number, field: 'name' | 'amount' | 'isAnnual', value: string | boolean) => {
    const updated = [...otherBenefits];
    updated[index] = { ...updated[index], [field]: value };
    setOtherBenefits(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Build additional benefits object
    const additionalBenefits: AdditionalBenefits | undefined = 
      performanceBonus || signingBonus || retentionBonus || mealVouchers || 
      transportation || healthInsurance || lifeInsurance || otherBenefits.length > 0
        ? {
            performanceBonus: performanceBonus ? parseFloat(performanceBonus) : undefined,
            signingBonus: signingBonus ? parseFloat(signingBonus) : undefined,
            retentionBonus: retentionBonus ? parseFloat(retentionBonus) : undefined,
            mealVouchers: mealVouchers ? parseFloat(mealVouchers) : undefined,
            transportation: transportation ? parseFloat(transportation) : undefined,
            healthInsurance: healthInsurance ? parseFloat(healthInsurance) : undefined,
            lifeInsurance: lifeInsurance ? parseFloat(lifeInsurance) : undefined,
            other: otherBenefits
              .filter(b => b.name && b.amount)
              .map(b => ({
                name: b.name,
                amount: parseFloat(b.amount),
                isAnnual: b.isAnnual,
              })),
          }
        : undefined;

    const input: CalculationInput = {
      grossSalary: parseFloat(grossSalary),
      period,
      state,
      imssRiskClassification,
      ptuAmount: ptuAmount ? parseFloat(ptuAmount) : undefined,
      employeeTenureYears: parseFloat(employeeTenureYears),
      additionalBenefits,
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

        {/* Additional Benefits Section */}
        <div className="border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => setShowAdditionalBenefits(!showAdditionalBenefits)}
            className="w-full flex items-center justify-between text-left text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <span>Beneficios Adicionales y Bonos (Opcional)</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                showAdditionalBenefits ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdditionalBenefits && (
            <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bono de Desempeño (Anual)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={performanceBonus}
                  onChange={(e) => setPerformanceBonus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bono de Contratación (Una vez, anualizado)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={signingBonus}
                  onChange={(e) => setSigningBonus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bono de Retención (Anual)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={retentionBonus}
                  onChange={(e) => setRetentionBonus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vales de Comida (Por período)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={mealVouchers}
                  onChange={(e) => setMealVouchers(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transporte (Por período)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={transportation}
                  onChange={(e) => setTransportation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seguro de Salud (Por período, contribución del empleador)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={healthInsurance}
                  onChange={(e) => setHealthInsurance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seguro de Vida (Por período, contribución del empleador)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={lifeInsurance}
                  onChange={(e) => setLifeInsurance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              {/* Other Benefits */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Otros Bonos
                  </label>
                  <button
                    type="button"
                    onClick={addOtherBenefit}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Agregar
                  </button>
                </div>
                {otherBenefits.map((benefit, index) => (
                  <div key={index} className="mb-3 p-3 bg-gray-50 rounded-md space-y-2">
                    <input
                      type="text"
                      value={benefit.name}
                      onChange={(e) => updateOtherBenefit(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nombre del bono"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={benefit.amount}
                        onChange={(e) => updateOtherBenefit(index, 'amount', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Monto"
                      />
                      <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white">
                        <input
                          type="checkbox"
                          checked={benefit.isAnnual}
                          onChange={(e) => updateOtherBenefit(index, 'isAnnual', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">Anual</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeOtherBenefit(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

