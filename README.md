# IMSS Calculator

A web application for calculating the total cost of employee salaries in Mexico, including all mandatory taxes, social security contributions, and benefits.

## Current State

The application is **fully functional** and ready for use. All core features have been implemented and tested. This is a Next.js web application that runs in the browser.

### ✅ Implemented Features

- **Complete Salary Cost Calculation**

  - Federal income tax (ISR) with progressive brackets (1.92% - 35%)
  - State payroll taxes for all 32 Mexican states
  - IMSS (Social Security) contributions for both employer and employee
  - SAR (Retirement Fund) contributions
  - INFONAVIT (Housing Fund) contributions
  - Mandatory benefits: Aguinaldo (15 days) and Vacation Premium (25%)
  - Optional PTU (Profit Sharing) input

- **Multiple Calculation Periods**

  - Weekly (52 periods/year)
  - Bi-weekly/Quincenal (24 periods/year - 15th and last day of month)
  - Monthly (12 periods/year)
  - Annual

- **Calculation History**

  - Automatic local storage of all calculations
  - Chat-like history interface
  - Click to view and restore previous calculations
  - Form auto-population when selecting from history
  - Delete individual calculations
  - History persists across app restarts

- **User Interface**

  - Modern, responsive design with Tailwind CSS
  - Detailed cost breakdown display
  - Separate sections for employer costs and employee deductions
  - Clear summary showing net salary and total company cost
  - Form validation with error messages
  - Spanish language interface

- **Technical Features**
  - Precise financial calculations using decimal.js
  - Type-safe implementation with TypeScript
  - Modern web application built with Next.js
  - Client-side local storage for calculation history
  - Responsive design that works on desktop and mobile
  - Hot reload in development mode
  - Production build configuration ready

## Technologies

- **Next.js 15** - React framework for web applications
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **decimal.js** - Precise financial calculations
- **date-fns** - Date manipulation

## Installation

1. Install dependencies:

```bash
npm install
```

2. Run in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

3. Build for production:

```bash
npm run build
```

4. Start production server:

```bash
npm start
```

## Usage

### Basic Workflow

1. Enter the gross salary amount
2. Select the calculation period (weekly, bi-weekly, monthly, or annual)
3. Select the state where the employee works (all 32 Mexican states available)
4. Select the IMSS risk classification for your company (Class I-V)
5. Enter employee tenure (years of service) for vacation calculation
6. Optionally enter PTU amount for the selected period
7. Click "Calcular" to see the detailed breakdown

### Using Calculation History

- All calculations are automatically saved to local storage
- Click "Mostrar" in the history panel to view saved calculations
- Click any calculation in the history to:
  - View its detailed breakdown in the summary section
  - Auto-populate the form with its values for editing/recalculation
- Click the × button to delete a calculation from history
- History is limited to the last 100 calculations

## Cost Components

### Employer Contributions

- **IMSS (Social Security)**: 13.206% - 27.706% (based on risk classification)
  - Class I: 13.206% (Low risk)
  - Class II: 15.206% (Medium-low risk)
  - Class III: 17.206% (Medium risk)
  - Class IV: 20.206% (Medium-high risk)
  - Class V: 27.706% (High risk)
- **SAR (Retirement Fund)**: 2% of salary
- **INFONAVIT (Housing Fund)**: 5% of salary
- **State Payroll Tax**: 1-4% (varies by state, all 32 states configured)
  - Mexico City (CDMX): 4%
  - Most other states: 2%
- **Aguinaldo**: 15 days salary (prorated by calculation period)
- **Vacation Premium**: 25% of vacation days salary (prorated by calculation period)
  - Vacation days increase with tenure (12 days minimum, up to 50 days)
- **PTU**: Optional user input (prorated by calculation period)

### Employee Deductions

- **ISR (Income Tax)**: Progressive brackets from 1.92% to 35%
  - Calculated using 2024/2025 tax brackets
  - Handles all income levels with proper marginal rate calculation
- **IMSS Employee Contribution**: 2.727% of salary
- **SAR Employee Contribution**: 1.125% of salary

## Architecture

### Project Structure

```
imss-calc/
├── src/
│   └── app/                # Next.js App Router
│       ├── components/      # UI components
│       │   ├── CalculatorForm.tsx
│       │   ├── CalculationSummary.tsx
│       │   ├── CalculationHistory.tsx
│       │   └── PeriodSelector.tsx
│       ├── lib/            # Business logic and utilities
│       │   ├── constants.ts
│       │   ├── config/      # Tax configuration
│       │   │   ├── tax-config.json    # All tax values and ISR brackets
│       │   │   ├── types.ts           # Configuration type definitions
│       │   │   └── loader.ts          # Configuration loader and validator
│       │   ├── services/   # Calculation services
│       │   │   ├── calculations.ts
│       │   │   ├── isr.ts
│       │   │   ├── imss.ts
│       │   │   └── benefits.ts
│       │   └── utils/      # Utilities
│       │       ├── storage.ts
│       │       └── formatting.ts
│       ├── types/          # TypeScript types
│       │   └── index.ts
│       ├── page.tsx        # Main page component
│       ├── layout.tsx      # Root layout
│       └── globals.css     # Global styles
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

### Key Implementation Details

- **Precise Calculations**: All monetary calculations use `decimal.js` to avoid floating-point errors
- **Period Conversion**: All calculations are normalized to annual amounts first, then converted to the selected period
- **Local Storage**: Uses browser `localStorage` API to persist calculation history client-side
- **State Management**: React hooks for component state, no external state management library needed
- **Type Safety**: Full TypeScript coverage with strict type checking
- **Client Components**: Uses Next.js App Router with client-side components for interactivity

## Updating Tax Values and ISR Brackets

All tax values, ISR brackets, and rates are now managed through a centralized configuration file. This makes it easy to update values when tax laws change without modifying code.

### Configuration File Location

The configuration file is located at:

```
src/app/lib/config/tax-config.json
```

### How to Update Tax Values

1. **Open the configuration file**: `src/app/lib/config/tax-config.json`

2. **Update the values you need**:

   - **ISR Tax Brackets**: Modify the `isr.taxBrackets` array
     - Each bracket has: `lowerLimit`, `upperLimit` (use `null` for Infinity), `rate`, and `fixedAmount`
   - **IMSS Rates**: Update `imss.riskClassifications` (I-V) and `imss.employeeRate`
   - **SAR Rates**: Update `sar.employerRate` and `sar.employeeRate`
   - **INFONAVIT Rate**: Update `infonavit.rate`
   - **Benefits**: Update `benefits.aguinaldoDays`, `benefits.vacationPremiumRate`, or `benefits.vacationDaysByTenure`
   - **State Tax Rates**: Update individual state `payrollTaxRate` values in the `states` array

3. **Update metadata** (optional but recommended):

   - Update `version` field to reflect the tax year (e.g., "2025-2026")
   - Update `lastUpdated` field with the date of changes (e.g., "2025-01-01")

4. **Restart the development server** or rebuild:
   ```bash
   npm run dev
   # or for production
   npm run build
   ```

### Configuration Validation

The configuration loader automatically validates:

- All required fields are present
- Tax rates are positive numbers
- ISR brackets are in order and don't overlap
- All risk classifications are defined
- State configurations are complete

If there are validation errors, they will be shown in the console when the app starts.

### Example: Updating ISR Brackets

To update ISR brackets for a new tax year, edit the `isr.taxBrackets` array:

```json
{
  "isr": {
    "taxBrackets": [
      {
        "lowerLimit": 0,
        "upperLimit": 10000.0,
        "rate": 0.02,
        "fixedAmount": 0
      },
      {
        "lowerLimit": 10000.01,
        "upperLimit": null,
        "rate": 0.3,
        "fixedAmount": 200.0
      }
    ]
  }
}
```

Note: Use `null` for the `upperLimit` of the highest bracket to represent Infinity.

### Example: Updating IMSS Rates

To update IMSS employer contribution rates:

```json
{
  "imss": {
    "riskClassifications": {
      "I": 13.5,
      "II": 15.5,
      "III": 17.5,
      "IV": 20.5,
      "V": 28.0
    },
    "employeeRate": 2.8
  }
}
```

## Development

### Requirements

- Node.js >= 24.0.0
- npm or yarn

### Available Scripts

- `npm run dev` - Start Next.js development server (runs on http://localhost:3000)
- `npm run build` - Build for production (creates optimized production build)
- `npm start` - Start production server (requires build first)
- `npm run lint` - Run ESLint to check code quality

### Development Notes

- Next.js dev server runs on port 3000 by default
- Hot module replacement works automatically for React components
- All calculations and history are stored in browser localStorage
- The app is fully client-side - no backend server required
- Tax configuration is loaded at build time from `tax-config.json`

## License

MIT
