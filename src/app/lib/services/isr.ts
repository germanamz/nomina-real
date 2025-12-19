import Decimal from 'decimal.js';
import { ISR_TAX_BRACKETS } from '../constants';

/**
 * Calculate ISR (Income Tax) based on progressive tax brackets
 * @param annualSalary - Annual gross salary in MXN
 * @returns ISR tax amount
 */
export function calculateISR(annualSalary: number): number {
  const salary = new Decimal(annualSalary);

  // Find the applicable tax bracket
  for (const [lowerLimit, upperLimit, rate, fixedAmount] of ISR_TAX_BRACKETS) {
    const lower = new Decimal(lowerLimit);
    const upper = new Decimal(upperLimit === Infinity ? Number.MAX_SAFE_INTEGER : upperLimit);
    const taxRate = new Decimal(rate);
    const fixed = new Decimal(fixedAmount);

    if (salary.greaterThanOrEqualTo(lower) && salary.lessThanOrEqualTo(upper)) {
      // Calculate: (salary - lowerLimit) * rate + fixedAmount
      const taxableAmount = salary.minus(lower);
      const variableTax = taxableAmount.times(taxRate);
      const totalTax = variableTax.plus(fixed);
      return totalTax.toNumber();
    }
  }

  // Fallback: should not reach here, but return 0 if no bracket matches
  return 0;
}

