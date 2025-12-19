import Decimal from 'decimal.js';
import { IMSSRiskClassification } from '@/app/types';
import { IMSS_RISK_CLASSIFICATIONS as IMSS_RATES, IMSS_EMPLOYEE_RATE } from '../constants';

/**
 * Calculate IMSS employer contribution
 * @param salary - Salary amount
 * @param riskClassification - IMSS risk classification (I-V)
 * @returns IMSS employer contribution amount
 */
export function calculateIMSSEmployer(salary: number, riskClassification: IMSSRiskClassification): number {
  const rate = IMSS_RATES[riskClassification];
  const amount = new Decimal(salary).times(new Decimal(rate)).dividedBy(100);
  return amount.toNumber();
}

/**
 * Calculate IMSS employee contribution
 * @param salary - Salary amount
 * @returns IMSS employee contribution amount
 */
export function calculateIMSSEmployee(salary: number): number {
  const amount = new Decimal(salary).times(new Decimal(IMSS_EMPLOYEE_RATE)).dividedBy(100);
  return amount.toNumber();
}

