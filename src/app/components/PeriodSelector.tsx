'use client';

import { CalculationPeriod } from '@/app/types';

interface PeriodSelectorProps {
  value: CalculationPeriod;
  onChange: (period: CalculationPeriod) => void;
}

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const periods: { value: CalculationPeriod; label: string }[] = [
    { value: 'weekly', label: 'Semanal' },
    { value: 'bi-weekly', label: 'Quincenal' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'annual', label: 'Anual' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Período de Cálculo
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CalculationPeriod)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {periods.map((period) => (
          <option key={period.value} value={period.value}>
            {period.label}
          </option>
        ))}
      </select>
    </div>
  );
}

