export type CalculationPeriod = 'weekly' | 'bi-weekly' | 'monthly' | 'annual';

export type IMSSRiskClassification = 'I' | 'II' | 'III' | 'IV' | 'V';

export interface CalculationInput {
  grossSalary: number;
  period: CalculationPeriod;
  state: string;
  imssRiskClassification: IMSSRiskClassification;
  ptuAmount?: number;
  employeeTenureYears: number;
}

export interface EmployerCosts {
  imss: number;
  sar: number;
  infonavit: number;
  statePayrollTax: number;
  aguinaldo: number;
  vacationPremium: number;
  ptu: number;
  total: number;
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
  employerCosts: EmployerCosts;
  employeeDeductions: EmployeeDeductions;
  netSalary: number;
  totalCompanyCost: number;
  period: CalculationPeriod;
}

