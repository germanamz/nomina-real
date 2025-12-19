/**
 * Type definitions for tax configuration
 */

export interface ISRTaxBracket {
  lowerLimit: number;
  upperLimit: number | null; // null represents Infinity
  rate: number;
  fixedAmount: number;
}

export interface ISRConfig {
  taxBrackets: ISRTaxBracket[];
}

export interface IMSSRiskClassifications {
  I: number;
  II: number;
  III: number;
  IV: number;
  V: number;
}

export interface IMSSConfig {
  riskClassifications: IMSSRiskClassifications;
  employeeRate: number;
}

export interface SARConfig {
  employerRate: number;
  employeeRate: number;
}

export interface INFONAVITConfig {
  rate: number;
}

export interface VacationDaysByTenure {
  years: number;
  days: number;
}

export interface BenefitsConfig {
  aguinaldoDays: number;
  vacationPremiumRate: number;
  vacationDaysByTenure: VacationDaysByTenure[];
}

export interface StateConfig {
  name: string;
  code: string;
  payrollTaxRate: number;
}

export interface TaxConfig {
  version: string;
  lastUpdated: string;
  isr: ISRConfig;
  imss: IMSSConfig;
  sar: SARConfig;
  infonavit: INFONAVITConfig;
  benefits: BenefitsConfig;
  states: StateConfig[];
}

