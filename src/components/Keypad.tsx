import React from 'react';
import type { Operator } from '../types/calculator';
import { Delete, RotateCcw } from 'lucide-react';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onOperator: (op: Operator) => void;
  onEquals: () => void;
  onPercentage: () => void;
  onToggleSign: () => void;
  onClearEntry: () => void;
  onAllClear: () => void;
  onBackspace: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onMemoryRecall: () => void;
  onMemoryClear: () => void;
  hasMemory: boolean;
  activeOperator: Operator | null;
  theme: 'light' | 'dark';
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onDecimal,
  onOperator,
  onEquals,
  onPercentage,
  onToggleSign,
  onClearEntry,
  onAllClear,
  onBackspace,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryRecall,
  onMemoryClear,
  hasMemory,
  activeOperator,
  theme,
}) => {
  const isLight = theme === 'light';

  // Common button base styling
  const numBtnStyle = isLight
    ? 'bg-white/90 hover:bg-white text-slate-800 border border-slate-200/80 shadow-xs hover:border-indigo-300'
    : 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700/50 shadow-sm';

  const opBtnStyle = (op: Operator) =>
    activeOperator === op
      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/35 ring-2 ring-indigo-400'
      : isLight
      ? 'bg-indigo-50/90 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 shadow-xs'
      : 'bg-indigo-950/60 hover:bg-indigo-900/70 text-indigo-300 border border-indigo-700/40 shadow-sm';

  const funcBtnStyle = isLight
    ? 'bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 border border-slate-200 shadow-xs'
    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 shadow-sm';

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
      {/* Memory & Quick Function Row */}
      <div className="grid grid-cols-5 gap-1.5 w-full">
        <button
          type="button"
          id="btn-mc"
          onClick={onMemoryClear}
          disabled={!hasMemory}
          className={`py-1 rounded-lg text-[11px] font-semibold tracking-wider transition-all calc-key ${
            hasMemory
              ? isLight
                ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300'
                : 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-amber-500/30'
              : isLight
              ? 'bg-slate-100/50 text-slate-400 cursor-not-allowed border border-slate-200/40'
              : 'bg-slate-900/40 text-slate-600 cursor-not-allowed border border-slate-800/40'
          }`}
        >
          MC
        </button>
        <button
          type="button"
          id="btn-mr"
          onClick={onMemoryRecall}
          disabled={!hasMemory}
          className={`py-1 rounded-lg text-[11px] font-semibold tracking-wider transition-all calc-key ${
            hasMemory
              ? isLight
                ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300'
                : 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-amber-500/30'
              : isLight
              ? 'bg-slate-100/50 text-slate-400 cursor-not-allowed border border-slate-200/40'
              : 'bg-slate-900/40 text-slate-600 cursor-not-allowed border border-slate-800/40'
          }`}
        >
          MR
        </button>
        <button
          type="button"
          id="btn-m-minus"
          onClick={onMemorySubtract}
          className={`py-1 rounded-lg text-[11px] font-semibold tracking-wider transition-all calc-key ${
            isLight
              ? 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50'
          }`}
        >
          M−
        </button>
        <button
          type="button"
          id="btn-m-plus"
          onClick={onMemoryAdd}
          className={`py-1 rounded-lg text-[11px] font-semibold tracking-wider transition-all calc-key ${
            isLight
              ? 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50'
          }`}
        >
          M+
        </button>
        <button
          type="button"
          id="btn-percent"
          onClick={onPercentage}
          className={`py-1 rounded-lg text-[11px] font-bold transition-all calc-key ${
            isLight
              ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60'
              : 'bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-500/30'
          }`}
          title="Percentage (%)"
        >
          %
        </button>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full">
        {/* Row 1: AC, C, Backspace, Divide */}
        <button
          type="button"
          id="btn-ac"
          onClick={onAllClear}
          className={`h-11 sm:h-12 rounded-xl font-bold text-xs active:scale-95 transition-all calc-key flex items-center justify-center gap-1 ${
            isLight
              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 shadow-xs'
              : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30'
          }`}
          title="All Clear (AC)"
        >
          <RotateCcw className="w-3 h-3" />
          <span>AC</span>
        </button>

        <button
          type="button"
          id="btn-c"
          onClick={onClearEntry}
          className={`h-11 sm:h-12 rounded-xl font-bold text-xs active:scale-95 transition-all calc-key ${funcBtnStyle}`}
          title="Clear Entry (C)"
        >
          C
        </button>

        <button
          type="button"
          id="btn-backspace"
          onClick={onBackspace}
          className={`h-11 sm:h-12 rounded-xl font-bold text-xs active:scale-95 transition-all calc-key flex items-center justify-center ${funcBtnStyle}`}
          title="Backspace (⌫)"
        >
          <Delete className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          id="btn-op-divide"
          onClick={() => onOperator('÷')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-lg transition-all calc-key ${opBtnStyle('÷')}`}
        >
          ÷
        </button>

        {/* Row 2: 7, 8, 9, Multiply */}
        <button
          type="button"
          id="btn-num-7"
          onClick={() => onDigit('7')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-base active:scale-95 transition-all calc-key ${numBtnStyle}`}
        >
          7
        </button>
        <button
          type="button"
          id="btn-num-8"
          onClick={() => onDigit('8')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-base active:scale-95 transition-all calc-key ${numBtnStyle}`}
        >
          8
        </button>
        <button
          type="button"
          id="btn-num-9"
          onClick={() => onDigit('9')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-base active:scale-95 transition-all calc-key ${numBtnStyle}`}
        >
          9
        </button>
        <button
          type="button"
          id="btn-op-multiply"
          onClick={() => onOperator('×')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-lg transition-all calc-key ${opBtnStyle('×')}`}
        >
          ×
        </button>

        {/* Row 3: 4, 5, 6, Subtract */}
        <button
          type="button"
          id="btn-num-4"
          onClick={() => onDigit('4')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-base active:scale-95 transition-all calc-key ${numBtnStyle}`}
        >
          4
        </button>
        <button
          type="button"
          id="btn-num-5"
          onClick={() => onDigit('5')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-base active:scale-95 transition-all calc-key ${numBtnStyle}`}
        >
          5
        </button>
        <button
          type="button"
          id="btn-num-6"
          onClick={() => onDigit('6')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-base active:scale-95 transition-all calc-key ${numBtnStyle}`}
        >
          6
        </button>
        <button
          type="button"
          id="btn-op-subtract"
          onClick={() => onOperator('−')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-lg transition-all calc-key ${opBtnStyle('−')}`}
        >
          −
        </button>

        {/* Row 4: 1, 2, 3, Add */}
        <button
          type="button"
          id="btn-num-1"
          onClick={() => onDigit('1')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-base active:scale-95 transition-all calc-key ${numBtnStyle}`}
        >
          1
        </button>
        <button
          type="button"
          id="btn-num-2"
          onClick={() => onDigit('2')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-base active:scale-95 transition-all calc-key ${numBtnStyle}`}
        >
          2
        </button>
        <button
          type="button"
          id="btn-num-3"
          onClick={() => onDigit('3')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-base active:scale-95 transition-all calc-key ${numBtnStyle}`}
        >
          3
        </button>
        <button
          type="button"
          id="btn-op-add"
          onClick={() => onOperator('+')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-lg transition-all calc-key ${opBtnStyle('+')}`}
        >
          +
        </button>

        {/* Row 5: +/-, 0, ., Equals */}
        <button
          type="button"
          id="btn-sign"
          onClick={onToggleSign}
          className={`h-11 sm:h-12 rounded-xl font-bold text-sm active:scale-95 transition-all calc-key ${funcBtnStyle}`}
          title="Toggle positive/negative (+/-)"
        >
          +/−
        </button>
        <button
          type="button"
          id="btn-num-0"
          onClick={() => onDigit('0')}
          className={`h-11 sm:h-12 rounded-xl font-bold text-base active:scale-95 transition-all calc-key ${numBtnStyle}`}
        >
          0
        </button>
        <button
          type="button"
          id="btn-decimal"
          onClick={onDecimal}
          className={`h-11 sm:h-12 rounded-xl font-bold text-lg active:scale-95 transition-all calc-key ${numBtnStyle}`}
        >
          .
        </button>
        <button
          type="button"
          id="btn-equals"
          onClick={onEquals}
          className="h-11 sm:h-12 rounded-xl font-bold text-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/30 border border-indigo-400/40 active:scale-95 transition-all calc-key"
          title="Equals (=)"
        >
          =
        </button>
      </div>
    </div>
  );
};
