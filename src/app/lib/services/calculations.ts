import Decimal from 'decimal.js';
import {
  CalculationInput,
  CalculationResult,
  CalculationPeriod,
  EmployerCosts,
  EmployeeDeductions,
  AdditionalBenefits,
} from '@/app/types';
import {
  SAR_EMPLOYER_RATE,
  SAR_EMPLOYEE_RATE,
  INFONAVIT_RATE,
  MEXICAN_STATES,
} from '../constants';
import { calculateISR } from './isr';
import { calculateIMSSEmployer, calculateIMSSEmployee } from './imss';
import {
  calculateAguinaldo,
  calculateVacationPremium,
  calculatePTU,
} from './benefits';

/**
 * Convert salary from any period to annual
 */
function convertToAnnual(salary: number, period: CalculationPeriod): number {
  const amount = new Decimal(salary);

  switch (period) {
    case 'weekly':
      return amount.times(52).toNumber();
    case 'bi-weekly':
      // Quincenal: twice per month (15th and last day) = 24 pay periods per year
      return amount.times(24).toNumber();
    case 'monthly':
      return amount.times(12).toNumber();
    case 'annual':
      return amount.toNumber();
  }
}

/**
 * Convert annual amount to specified period
 */
function convertFromAnnual(
  annualAmount: number,
  period: CalculationPeriod
): number {
  const amount = new Decimal(annualAmount);

  switch (period) {
    case 'weekly':
      return amount.dividedBy(52).toNumber();
    case 'bi-weekly':
      // Quincenal: twice per month (15th and last day) = 24 pay periods per year
      return amount.dividedBy(24).toNumber();
    case 'monthly':
      return amount.dividedBy(12).toNumber();
    case 'annual':
      return amount.toNumber();
  }
}

/**
 * Calculate daily salary from period salary
 */
function calculateDailySalary(
  salary: number,
  period: CalculationPeriod
): number {
  const annual = convertToAnnual(salary, period);
  return new Decimal(annual).dividedBy(365).toNumber();
}

/**
 * Get state payroll tax rate
 */
function getStatePayrollTaxRate(stateCode: string): number {
  const state = MEXICAN_STATES.find((s) => s.code === stateCode);
  return state?.payrollTaxRate || 2.0; // Default to 2% if not found
}

/**
 * Convert additional benefits to annual amounts
 */
function convertAdditionalBenefitsToAnnual(
  benefits: AdditionalBenefits | undefined,
  period: CalculationPeriod
): {
  performanceBonus: number;
  signingBonus: number;
  retentionBonus: number;
  mealVouchers: number;
  transportation: number;
  healthInsurance: number;
  lifeInsurance: number;
  other: Array<{ name: string; annual: number }>;
  total: number;
} {
  if (!benefits) {
    return {
      performanceBonus: 0,
      signingBonus: 0,
      retentionBonus: 0,
      mealVouchers: 0,
      transportation: 0,
      healthInsurance: 0,
      lifeInsurance: 0,
      other: [],
      total: 0,
    };
  }

  const performanceBonus = benefits.performanceBonus || 0;
  const signingBonus = benefits.signingBonus || 0;
  const retentionBonus = benefits.retentionBonus || 0;

  // Convert period-based benefits to annual
  const mealVouchers = benefits.mealVouchers
    ? convertToAnnual(benefits.mealVouchers, period)
    : 0;
  const transportation = benefits.transportation
    ? convertToAnnual(benefits.transportation, period)
    : 0;
  const healthInsurance = benefits.healthInsurance
    ? convertToAnnual(benefits.healthInsurance, period)
    : 0;
  const lifeInsurance = benefits.lifeInsurance
    ? convertToAnnual(benefits.lifeInsurance, period)
    : 0;

  // Convert other benefits
  const other = (benefits.other || []).map((benefit) => ({
    name: benefit.name,
    annual: benefit.isAnnual
      ? benefit.amount
      : convertToAnnual(benefit.amount, period),
  }));

  const total = new Decimal(performanceBonus)
    .plus(signingBonus)
    .plus(retentionBonus)
    .plus(mealVouchers)
    .plus(transportation)
    .plus(healthInsurance)
    .plus(lifeInsurance)
    .plus(other.reduce((sum, b) => sum.plus(b.annual), new Decimal(0)))
    .toNumber();

  return {
    performanceBonus,
    signingBonus,
    retentionBonus,
    mealVouchers,
    transportation,
    healthInsurance,
    lifeInsurance,
    other,
    total,
  };
}

/**
 * Main calculation function
 */
export function calculateSalaryCosts(
  input: CalculationInput
): CalculationResult {
  const {
    grossSalary,
    period,
    state,
    imssRiskClassification,
    ptuAmount,
    employeeTenureYears,
    additionalBenefits,
  } = input;

  // Convert to annual for calculations
  const annualSalary = convertToAnnual(grossSalary, period);
  const dailySalary = calculateDailySalary(grossSalary, period);

  // Calculate additional benefits (annual)
  const additionalBenefitsAnnual = convertAdditionalBenefitsToAnnual(
    additionalBenefits,
    period
  );

  // Calculate period amounts for additional benefits
  const additionalBenefitsPeriod = {
    performanceBonus: convertFromAnnual(
      additionalBenefitsAnnual.performanceBonus,
      period
    ),
    signingBonus: convertFromAnnual(
      additionalBenefitsAnnual.signingBonus,
      period
    ),
    retentionBonus: convertFromAnnual(
      additionalBenefitsAnnual.retentionBonus,
      period
    ),
    mealVouchers: additionalBenefits?.mealVouchers || 0,
    transportation: additionalBenefits?.transportation || 0,
    healthInsurance: additionalBenefits?.healthInsurance || 0,
    lifeInsurance: additionalBenefits?.lifeInsurance || 0,
    other: (additionalBenefits?.other || []).map((benefit) => ({
      name: benefit.name,
      period: benefit.isAnnual
        ? convertFromAnnual(benefit.amount, period)
        : benefit.amount,
    })),
    total: convertFromAnnual(additionalBenefitsAnnual.total, period),
  };

  // Employer Costs (Period)
  const imssEmployerPeriod = convertFromAnnual(
    calculateIMSSEmployer(annualSalary, imssRiskClassification),
    period
  );

  const sarEmployerPeriod = convertFromAnnual(
    new Decimal(annualSalary)
      .times(SAR_EMPLOYER_RATE)
      .dividedBy(100)
      .toNumber(),
    period
  );

  const infonavitPeriod = convertFromAnnual(
    new Decimal(annualSalary).times(INFONAVIT_RATE).dividedBy(100).toNumber(),
    period
  );

  const statePayrollTaxRate = getStatePayrollTaxRate(state);
  const statePayrollTaxPeriod = convertFromAnnual(
    new Decimal(annualSalary)
      .times(statePayrollTaxRate)
      .dividedBy(100)
      .toNumber(),
    period
  );

  const aguinaldoPeriod = calculateAguinaldo(dailySalary, period);
  const vacationPremiumPeriod = calculateVacationPremium(
    dailySalary,
    employeeTenureYears,
    period
  );
  const ptuPeriod = ptuAmount
    ? calculatePTU(convertToAnnual(ptuAmount, period), period)
    : 0;

  // Employer Costs (Annual)
  const imssEmployerAnnual = calculateIMSSEmployer(
    annualSalary,
    imssRiskClassification
  );
  const sarEmployerAnnual = new Decimal(annualSalary)
    .times(SAR_EMPLOYER_RATE)
    .dividedBy(100)
    .toNumber();
  const infonavitAnnual = new Decimal(annualSalary)
    .times(INFONAVIT_RATE)
    .dividedBy(100)
    .toNumber();
  const statePayrollTaxAnnual = new Decimal(annualSalary)
    .times(statePayrollTaxRate)
    .dividedBy(100)
    .toNumber();
  const aguinaldoAnnual = convertToAnnual(aguinaldoPeriod, period);
  const vacationPremiumAnnual = convertToAnnual(vacationPremiumPeriod, period);
  const ptuAnnual = ptuAmount ? convertToAnnual(ptuAmount, period) : 0;

  const employerCostsPeriod: EmployerCosts = {
    imss: imssEmployerPeriod,
    sar: sarEmployerPeriod,
    infonavit: infonavitPeriod,
    statePayrollTax: statePayrollTaxPeriod,
    aguinaldo: aguinaldoPeriod,
    vacationPremium: vacationPremiumPeriod,
    ptu: ptuPeriod,
    additionalBenefits: additionalBenefitsPeriod.total,
    total: new Decimal(imssEmployerPeriod)
      .plus(sarEmployerPeriod)
      .plus(infonavitPeriod)
      .plus(statePayrollTaxPeriod)
      .plus(aguinaldoPeriod)
      .plus(vacationPremiumPeriod)
      .plus(ptuPeriod)
      .plus(additionalBenefitsPeriod.total)
      .toNumber(),
  };

  const employerCostsAnnual: EmployerCosts = {
    imss: imssEmployerAnnual,
    sar: sarEmployerAnnual,
    infonavit: infonavitAnnual,
    statePayrollTax: statePayrollTaxAnnual,
    aguinaldo: aguinaldoAnnual,
    vacationPremium: vacationPremiumAnnual,
    ptu: ptuAnnual,
    additionalBenefits: additionalBenefitsAnnual.total,
    total: new Decimal(imssEmployerAnnual)
      .plus(sarEmployerAnnual)
      .plus(infonavitAnnual)
      .plus(statePayrollTaxAnnual)
      .plus(aguinaldoAnnual)
      .plus(vacationPremiumAnnual)
      .plus(ptuAnnual)
      .plus(additionalBenefitsAnnual.total)
      .toNumber(),
  };

  // Employee Deductions (Period)
  const isrPeriod = convertFromAnnual(calculateISR(annualSalary), period);
  const imssEmployeePeriod = convertFromAnnual(
    calculateIMSSEmployee(annualSalary),
    period
  );
  const sarEmployeePeriod = convertFromAnnual(
    new Decimal(annualSalary)
      .times(SAR_EMPLOYEE_RATE)
      .dividedBy(100)
      .toNumber(),
    period
  );

  const employeeDeductionsPeriod: EmployeeDeductions = {
    isr: isrPeriod,
    imss: imssEmployeePeriod,
    sar: sarEmployeePeriod,
    total: new Decimal(isrPeriod)
      .plus(imssEmployeePeriod)
      .plus(sarEmployeePeriod)
      .toNumber(),
  };

  // Employee Deductions (Annual)
  const isrAnnual = calculateISR(annualSalary);
  const imssEmployeeAnnual = calculateIMSSEmployee(annualSalary);
  const sarEmployeeAnnual = new Decimal(annualSalary)
    .times(SAR_EMPLOYEE_RATE)
    .dividedBy(100)
    .toNumber();

  const employeeDeductionsAnnual: EmployeeDeductions = {
    isr: isrAnnual,
    imss: imssEmployeeAnnual,
    sar: sarEmployeeAnnual,
    total: new Decimal(isrAnnual)
      .plus(imssEmployeeAnnual)
      .plus(sarEmployeeAnnual)
      .toNumber(),
  };

  // Final calculations
  const netSalaryPeriod = new Decimal(grossSalary)
    .minus(employeeDeductionsPeriod.total)
    .toNumber();
  const netSalaryAnnual = new Decimal(annualSalary)
    .minus(employeeDeductionsAnnual.total)
    .toNumber();
  const totalCompanyCostPeriod = new Decimal(grossSalary)
    .plus(employerCostsPeriod.total)
    .toNumber();
  const totalCompanyCostAnnual = new Decimal(annualSalary)
    .plus(employerCostsAnnual.total)
    .toNumber();

  // Build additional benefits breakdown
  const additionalBenefitsBreakdown: CalculationResult['additionalBenefitsBreakdown'] =
    {
      aguinaldo: {
        period: aguinaldoPeriod,
        annual: aguinaldoAnnual,
      },
      vacationPremium: {
        period: vacationPremiumPeriod,
        annual: vacationPremiumAnnual,
      },
      ptu: {
        period: ptuPeriod,
        annual: ptuAnnual,
      },
    };

  if (additionalBenefitsAnnual.performanceBonus > 0) {
    additionalBenefitsBreakdown.performanceBonus = {
      period: additionalBenefitsPeriod.performanceBonus,
      annual: additionalBenefitsAnnual.performanceBonus,
    };
  }

  if (additionalBenefitsAnnual.signingBonus > 0) {
    additionalBenefitsBreakdown.signingBonus = {
      period: additionalBenefitsPeriod.signingBonus,
      annual: additionalBenefitsAnnual.signingBonus,
    };
  }

  if (additionalBenefitsAnnual.retentionBonus > 0) {
    additionalBenefitsBreakdown.retentionBonus = {
      period: additionalBenefitsPeriod.retentionBonus,
      annual: additionalBenefitsAnnual.retentionBonus,
    };
  }

  if (additionalBenefitsAnnual.mealVouchers > 0) {
    additionalBenefitsBreakdown.mealVouchers = {
      period: additionalBenefitsPeriod.mealVouchers,
      annual: additionalBenefitsAnnual.mealVouchers,
    };
  }

  if (additionalBenefitsAnnual.transportation > 0) {
    additionalBenefitsBreakdown.transportation = {
      period: additionalBenefitsPeriod.transportation,
      annual: additionalBenefitsAnnual.transportation,
    };
  }

  if (additionalBenefitsAnnual.healthInsurance > 0) {
    additionalBenefitsBreakdown.healthInsurance = {
      period: additionalBenefitsPeriod.healthInsurance,
      annual: additionalBenefitsAnnual.healthInsurance,
    };
  }

  if (additionalBenefitsAnnual.lifeInsurance > 0) {
    additionalBenefitsBreakdown.lifeInsurance = {
      period: additionalBenefitsPeriod.lifeInsurance,
      annual: additionalBenefitsAnnual.lifeInsurance,
    };
  }

  if (additionalBenefitsAnnual.other.length > 0) {
    additionalBenefitsBreakdown.other = additionalBenefitsAnnual.other.map(
      (benefit) => ({
        name: benefit.name,
        breakdown: {
          period:
            additionalBenefitsPeriod.other.find((o) => o.name === benefit.name)
              ?.period || 0,
          annual: benefit.annual,
        },
      })
    );
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    input,
    grossSalary,
    grossSalaryAnnual: annualSalary,
    employerCosts: employerCostsPeriod,
    employerCostsAnnual,
    employeeDeductions: employeeDeductionsPeriod,
    employeeDeductionsAnnual,
    netSalary: netSalaryPeriod,
    netSalaryAnnual,
    totalCompanyCost: totalCompanyCostPeriod,
    totalCompanyCostAnnual,
    period,
    additionalBenefitsBreakdown,
  };
}
