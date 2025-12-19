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

## License

MIT
