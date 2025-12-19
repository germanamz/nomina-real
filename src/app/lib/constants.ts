/**
 * Tax and benefit constants loaded from configuration file
 * 
 * To update tax values, edit: src/app/lib/config/tax-config.json
 * 
 * This file provides a convenient interface to access configuration values.
 * All values are loaded from the JSON configuration file at build time.
 */

import { getISRTaxBrackets, getTaxConfig } from './config/loader';

// Load configuration
const config = getTaxConfig();

// ISR Tax Brackets (loaded from configuration)
// Format: [lowerLimit, upperLimit, rate, fixedAmount]
export const ISR_TAX_BRACKETS = getISRTaxBrackets();

// IMSS Risk Classifications and Rates (employer contribution percentage)
export const IMSS_RISK_CLASSIFICATIONS = config.imss.riskClassifications;

// IMSS Employee Contribution Rate
export const IMSS_EMPLOYEE_RATE = config.imss.employeeRate;

// SAR (Retirement Fund) Rates
export const SAR_EMPLOYER_RATE = config.sar.employerRate;
export const SAR_EMPLOYEE_RATE = config.sar.employeeRate;

// INFONAVIT Rate
export const INFONAVIT_RATE = config.infonavit.rate;

// Mandatory Benefits
export const AGUINALDO_DAYS = config.benefits.aguinaldoDays;
export const VACATION_PREMIUM_RATE = config.benefits.vacationPremiumRate;

// Vacation days based on tenure (years of service)
export const VACATION_DAYS_BY_TENURE = config.benefits.vacationDaysByTenure;

// Mexican States with Payroll Tax Rates
export const MEXICAN_STATES = config.states;

