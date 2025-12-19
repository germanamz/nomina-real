import taxConfigData from './tax-config.json';
import { TaxConfig, ISRTaxBracket } from './types';

/**
 * Load and validate tax configuration
 */
export function loadTaxConfig(): TaxConfig {
  const config = taxConfigData as TaxConfig;
  
  // Validate configuration
  validateTaxConfig(config);
  
  return config;
}

/**
 * Validate tax configuration structure and values
 */
function validateTaxConfig(config: TaxConfig): void {
  // Validate ISR brackets
  if (!config.isr?.taxBrackets || config.isr.taxBrackets.length === 0) {
    throw new Error('ISR tax brackets are required');
  }
  
  // Validate brackets are in order and don't overlap
  for (let i = 0; i < config.isr.taxBrackets.length; i++) {
    const bracket = config.isr.taxBrackets[i];
    
    if (bracket.lowerLimit < 0) {
      throw new Error(`ISR bracket ${i}: lowerLimit must be >= 0`);
    }
    
    if (bracket.upperLimit !== null && bracket.upperLimit <= bracket.lowerLimit) {
      throw new Error(`ISR bracket ${i}: upperLimit must be > lowerLimit`);
    }
    
    if (bracket.rate < 0 || bracket.rate > 1) {
      throw new Error(`ISR bracket ${i}: rate must be between 0 and 1`);
    }
    
    if (bracket.fixedAmount < 0) {
      throw new Error(`ISR bracket ${i}: fixedAmount must be >= 0`);
    }
    
    // Check continuity with next bracket
    if (i < config.isr.taxBrackets.length - 1) {
      const nextBracket = config.isr.taxBrackets[i + 1];
      if (bracket.upperLimit !== null && nextBracket.lowerLimit !== bracket.upperLimit + 0.01) {
        console.warn(
          `ISR bracket ${i}: upperLimit (${bracket.upperLimit}) should connect to next bracket's lowerLimit (${nextBracket.lowerLimit})`
        );
      }
    }
  }
  
  // Validate IMSS rates
  if (!config.imss?.riskClassifications) {
    throw new Error('IMSS risk classifications are required');
  }
  
  const riskKeys: Array<keyof typeof config.imss.riskClassifications> = ['I', 'II', 'III', 'IV', 'V'];
  for (const key of riskKeys) {
    if (typeof config.imss.riskClassifications[key] !== 'number' || config.imss.riskClassifications[key] < 0) {
      throw new Error(`IMSS risk classification ${key} must be a positive number`);
    }
  }
  
  if (typeof config.imss.employeeRate !== 'number' || config.imss.employeeRate < 0) {
    throw new Error('IMSS employee rate must be a positive number');
  }
  
  // Validate SAR rates
  if (typeof config.sar?.employerRate !== 'number' || config.sar.employerRate < 0) {
    throw new Error('SAR employer rate must be a positive number');
  }
  
  if (typeof config.sar?.employeeRate !== 'number' || config.sar.employeeRate < 0) {
    throw new Error('SAR employee rate must be a positive number');
  }
  
  // Validate INFONAVIT rate
  if (typeof config.infonavit?.rate !== 'number' || config.infonavit.rate < 0) {
    throw new Error('INFONAVIT rate must be a positive number');
  }
  
  // Validate benefits
  if (typeof config.benefits?.aguinaldoDays !== 'number' || config.benefits.aguinaldoDays < 0) {
    throw new Error('Aguinaldo days must be a positive number');
  }
  
  if (typeof config.benefits?.vacationPremiumRate !== 'number' || config.benefits.vacationPremiumRate < 0) {
    throw new Error('Vacation premium rate must be a positive number');
  }
  
  if (!Array.isArray(config.benefits?.vacationDaysByTenure) || config.benefits.vacationDaysByTenure.length === 0) {
    throw new Error('Vacation days by tenure must be a non-empty array');
  }
  
  // Validate states
  if (!Array.isArray(config.states) || config.states.length === 0) {
    throw new Error('States configuration is required');
  }
  
  for (const state of config.states) {
    if (!state.code || !state.name) {
      throw new Error('Each state must have a code and name');
    }
    
    if (typeof state.payrollTaxRate !== 'number' || state.payrollTaxRate < 0) {
      throw new Error(`State ${state.code}: payrollTaxRate must be a positive number`);
    }
  }
}

/**
 * Get ISR tax brackets in the format expected by the calculation functions
 * Converts the JSON format to the tuple format [lowerLimit, upperLimit, rate, fixedAmount]
 */
export function getISRTaxBrackets(): Array<[number, number, number, number]> {
  const config = loadTaxConfig();
  
  return config.isr.taxBrackets.map((bracket: ISRTaxBracket) => [
    bracket.lowerLimit,
    bracket.upperLimit === null ? Infinity : bracket.upperLimit,
    bracket.rate,
    bracket.fixedAmount,
  ]);
}

/**
 * Get the full tax configuration
 */
export function getTaxConfig(): TaxConfig {
  return loadTaxConfig();
}

