import { CalculationResult } from '../types';

const STORAGE_KEY = 'imss-calc-history';

/**
 * Save a calculation to local storage
 */
export function saveCalculation(calculation: CalculationResult): void {
  const history = loadCalculations();
  history.unshift(calculation); // Add to beginning
  // Keep only last 100 calculations
  const limitedHistory = history.slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
}

/**
 * Load all calculations from local storage
 */
export function loadCalculations(): CalculationResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const history = JSON.parse(data) as CalculationResult[];
    // Convert timestamp strings back to Date objects
    return history.map(calc => ({
      ...calc,
      timestamp: new Date(calc.timestamp),
    }));
  } catch (error) {
    console.error('Error loading calculations:', error);
    return [];
  }
}

/**
 * Delete a calculation by ID
 */
export function deleteCalculation(id: string): void {
  const history = loadCalculations();
  const filtered = history.filter(calc => calc.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Clear all calculation history
 */
export function clearAllCalculations(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get a calculation by ID
 */
export function getCalculationById(id: string): CalculationResult | null {
  const history = loadCalculations();
  return history.find(calc => calc.id === id) || null;
}

