// ISR Tax Brackets for 2024/2025 (in MXN)
// Format: [lowerLimit, upperLimit, rate, fixedAmount]
export const ISR_TAX_BRACKETS = [
  [0, 8952.49, 0.0192, 0],
  [8952.50, 75984.96, 0.064, 171.89],
  [75984.97, 133536.07, 0.1088, 4456.07],
  [133536.08, 155229.80, 0.16, 10720.00],
  [155229.81, 185327.18, 0.1792, 14191.47],
  [185327.19, 374327.84, 0.2136, 19477.63],
  [374327.85, 451107.49, 0.2352, 59424.98],
  [451107.50, 902123.50, 0.30, 77513.05],
  [902123.51, 1804247.00, 0.32, 210563.65],
  [1804247.01, 4510617.50, 0.34, 419303.93],
  [4510617.51, Infinity, 0.35, 1334253.58],
] as const;

// IMSS Risk Classifications and Rates (employer contribution percentage)
export const IMSS_RISK_CLASSIFICATIONS = {
  I: 13.206,   // Low risk
  II: 15.206,  // Medium-low risk
  III: 17.206, // Medium risk
  IV: 20.206,  // Medium-high risk
  V: 27.706,   // High risk
} as const;

// IMSS Employee Contribution Rate
export const IMSS_EMPLOYEE_RATE = 2.727;

// SAR (Retirement Fund) Rates
export const SAR_EMPLOYER_RATE = 2.0;
export const SAR_EMPLOYEE_RATE = 1.125;

// INFONAVIT Rate
export const INFONAVIT_RATE = 5.0;

// Mandatory Benefits
export const AGUINALDO_DAYS = 15;
export const VACATION_PREMIUM_RATE = 0.25; // 25% of vacation salary

// Vacation days based on tenure (years of service)
export const VACATION_DAYS_BY_TENURE = [
  { years: 1, days: 12 },
  { years: 2, days: 14 },
  { years: 3, days: 16 },
  { years: 4, days: 18 },
  { years: 5, days: 20 },
  { years: 6, days: 22 },
  { years: 7, days: 24 },
  { years: 8, days: 26 },
  { years: 9, days: 28 },
  { years: 10, days: 30 },
  { years: 11, days: 32 },
  { years: 12, days: 34 },
  { years: 13, days: 36 },
  { years: 14, days: 38 },
  { years: 15, days: 40 },
  { years: 16, days: 42 },
  { years: 17, days: 44 },
  { years: 18, days: 46 },
  { years: 19, days: 48 },
  { years: 20, days: 50 },
];

// Mexican States with Payroll Tax Rates (approximate, may vary)
export const MEXICAN_STATES = [
  { name: 'Aguascalientes', code: 'AGS', payrollTaxRate: 2.0 },
  { name: 'Baja California', code: 'BC', payrollTaxRate: 2.0 },
  { name: 'Baja California Sur', code: 'BCS', payrollTaxRate: 2.0 },
  { name: 'Campeche', code: 'CAMP', payrollTaxRate: 2.0 },
  { name: 'Chiapas', code: 'CHIS', payrollTaxRate: 2.0 },
  { name: 'Chihuahua', code: 'CHIH', payrollTaxRate: 2.0 },
  { name: 'Ciudad de México', code: 'CDMX', payrollTaxRate: 4.0 },
  { name: 'Coahuila', code: 'COAH', payrollTaxRate: 2.0 },
  { name: 'Colima', code: 'COL', payrollTaxRate: 2.0 },
  { name: 'Durango', code: 'DGO', payrollTaxRate: 2.0 },
  { name: 'Guanajuato', code: 'GTO', payrollTaxRate: 2.0 },
  { name: 'Guerrero', code: 'GRO', payrollTaxRate: 2.0 },
  { name: 'Hidalgo', code: 'HGO', payrollTaxRate: 2.0 },
  { name: 'Jalisco', code: 'JAL', payrollTaxRate: 2.0 },
  { name: 'México', code: 'MEX', payrollTaxRate: 2.0 },
  { name: 'Michoacán', code: 'MICH', payrollTaxRate: 2.0 },
  { name: 'Morelos', code: 'MOR', payrollTaxRate: 2.0 },
  { name: 'Nayarit', code: 'NAY', payrollTaxRate: 2.0 },
  { name: 'Nuevo León', code: 'NL', payrollTaxRate: 2.0 },
  { name: 'Oaxaca', code: 'OAX', payrollTaxRate: 2.0 },
  { name: 'Puebla', code: 'PUE', payrollTaxRate: 2.0 },
  { name: 'Querétaro', code: 'QRO', payrollTaxRate: 2.0 },
  { name: 'Quintana Roo', code: 'QROO', payrollTaxRate: 2.0 },
  { name: 'San Luis Potosí', code: 'SLP', payrollTaxRate: 2.0 },
  { name: 'Sinaloa', code: 'SIN', payrollTaxRate: 2.0 },
  { name: 'Sonora', code: 'SON', payrollTaxRate: 2.0 },
  { name: 'Tabasco', code: 'TAB', payrollTaxRate: 2.0 },
  { name: 'Tamaulipas', code: 'TAM', payrollTaxRate: 2.0 },
  { name: 'Tlaxcala', code: 'TLAX', payrollTaxRate: 2.0 },
  { name: 'Veracruz', code: 'VER', payrollTaxRate: 2.0 },
  { name: 'Yucatán', code: 'YUC', payrollTaxRate: 2.0 },
  { name: 'Zacatecas', code: 'ZAC', payrollTaxRate: 2.0 },
] as const;

