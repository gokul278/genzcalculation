import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  ShorthandUnit,
  Operator,
  CalculatorSettings,
  HistoryItem,
} from '../types/calculator';
import {
  SHORTHAND_UNITS,
  detectAutoShorthand,
  formatIndianNumber,
  formatResultShorthand,
  trimFloat,
} from '../utils/indianNumber';
import { sound } from '../utils/sound';

export interface UseCalculatorReturn {
  // State
  displayValue: string;
  rawValue: number;
  formattedIndian: string;
  isShorthandLocked: boolean;
  shorthandUnit: ShorthandUnit | null;
  baseNumberBeforeShorthand: string | null;
  expressionHistory: string;
  operator: Operator | null;
  hasError: boolean;
  errorMessage: string | null;
  memoryValue: number;
  history: HistoryItem[];
  settings: CalculatorSettings;
  canApplyShorthand: boolean;
  resultViewMode: 'shorthand' | 'indian' | 'raw';

  // Actions
  inputDigit: (digit: string) => void;
  inputDecimal: () => void;
  applyShorthand: (unit: ShorthandUnit) => void;
  expandShorthand: () => void;
  setOperator: (op: Operator) => void;
  calculateEquals: () => void;
  handlePercentage: () => void;
  toggleSign: () => void;
  clearEntry: () => void;
  allClear: () => void;
  backspace: () => void;
  
  // Memory
  memoryAdd: () => void;
  memorySubtract: () => void;
  memoryRecall: () => void;
  memoryClear: () => void;

  // Settings & Utilities
  updateSettings: (newSettings: Partial<CalculatorSettings>) => void;
  clearHistory: () => void;
  restoreHistoryItem: (item: HistoryItem) => void;
  toggleResultViewMode: () => void;
  applyPresetGST: (rate: number, isAddition?: boolean) => void;
}

const DEFAULT_SETTINGS: CalculatorSettings = {
  mode: 'pocket',
  autoShorthand: 'clean',
  debounceMs: 800,
  soundEnabled: true,
  showWords: true,
  showGstBar: true,
  currencySymbol: '₹',
  theme: 'light',
};

export function useCalculator(): UseCalculatorReturn {
  const [settings, setSettings] = useState<CalculatorSettings>(() => {
    try {
      const saved = localStorage.getItem('genz_calc_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('genz_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current entry
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [rawValue, setRawValue] = useState<number>(0);
  const [isShorthandLocked, setIsShorthandLocked] = useState<boolean>(false);
  const [shorthandUnit, setShorthandUnit] = useState<ShorthandUnit | null>(null);
  const [baseNumberBeforeShorthand, setBaseNumberBeforeShorthand] = useState<string | null>(null);

  // Calculation chain
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [previousDisplay, setPreviousDisplay] = useState<string | null>(null);
  const [operator, setOperatorState] = useState<Operator | null>(null);
  const [expressionHistory, setExpressionHistory] = useState<string>('');
  const [isNewEntry, setIsNewEntry] = useState<boolean>(true);

  // Error & Memory
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [memoryValue, setMemoryValue] = useState<number>(0);

  // Display mode toggle (shorthand vs full Indian format vs raw)
  const [resultViewMode, setResultViewMode] = useState<'shorthand' | 'indian' | 'raw'>('shorthand');

  // Debounce timer reference
  const debounceTimerRef = useRef<number | null>(null);

  // Sync sound setting
  useEffect(() => {
    sound.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  // Persist settings
  const updateSettings = useCallback((newSettings: Partial<CalculatorSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('genz_calc_settings', JSON.stringify(updated));
      } catch {
        // Ignore storage error
      }
      return updated;
    });
  }, []);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('genz_calc_history', JSON.stringify(history.slice(0, 50)));
    } catch {
      // Ignore
    }
  }, [history]);

  // Clear debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * Helper: Check and auto-convert number to shorthand if applicable
   */
  const triggerAutoShorthand = useCallback((num: number) => {
    if (settings.autoShorthand === 'off' || isShorthandLocked) return;

    const detected = detectAutoShorthand(num, settings.autoShorthand);
    if (detected) {
      setDisplayValue(detected.display);
      setIsShorthandLocked(true);
      setShorthandUnit(detected.unit);
      setBaseNumberBeforeShorthand((num / detected.multiplier).toString());
      sound.playShorthandChime();
    }
  }, [settings.autoShorthand, isShorthandLocked]);

  /**
   * Start debounce auto-detect timer after keystroke
   */
  const scheduleAutoShorthandCheck = useCallback((currentNum: number) => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    if (settings.autoShorthand === 'off') return;

    debounceTimerRef.current = window.setTimeout(() => {
      triggerAutoShorthand(currentNum);
    }, settings.debounceMs);
  }, [settings.autoShorthand, settings.debounceMs, triggerAutoShorthand]);

  /**
   * Cancel debounce timer
   */
  const cancelDebounce = useCallback(() => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  /**
   * Input a digit (0-9)
   */
  const inputDigit = useCallback((digit: string) => {
    if (hasError) return;
    sound.playClick(620);
    sound.triggerHaptic(8);

    let nextDisplay: string;
    let nextRaw: number;

    if (isNewEntry || displayValue === '0' || isShorthandLocked) {
      // If shorthand was locked, typing a digit begins fresh or expands
      nextDisplay = digit;
      nextRaw = Number(digit);
      setIsShorthandLocked(false);
      setShorthandUnit(null);
      setBaseNumberBeforeShorthand(null);
      setIsNewEntry(false);
    } else {
      // Cap maximum digits to 15 to prevent overflow
      if (displayValue.replace(/[^0-9]/g, '').length >= 15) return;
      nextDisplay = displayValue + digit;
      nextRaw = Number(nextDisplay);
    }

    setDisplayValue(nextDisplay);
    setRawValue(nextRaw);

    // Schedule debounce auto-convert check
    scheduleAutoShorthandCheck(nextRaw);
  }, [hasError, isNewEntry, displayValue, isShorthandLocked, scheduleAutoShorthandCheck]);

  /**
   * Input decimal point (.)
   */
  const inputDecimal = useCallback(() => {
    if (hasError) return;
    sound.playClick(680);
    sound.triggerHaptic(8);

    cancelDebounce();

    if (isNewEntry || isShorthandLocked) {
      setDisplayValue('0.');
      setRawValue(0);
      setIsShorthandLocked(false);
      setShorthandUnit(null);
      setBaseNumberBeforeShorthand(null);
      setIsNewEntry(false);
    } else if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  }, [hasError, isNewEntry, isShorthandLocked, displayValue, cancelDebounce]);

  /**
   * Apply shorthand unit (K, L, M, Cr) via quick chip
   */
  const applyShorthand = useCallback((unit: ShorthandUnit) => {
    if (hasError) return;
    cancelDebounce();

    const unitDef = SHORTHAND_UNITS[unit];
    if (!unitDef) return;

    sound.playShorthandChime();
    sound.triggerHaptic(15);

    // Determine the base number
    // If already locked in shorthand, allow switching units (e.g. from 10K to 10L)
    const baseStr = isShorthandLocked && baseNumberBeforeShorthand
      ? baseNumberBeforeShorthand
      : displayValue;

    const baseVal = parseFloat(baseStr);
    if (isNaN(baseVal) || baseVal === 0) return;

    const calculatedRaw = baseVal * unitDef.multiplier;
    const shorthandDisplay = `${trimFloat(baseVal, 4)}${unit}`;

    setDisplayValue(shorthandDisplay);
    setRawValue(calculatedRaw);
    setIsShorthandLocked(true);
    setShorthandUnit(unit);
    setBaseNumberBeforeShorthand(trimFloat(baseVal, 4));
    setIsNewEntry(false);
  }, [hasError, cancelDebounce, isShorthandLocked, baseNumberBeforeShorthand, displayValue]);

  /**
   * Expand shorthand back to editable digits
   */
  const expandShorthand = useCallback(() => {
    if (!isShorthandLocked) return;
    sound.playClick(500);

    // When expanding, user can edit the full expanded number
    const expandedStr = rawValue.toString();
    setDisplayValue(expandedStr);
    setIsShorthandLocked(false);
    setShorthandUnit(null);
    setBaseNumberBeforeShorthand(null);
  }, [isShorthandLocked, rawValue]);

  /**
   * Core arithmetic execution between two numbers
   */
  const executeOperation = (prev: number, curr: number, op: Operator): number => {
    switch (op) {
      case '+':
        return prev + curr;
      case '−':
        return prev - curr;
      case '×':
        return prev * curr;
      case '÷':
        if (curr === 0) {
          throw new Error('Cannot divide by zero');
        }
        return prev / curr;
      default:
        return curr;
    }
  };

  /**
   * Set Operator (+, −, ×, ÷)
   */
  const setOperator = useCallback((nextOp: Operator) => {
    if (hasError) return;
    cancelDebounce();
    sound.playClick(580);
    sound.triggerHaptic(10);

    // Immediate check for clean auto-shorthand before operator locks
    let currentRaw = rawValue;
    let currentDisp = displayValue;
    if (!isShorthandLocked && settings.autoShorthand !== 'off') {
      const detected = detectAutoShorthand(currentRaw, settings.autoShorthand);
      if (detected) {
        currentDisp = detected.display;
        setDisplayValue(detected.display);
        setIsShorthandLocked(true);
        setShorthandUnit(detected.unit);
      }
    }

    if (previousValue === null) {
      // First operator entered
      setPreviousValue(currentRaw);
      setPreviousDisplay(currentDisp);
      setOperatorState(nextOp);
      setExpressionHistory(`${currentDisp} ${nextOp}`);
      setIsNewEntry(true);
    } else if (operator && isNewEntry) {
      // User tapped another operator without typing a new number (e.g., changed + to ×)
      setOperatorState(nextOp);
      setExpressionHistory(`${previousDisplay} ${nextOp}`);
    } else if (operator) {
      // Chained operation: e.g. 5 + 3, now user presses ×
      try {
        const computed = executeOperation(previousValue, currentRaw, operator);
        const autoShort = formatResultShorthand(computed);
        const computedDisp = autoShort ? autoShort.shorthand : trimFloat(computed, 6);

        setPreviousValue(computed);
        setPreviousDisplay(computedDisp);
        setRawValue(computed);
        setDisplayValue(computedDisp);
        setOperatorState(nextOp);
        setExpressionHistory(`${computedDisp} ${nextOp}`);
        setIsNewEntry(true);
      } catch (err: unknown) {
        sound.playError();
        setHasError(true);
        setErrorMessage(err instanceof Error ? err.message : 'Error');
        setDisplayValue('Error');
      }
    }
  }, [hasError, cancelDebounce, rawValue, displayValue, isShorthandLocked, settings.autoShorthand, previousValue, operator, isNewEntry, previousDisplay]);

  /**
   * Equals (=)
   */
  const calculateEquals = useCallback(() => {
    if (hasError) return;
    cancelDebounce();

    if (previousValue === null || !operator) {
      // Check auto-shorthand for single entry
      if (!isShorthandLocked && settings.autoShorthand !== 'off') {
        const detected = detectAutoShorthand(rawValue, settings.autoShorthand);
        if (detected) {
          setDisplayValue(detected.display);
          setIsShorthandLocked(true);
          setShorthandUnit(detected.unit);
        }
      }
      return;
    }

    sound.playEquals();
    sound.triggerHaptic(20);

    let currentRaw = rawValue;
    let currentDisp = displayValue;
    if (!isShorthandLocked && settings.autoShorthand !== 'off') {
      const detected = detectAutoShorthand(currentRaw, settings.autoShorthand);
      if (detected) {
        currentDisp = detected.display;
      }
    }

    const fullExpr = `${previousDisplay} ${operator} ${currentDisp}`;

    try {
      const result = executeOperation(previousValue, currentRaw, operator);
      
      // Auto-shorthand formatting for result
      const autoShort = formatResultShorthand(result);
      const resDisplay = autoShort ? autoShort.shorthand : trimFloat(result, 6);

      // Add to history
      const historyEntry: HistoryItem = {
        id: `${Date.now()}-${Math.random()}`,
        expression: fullExpr,
        resultRaw: result,
        resultDisplay: resDisplay,
        timestamp: Date.now(),
        mode: settings.mode,
      };

      setHistory((prev) => [historyEntry, ...prev.slice(0, 49)]);

      setRawValue(result);
      setDisplayValue(resDisplay);
      setIsShorthandLocked(Boolean(autoShort));
      setShorthandUnit(autoShort ? autoShort.unit : null);
      setBaseNumberBeforeShorthand(autoShort ? trimFloat(result / SHORTHAND_UNITS[autoShort.unit].multiplier, 4) : null);

      setExpressionHistory(`${fullExpr} =`);
      setPreviousValue(null);
      setPreviousDisplay(null);
      setOperatorState(null);
      setIsNewEntry(true);
    } catch (err: unknown) {
      sound.playError();
      setHasError(true);
      setErrorMessage(err instanceof Error ? err.message : 'Error');
      setDisplayValue('Error');
    }
  }, [hasError, cancelDebounce, previousValue, operator, isShorthandLocked, settings, rawValue, displayValue, previousDisplay]);

  /**
   * Percentage (%)
   * e.g., 200 + 10% = 220
   * e.g., 500 - 15% = 425
   * e.g., 50% = 0.5
   */
  const handlePercentage = useCallback(() => {
    if (hasError) return;
    cancelDebounce();
    sound.playClick(640);
    sound.triggerHaptic(10);

    let calculated: number;
    let newDisp: string;

    if (previousValue !== null && operator) {
      if (operator === '+' || operator === '−') {
        calculated = previousValue * (rawValue / 100);
      } else {
        calculated = rawValue / 100;
      }
    } else {
      calculated = rawValue / 100;
    }

    const autoShort = formatResultShorthand(calculated);
    newDisp = autoShort ? autoShort.shorthand : trimFloat(calculated, 6);

    setRawValue(calculated);
    setDisplayValue(newDisp);
    setIsShorthandLocked(Boolean(autoShort));
    setShorthandUnit(autoShort ? autoShort.unit : null);
    setIsNewEntry(false);
  }, [hasError, cancelDebounce, previousValue, operator, rawValue]);

  /**
   * Preset GST / Tax Calculation (+18%, +12%, +5%, -18%)
   */
  const applyPresetGST = useCallback((rate: number, isAddition = true) => {
    if (hasError) return;
    cancelDebounce();
    sound.playClick(650);

    let calculated: number;
    if (isAddition) {
      // Add GST: value + (value * rate / 100)
      calculated = rawValue * (1 + rate / 100);
    } else {
      // Reverse GST: value / (1 + rate / 100)
      calculated = rawValue / (1 + rate / 100);
    }

    const autoShort = formatResultShorthand(calculated);
    const newDisp = autoShort ? autoShort.shorthand : trimFloat(calculated, 4);

    setRawValue(calculated);
    setDisplayValue(newDisp);
    setIsShorthandLocked(Boolean(autoShort));
    setShorthandUnit(autoShort ? autoShort.unit : null);
    setExpressionHistory(`${displayValue} ${isAddition ? `+ ${rate}% GST` : `- ${rate}% GST`}`);
    setIsNewEntry(true);
  }, [hasError, cancelDebounce, rawValue, displayValue]);

  /**
   * Toggle Positive / Negative sign (+/-)
   */
  const toggleSign = useCallback(() => {
    if (hasError) return;
    sound.playClick(550);

    const flippedRaw = -rawValue;
    let flippedDisplay: string;

    if (isShorthandLocked) {
      flippedDisplay = displayValue.startsWith('-')
        ? displayValue.slice(1)
        : `-${displayValue}`;
    } else {
      flippedDisplay = flippedRaw.toString();
    }

    setRawValue(flippedRaw);
    setDisplayValue(flippedDisplay);
  }, [hasError, rawValue, isShorthandLocked, displayValue]);

  /**
   * Backspace (⌫)
   */
  const backspace = useCallback(() => {
    if (hasError) {
      allClear();
      return;
    }
    sound.playClick(480);
    sound.triggerHaptic(8);
    cancelDebounce();

    if (isShorthandLocked) {
      // Revert to editable base number! (e.g. 10K -> 10)
      const base = baseNumberBeforeShorthand || rawValue.toString();
      setDisplayValue(base);
      setRawValue(Number(base));
      setIsShorthandLocked(false);
      setShorthandUnit(null);
      setBaseNumberBeforeShorthand(null);
      return;
    }

    if (displayValue.length <= 1 || displayValue === '0' || isNewEntry) {
      setDisplayValue('0');
      setRawValue(0);
      setIsNewEntry(true);
    } else {
      const nextStr = displayValue.slice(0, -1);
      setDisplayValue(nextStr === '' || nextStr === '-' ? '0' : nextStr);
      setRawValue(nextStr === '' || nextStr === '-' ? 0 : Number(nextStr));
    }
  }, [hasError, cancelDebounce, isShorthandLocked, baseNumberBeforeShorthand, rawValue, displayValue, isNewEntry]);

  /**
   * Clear Entry (C)
   */
  const clearEntry = useCallback(() => {
    sound.playClick(450);
    cancelDebounce();
    setDisplayValue('0');
    setRawValue(0);
    setIsShorthandLocked(false);
    setShorthandUnit(null);
    setBaseNumberBeforeShorthand(null);
    setIsNewEntry(true);
    setHasError(false);
    setErrorMessage(null);
  }, [cancelDebounce]);

  /**
   * All Clear (AC)
   */
  const allClear = useCallback(() => {
    sound.playClick(400);
    cancelDebounce();
    setDisplayValue('0');
    setRawValue(0);
    setIsShorthandLocked(false);
    setShorthandUnit(null);
    setBaseNumberBeforeShorthand(null);
    setPreviousValue(null);
    setPreviousDisplay(null);
    setOperatorState(null);
    setExpressionHistory('');
    setIsNewEntry(true);
    setHasError(false);
    setErrorMessage(null);
  }, [cancelDebounce]);

  /**
   * Memory Functions
   */
  const memoryAdd = useCallback(() => {
    if (hasError) return;
    sound.playClick(700);
    setMemoryValue((prev) => prev + rawValue);
  }, [hasError, rawValue]);

  const memorySubtract = useCallback(() => {
    if (hasError) return;
    sound.playClick(700);
    setMemoryValue((prev) => prev - rawValue);
  }, [hasError, rawValue]);

  const memoryRecall = useCallback(() => {
    if (hasError) return;
    sound.playClick(720);
    const autoShort = formatResultShorthand(memoryValue);
    const disp = autoShort ? autoShort.shorthand : trimFloat(memoryValue, 6);
    setRawValue(memoryValue);
    setDisplayValue(disp);
    setIsShorthandLocked(Boolean(autoShort));
    setShorthandUnit(autoShort ? autoShort.unit : null);
    setIsNewEntry(true);
  }, [hasError, memoryValue]);

  const memoryClear = useCallback(() => {
    sound.playClick(400);
    setMemoryValue(0);
  }, []);

  /**
   * History items management
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem('genz_calc_history');
    } catch {
      // Ignore
    }
  }, []);

  const restoreHistoryItem = useCallback((item: HistoryItem) => {
    sound.playClick(600);
    setRawValue(item.resultRaw);
    setDisplayValue(item.resultDisplay);
    setExpressionHistory(item.expression);
    setIsNewEntry(true);
  }, []);

  /**
   * Toggle result display mode (Shorthand -> Indian Commas -> Raw)
   */
  const toggleResultViewMode = useCallback(() => {
    sound.playClick(620);
    setResultViewMode((prev) => {
      if (prev === 'shorthand') return 'indian';
      if (prev === 'indian') return 'raw';
      return 'shorthand';
    });
  }, []);

  // Format Indian comma representation for display subtext
  const formattedIndian = formatIndianNumber(rawValue);

  // Can apply shorthand when input is non-zero and we are entering a number
  const canApplyShorthand = !hasError && (parseFloat(displayValue) !== 0 || isShorthandLocked);

  return {
    displayValue,
    rawValue,
    formattedIndian,
    isShorthandLocked,
    shorthandUnit,
    baseNumberBeforeShorthand,
    expressionHistory,
    operator,
    hasError,
    errorMessage,
    memoryValue,
    history,
    settings,
    canApplyShorthand,
    resultViewMode,

    inputDigit,
    inputDecimal,
    applyShorthand,
    expandShorthand,
    setOperator,
    calculateEquals,
    handlePercentage,
    toggleSign,
    clearEntry,
    allClear,
    backspace,

    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,

    updateSettings,
    clearHistory,
    restoreHistoryItem,
    toggleResultViewMode,
    applyPresetGST,
  };
}
