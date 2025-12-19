'use client';

import { useEffect, useState } from 'react';
import { CalculationResult, CalculationPeriod } from '@/app/types';
import {
  formatCurrency,
  formatPeriod,
  formatPeriodLabel,
  formatAnnualLabel,
  formatBenefitName,
} from '@/app/lib/utils/formatting';

/**
 * Convert period amount to annual for backward compatibility
 */
function convertToAnnual(amount: number, period: CalculationPeriod): number {
  switch (period) {
    case 'weekly':
      return amount * 52;
    case 'bi-weekly':
      return amount * 24;
    case 'monthly':
      return amount * 12;
    case 'annual':
      return amount;
  }
}

interface CalculationSummaryProps {
  result: CalculationResult;
}

interface SummaryRowProps {
  label: string;
  periodValue: number | null;
  annualValue: number;
  isTotal?: boolean;
  isSectionHeader?: boolean;
}

function SummaryRow({
  label,
  periodValue,
  annualValue,
  isTotal = false,
  isSectionHeader = false,
}: SummaryRowProps) {
  const displayPeriod = periodValue !== null ? formatCurrency(periodValue) : '-';
  const displayAnnual = formatCurrency(annualValue);

  if (isSectionHeader) {
    return (
      <tr className="bg-gray-100">
        <td colSpan={3} className="px-4 py-3 font-semibold text-gray-900">
          {label}
        </td>
      </tr>
    );
  }

  return (
    <tr className={isTotal ? 'border-t-2 border-gray-400' : 'border-b border-gray-200'}>
      <td className="px-4 py-2 text-gray-700">{label}</td>
      <td className={`px-4 py-2 text-right ${isTotal ? 'font-bold' : 'font-medium'}`}>
        {displayPeriod}
      </td>
      <td className={`px-4 py-2 text-right ${isTotal ? 'font-bold text-blue-700' : 'font-medium'}`}>
        {displayAnnual}
      </td>
    </tr>
  );
}

export default function CalculationSummary({ result }: CalculationSummaryProps) {
  const [displayResult, setDisplayResult] = useState<CalculationResult>(result);

  useEffect(() => {
    setDisplayResult(result);
  }, [result]);

  const {
    employerCosts,
    employeeDeductions,
    grossSalary,
    netSalary,
    totalCompanyCost,
    period,
    additionalBenefitsBreakdown,
  } = displayResult;

  // Handle backward compatibility: calculate annual values if missing
  const grossSalaryAnnual =
    'grossSalaryAnnual' in displayResult
      ? displayResult.grossSalaryAnnual
      : convertToAnnual(grossSalary, period);
  const employerCostsAnnual =
    'employerCostsAnnual' in displayResult
      ? displayResult.employerCostsAnnual
      : {
          imss: convertToAnnual(employerCosts.imss, period),
          sar: convertToAnnual(employerCosts.sar, period),
          infonavit: convertToAnnual(employerCosts.infonavit, period),
          statePayrollTax: convertToAnnual(employerCosts.statePayrollTax, period),
          aguinaldo: convertToAnnual(employerCosts.aguinaldo, period),
          vacationPremium: convertToAnnual(employerCosts.vacationPremium, period),
          ptu: convertToAnnual(employerCosts.ptu, period),
          additionalBenefits: convertToAnnual(
            'additionalBenefits' in employerCosts ? employerCosts.additionalBenefits : 0,
            period
          ),
          total: convertToAnnual(employerCosts.total, period),
        };
  const employeeDeductionsAnnual =
    'employeeDeductionsAnnual' in displayResult
      ? displayResult.employeeDeductionsAnnual
      : {
          isr: convertToAnnual(employeeDeductions.isr, period),
          imss: convertToAnnual(employeeDeductions.imss, period),
          sar: convertToAnnual(employeeDeductions.sar, period),
          total: convertToAnnual(employeeDeductions.total, period),
        };
  const netSalaryAnnual =
    'netSalaryAnnual' in displayResult
      ? displayResult.netSalaryAnnual
      : convertToAnnual(netSalary, period);
  const totalCompanyCostAnnual =
    'totalCompanyCostAnnual' in displayResult
      ? displayResult.totalCompanyCostAnnual
      : convertToAnnual(totalCompanyCost, period);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Resumen del Cálculo ({formatPeriod(period)})
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900"></th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                {formatPeriodLabel(period)}
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-blue-700">
                {formatAnnualLabel()}
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Base Salary */}
            <SummaryRow
              label="Salario Base"
              periodValue={grossSalary}
              annualValue={grossSalaryAnnual}
            />

            {/* Additional Benefits & Bonuses */}
            <SummaryRow label="Beneficios Adicionales y Bonos" periodValue={null} annualValue={0} isSectionHeader />

            {additionalBenefitsBreakdown ? (
              <>
                <SummaryRow
                  label={formatBenefitName('aguinaldo')}
                  periodValue={additionalBenefitsBreakdown.aguinaldo.period}
                  annualValue={additionalBenefitsBreakdown.aguinaldo.annual}
                />
                <SummaryRow
                  label={formatBenefitName('vacationPremium')}
                  periodValue={additionalBenefitsBreakdown.vacationPremium.period}
                  annualValue={additionalBenefitsBreakdown.vacationPremium.annual}
                />
                {additionalBenefitsBreakdown.ptu.annual > 0 && (
                  <SummaryRow
                    label={formatBenefitName('ptu')}
                    periodValue={additionalBenefitsBreakdown.ptu.period}
                    annualValue={additionalBenefitsBreakdown.ptu.annual}
                  />
                )}
                {additionalBenefitsBreakdown.performanceBonus && (
                  <SummaryRow
                    label={formatBenefitName('performanceBonus')}
                    periodValue={additionalBenefitsBreakdown.performanceBonus.period}
                    annualValue={additionalBenefitsBreakdown.performanceBonus.annual}
                  />
                )}
                {additionalBenefitsBreakdown.signingBonus && (
                  <SummaryRow
                    label={formatBenefitName('signingBonus')}
                    periodValue={additionalBenefitsBreakdown.signingBonus.period}
                    annualValue={additionalBenefitsBreakdown.signingBonus.annual}
                  />
                )}
                {additionalBenefitsBreakdown.retentionBonus && (
                  <SummaryRow
                    label={formatBenefitName('retentionBonus')}
                    periodValue={additionalBenefitsBreakdown.retentionBonus.period}
                    annualValue={additionalBenefitsBreakdown.retentionBonus.annual}
                  />
                )}
                {additionalBenefitsBreakdown.mealVouchers && (
                  <SummaryRow
                    label={formatBenefitName('mealVouchers')}
                    periodValue={additionalBenefitsBreakdown.mealVouchers.period}
                    annualValue={additionalBenefitsBreakdown.mealVouchers.annual}
                  />
                )}
                {additionalBenefitsBreakdown.transportation && (
                  <SummaryRow
                    label={formatBenefitName('transportation')}
                    periodValue={additionalBenefitsBreakdown.transportation.period}
                    annualValue={additionalBenefitsBreakdown.transportation.annual}
                  />
                )}
                {additionalBenefitsBreakdown.healthInsurance && (
                  <SummaryRow
                    label={formatBenefitName('healthInsurance')}
                    periodValue={additionalBenefitsBreakdown.healthInsurance.period}
                    annualValue={additionalBenefitsBreakdown.healthInsurance.annual}
                  />
                )}
                {additionalBenefitsBreakdown.lifeInsurance && (
                  <SummaryRow
                    label={formatBenefitName('lifeInsurance')}
                    periodValue={additionalBenefitsBreakdown.lifeInsurance.period}
                    annualValue={additionalBenefitsBreakdown.lifeInsurance.annual}
                  />
                )}
                {additionalBenefitsBreakdown.other &&
                  additionalBenefitsBreakdown.other.map((benefit) => (
                    <SummaryRow
                      key={benefit.name}
                      label={benefit.name}
                      periodValue={benefit.breakdown.period}
                      annualValue={benefit.breakdown.annual}
                    />
                  ))}
              </>
            ) : (
              // Fallback for backward compatibility with old calculations
              <>
                <SummaryRow
                  label={formatBenefitName('aguinaldo')}
                  periodValue={employerCosts.aguinaldo}
                  annualValue={employerCostsAnnual.aguinaldo}
                />
                <SummaryRow
                  label={formatBenefitName('vacationPremium')}
                  periodValue={employerCosts.vacationPremium}
                  annualValue={employerCostsAnnual.vacationPremium}
                />
                {employerCosts.ptu > 0 && (
                  <SummaryRow
                    label={formatBenefitName('ptu')}
                    periodValue={employerCosts.ptu}
                    annualValue={employerCostsAnnual.ptu}
                  />
                )}
              </>
            )}

            {/* Employer Costs */}
            <SummaryRow label="Costos para la Empresa" periodValue={null} annualValue={0} isSectionHeader />

            <SummaryRow
              label="IMSS (Patrón)"
              periodValue={employerCosts.imss}
              annualValue={employerCostsAnnual.imss}
            />
            <SummaryRow
              label="SAR (Patrón)"
              periodValue={employerCosts.sar}
              annualValue={employerCostsAnnual.sar}
            />
            <SummaryRow
              label="INFONAVIT"
              periodValue={employerCosts.infonavit}
              annualValue={employerCostsAnnual.infonavit}
            />
            <SummaryRow
              label="Impuesto Estatal sobre Nómina"
              periodValue={employerCosts.statePayrollTax}
              annualValue={employerCostsAnnual.statePayrollTax}
            />
            <SummaryRow
              label="Total Beneficios"
              periodValue={
                employerCosts.aguinaldo +
                employerCosts.vacationPremium +
                employerCosts.ptu +
                ('additionalBenefits' in employerCosts ? employerCosts.additionalBenefits : 0)
              }
              annualValue={
                employerCostsAnnual.aguinaldo +
                employerCostsAnnual.vacationPremium +
                employerCostsAnnual.ptu +
                employerCostsAnnual.additionalBenefits
              }
              isTotal
            />
            <SummaryRow
              label="Total Costos para la Empresa"
              periodValue={employerCosts.total}
              annualValue={employerCostsAnnual.total}
              isTotal
            />

            {/* Employee Deductions */}
            <SummaryRow label="Deducciones del Empleado" periodValue={null} annualValue={0} isSectionHeader />

            <SummaryRow
              label="ISR (Impuesto sobre la Renta)"
              periodValue={employeeDeductions.isr}
              annualValue={employeeDeductionsAnnual.isr}
            />
            <SummaryRow
              label="IMSS (Trabajador)"
              periodValue={employeeDeductions.imss}
              annualValue={employeeDeductionsAnnual.imss}
            />
            <SummaryRow
              label="SAR (Trabajador)"
              periodValue={employeeDeductions.sar}
              annualValue={employeeDeductionsAnnual.sar}
            />
            <SummaryRow
              label="Total Deducciones"
              periodValue={employeeDeductions.total}
              annualValue={employeeDeductionsAnnual.total}
              isTotal
            />

            {/* Final Totals */}
            <SummaryRow label="Totales Finales" periodValue={null} annualValue={0} isSectionHeader />

            <SummaryRow
              label="Salario Bruto"
              periodValue={grossSalary}
              annualValue={grossSalaryAnnual}
            />
            <SummaryRow
              label="Salario Neto (Empleado)"
              periodValue={netSalary}
              annualValue={netSalaryAnnual}
            />
            <SummaryRow
              label="Costo Total para la Empresa"
              periodValue={totalCompanyCost}
              annualValue={totalCompanyCostAnnual}
              isTotal
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

