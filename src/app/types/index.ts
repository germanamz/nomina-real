export type CalculationPeriod = 'weekly' | 'bi-weekly' | 'monthly' | 'annual';

export type IMSSRiskClassification = 'I' | 'II' | 'III' | 'IV' | 'V';

export interface AdditionalBenefit {
  name: string;
  amount: number;
  isAnnual: boolean;
}

export interface AdditionalBenefits {
  performanceBonus?: number; // annual
  signingBonus?: number; // one-time, annualized for display
  retentionBonus?: number; // annual
  mealVouchers?: number; // period amount
  transportation?: number; // period amount
  healthInsurance?: number; // period amount, employer contribution
  lifeInsurance?: number; // period amount, employer contribution
  other?: AdditionalBenefit[]; // extensible for custom bonuses
}

export interface CalculationInput {
  grossSalary: number;
  period: CalculationPeriod;
  state: string;
  imssRiskClassification: IMSSRiskClassification;
  ptuAmount?: number;
  employeeTenureYears: number;
  additionalBenefits?: AdditionalBenefits;
}

export interface EmployerCosts {
  imss: number;
  sar: number;
  infonavit: number;
  statePayrollTax: number;
  aguinaldo: number;
  vacationPremium: number;
  ptu: number;
  additionalBenefits: number;
  total: number;
}

export interface AdditionalBenefitsBreakdown {
  period: number;
  annual: number;
}

export interface EmployeeDeductions {
  isr: number;
  imss: number;
  sar: number;
  total: number;
}

export interface CalculationResult {
  id: string;
  timestamp: Date;
  input: CalculationInput;
  grossSalary: number;
  grossSalaryAnnual: number;
  employerCosts: EmployerCosts;
  employerCostsAnnual: EmployerCosts;
  employeeDeductions: EmployeeDeductions;
  employeeDeductionsAnnual: EmployeeDeductions;
  netSalary: number;
  netSalaryAnnual: number;
  totalCompanyCost: number;
  totalCompanyCostAnnual: number;
  period: CalculationPeriod;
  additionalBenefitsBreakdown?: {
    aguinaldo: AdditionalBenefitsBreakdown;
    vacationPremium: AdditionalBenefitsBreakdown;
    ptu: AdditionalBenefitsBreakdown;
    performanceBonus?: AdditionalBenefitsBreakdown;
    signingBonus?: AdditionalBenefitsBreakdown;
    retentionBonus?: AdditionalBenefitsBreakdown;
    mealVouchers?: AdditionalBenefitsBreakdown;
    transportation?: AdditionalBenefitsBreakdown;
    healthInsurance?: AdditionalBenefitsBreakdown;
    lifeInsurance?: AdditionalBenefitsBreakdown;
    other?: Array<{ name: string; breakdown: AdditionalBenefitsBreakdown }>;
  };
}

