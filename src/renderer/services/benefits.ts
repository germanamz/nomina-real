import Decimal from 'decimal.js';
import { AGUINALDO_DAYS, VACATION_PREMIUM_RATE, VACATION_DAYS_BY_TENURE } from '../../shared/constants';
import { CalculationPeriod } from '../../shared/types';

/**
 * Get vacation days based on employee tenure
 * @param tenureYears - Years of service
 * @returns Number of vacation days
 */
export function getVacationDays(tenureYears: number): number {
  // Find the appropriate vacation days based on tenure
  for (let i = VACATION_DAYS_BY_TENURE.length - 1; i >= 0; i--) {
    if (tenureYears >= VACATION_DAYS_BY_TENURE[i].years) {
      return VACATION_DAYS_BY_TENURE[i].days;
    }
  }
  // Default to 12 days for less than 1 year
  return 12;
}

/**
 * Calculate aguinaldo (Christmas bonus) for a given period
 * Aguinaldo is 15 days of salary per year, prorated by period
 * @param dailySalary - Daily salary amount
 * @param period - Calculation period
 * @returns Aguinaldo amount for the period
 */
export function calculateAguinaldo(dailySalary: number, period: CalculationPeriod): number {
  const annualAguinaldo = new Decimal(dailySalary).times(AGUINALDO_DAYS);
  
  switch (period) {
    case 'weekly':
      return annualAguinaldo.dividedBy(52).toNumber();
    case 'bi-weekly':
      // Quincenal: twice per month = 24 pay periods per year
      return annualAguinaldo.dividedBy(24).toNumber();
    case 'monthly':
      return annualAguinaldo.dividedBy(12).toNumber();
    case 'annual':
      return annualAguinaldo.toNumber();
  }
}

/**
 * Calculate vacation premium for a given period
 * Vacation premium is 25% of vacation days salary, prorated by period
 * @param dailySalary - Daily salary amount
 * @param tenureYears - Years of service
 * @param period - Calculation period
 * @returns Vacation premium amount for the period
 */
export function calculateVacationPremium(
  dailySalary: number,
  tenureYears: number,
  period: CalculationPeriod
): number {
  const vacationDays = getVacationDays(tenureYears);
  const vacationSalary = new Decimal(dailySalary).times(vacationDays);
  const annualPremium = vacationSalary.times(VACATION_PREMIUM_RATE);
  
  switch (period) {
    case 'weekly':
      return annualPremium.dividedBy(52).toNumber();
    case 'bi-weekly':
      // Quincenal: twice per month = 24 pay periods per year
      return annualPremium.dividedBy(24).toNumber();
    case 'monthly':
      return annualPremium.dividedBy(12).toNumber();
    case 'annual':
      return annualPremium.toNumber();
  }
}

/**
 * Calculate PTU (Profit Sharing) for a given period
 * PTU is prorated from annual amount
 * @param annualPTU - Annual PTU amount
 * @param period - Calculation period
 * @returns PTU amount for the period
 */
export function calculatePTU(annualPTU: number, period: CalculationPeriod): number {
  const ptu = new Decimal(annualPTU);
  
  switch (period) {
    case 'weekly':
      return ptu.dividedBy(52).toNumber();
    case 'bi-weekly':
      // Quincenal: twice per month = 24 pay periods per year
      return ptu.dividedBy(24).toNumber();
    case 'monthly':
      return ptu.dividedBy(12).toNumber();
    case 'annual':
      return ptu.toNumber();
  }
}

