import Decimal from 'decimal.js';
import {
  CalculationInput,
  CalculationResult,
  CalculationPeriod,
  EmployerCosts,
  EmployeeDeductions,
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
function convertFromAnnual(annualAmount: number, period: CalculationPeriod): number {
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
function calculateDailySalary(salary: number, period: CalculationPeriod): number {
  const annual = convertToAnnual(salary, period);
  return new Decimal(annual).dividedBy(365).toNumber();
}

/**
 * Get state payroll tax rate
 */
function getStatePayrollTaxRate(stateCode: string): number {
  const state = MEXICAN_STATES.find(s => s.code === stateCode);
  return state?.payrollTaxRate || 2.0; // Default to 2% if not found
}

/**
 * Main calculation function
 */
export function calculateSalaryCosts(input: CalculationInput): CalculationResult {
  const { grossSalary, period, state, imssRiskClassification, ptuAmount, employeeTenureYears } = input;
  
  // Convert to annual for calculations
  const annualSalary = convertToAnnual(grossSalary, period);
  const dailySalary = calculateDailySalary(grossSalary, period);
  
  // Employer Costs
  const imssEmployer = convertFromAnnual(
    calculateIMSSEmployer(annualSalary, imssRiskClassification),
    period
  );
  
  const sarEmployer = convertFromAnnual(
    new Decimal(annualSalary).times(SAR_EMPLOYER_RATE).dividedBy(100).toNumber(),
    period
  );
  
  const infonavit = convertFromAnnual(
    new Decimal(annualSalary).times(INFONAVIT_RATE).dividedBy(100).toNumber(),
    period
  );
  
  const statePayrollTaxRate = getStatePayrollTaxRate(state);
  const statePayrollTax = convertFromAnnual(
    new Decimal(annualSalary).times(statePayrollTaxRate).dividedBy(100).toNumber(),
    period
  );
  
  const aguinaldo = calculateAguinaldo(dailySalary, period);
  const vacationPremium = calculateVacationPremium(dailySalary, employeeTenureYears, period);
  const ptu = ptuAmount ? calculatePTU(convertToAnnual(ptuAmount, period), period) : 0;
  
  const employerCosts: EmployerCosts = {
    imss: imssEmployer,
    sar: sarEmployer,
    infonavit: infonavit,
    statePayrollTax: statePayrollTax,
    aguinaldo: aguinaldo,
    vacationPremium: vacationPremium,
    ptu: ptu,
    total: new Decimal(imssEmployer)
      .plus(sarEmployer)
      .plus(infonavit)
      .plus(statePayrollTax)
      .plus(aguinaldo)
      .plus(vacationPremium)
      .plus(ptu)
      .toNumber(),
  };
  
  // Employee Deductions
  const isr = convertFromAnnual(calculateISR(annualSalary), period);
  const imssEmployee = convertFromAnnual(
    calculateIMSSEmployee(annualSalary),
    period
  );
  const sarEmployee = convertFromAnnual(
    new Decimal(annualSalary).times(SAR_EMPLOYEE_RATE).dividedBy(100).toNumber(),
    period
  );
  
  const employeeDeductions: EmployeeDeductions = {
    isr: isr,
    imss: imssEmployee,
    sar: sarEmployee,
    total: new Decimal(isr).plus(imssEmployee).plus(sarEmployee).toNumber(),
  };
  
  // Final calculations
  const netSalary = new Decimal(grossSalary).minus(employeeDeductions.total).toNumber();
  const totalCompanyCost = new Decimal(grossSalary).plus(employerCosts.total).toNumber();
  
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    input,
    grossSalary,
    employerCosts,
    employeeDeductions,
    netSalary,
    totalCompanyCost,
    period,
  };
}

