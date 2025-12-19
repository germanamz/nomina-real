/**
 * Format a number as Mexican Peso currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format period name for display
 */
export function formatPeriod(period: string): string {
  const periodMap: Record<string, string> = {
    weekly: 'Semanal',
    'bi-weekly': 'Quincenal',
    monthly: 'Mensual',
    annual: 'Anual',
  };
  return periodMap[period] || period;
}

