export type ShorthandUnit = 'K' | 'L' | 'M' | 'Cr' | 'Arab';

export interface ShorthandDefinition {
  unit: ShorthandUnit;
  name: string;
  hindiName: string;
  multiplier: number;
  formattedMultiplier: string;
  description: string;
  isIndian: boolean;
}

export type Operator = '+' | '−' | '×' | '÷';

export type CalculationMode = 'pocket' | 'bodmas'; // pocket: immediate left-to-right, bodmas: standard precedence

export type AutoShorthandMode = 'clean' | 'smart' | 'off'; // clean: only whole round numbers, smart: decimal round like 10.45K, off: never auto-convert

export interface HistoryItem {
  id: string;
  expression: string;
  resultRaw: number;
  resultDisplay: string;
  timestamp: number;
  mode: CalculationMode;
}

export interface CalculatorState {
  // Current active entry
  displayValue: string;        // e.g. "10K", "250000", "0"
  rawValue: number;            // e.g. 10000, 250000, 0
  isShorthandLocked: boolean;  // whether current entry is locked as shorthand (e.g. "10K")
  shorthandUnit: ShorthandUnit | null;
  baseNumberBeforeShorthand: string | null; // e.g. "10" for "10K"

  // Calculation chain
  previousValue: number | null;
  previousDisplay: string | null;
  operator: Operator | null;
  expressionHistory: string;   // e.g. "10K + 2.5L"
  lastCalculatedResult: number | null;

  // Flags
  hasError: boolean;
  errorMessage: string | null;
  isNewEntry: boolean;         // if true, next digit typed replaces display

  // Memory
  memoryValue: number;
  memoryDisplay: string | null;
}

export interface CalculatorSettings {
  mode: CalculationMode;
  autoShorthand: AutoShorthandMode;
  debounceMs: number;
  soundEnabled: boolean;
  showWords: boolean;
  showGstBar: boolean;
  currencySymbol: string;      // "₹", "$", or ""
  theme: 'light' | 'dark';
}

