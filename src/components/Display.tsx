import { useState } from 'react';
import type { ShorthandUnit } from '../types/calculator';
import { numberToWordsIndian } from '../utils/indianNumber';
import { Copy, Check, Eye, HelpCircle } from 'lucide-react';

interface DisplayProps {
  displayValue: string;
  rawValue: number;
  formattedIndian: string;
  expressionHistory: string;
  isShorthandLocked: boolean;
  shorthandUnit: ShorthandUnit | null;
  hasError: boolean;
  errorMessage: string | null;
  memoryValue: number;
  currencySymbol: string;
  showWords: boolean;
  theme: 'light' | 'dark';
  resultViewMode: 'shorthand' | 'indian' | 'raw';
  onToggleViewMode: () => void;
  onRecallMemory: () => void;
  onOpenUnitGuide: () => void;
}

export const Display: React.FC<DisplayProps> = ({
  displayValue,
  rawValue,
  formattedIndian,
  expressionHistory,
  isShorthandLocked,
  shorthandUnit,
  hasError,
  errorMessage,
  memoryValue,
  currencySymbol,
  showWords,
  theme,
  resultViewMode,
  onToggleViewMode,
  onRecallMemory,
  onOpenUnitGuide,
}) => {
  const [copied, setCopied] = useState(false);
  const isLight = theme === 'light';

  // Compute number in Indian words
  const words = showWords && !hasError && rawValue !== 0
    ? numberToWordsIndian(rawValue)
    : '';

  // Copy current raw or formatted value
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = rawValue.toString();
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  // Determine what primary text to show depending on view mode
  let mainDisplayText = displayValue;
  if (!hasError && resultViewMode === 'indian') {
    mainDisplayText = formattedIndian;
  } else if (!hasError && resultViewMode === 'raw') {
    mainDisplayText = rawValue.toString();
  }

  // Dynamic font sizing for long numbers to fit comfortably
  const textLength = mainDisplayText.length;
  const fontSizeClass =
    textLength > 12
      ? 'text-2xl sm:text-3xl'
      : textLength > 8
      ? 'text-3xl sm:text-4xl'
      : 'text-4xl sm:text-5xl';

  return (
    <div
      className={`relative w-full rounded-2xl p-3 sm:p-3.5 transition-all flex flex-col justify-between min-h-[118px] sm:min-h-[132px] ${
        isLight
          ? 'glass-light-display text-slate-800'
          : 'bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-800/90 shadow-2xl text-white'
      }`}
    >
      {/* Top row: Expression history & Memory status */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-wide leading-none">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          {memoryValue !== 0 && (
            <button
              type="button"
              id="badge-memory"
              onClick={onRecallMemory}
              title="Click to recall memory"
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold border transition-colors ${
                isLight
                  ? 'bg-amber-100/80 text-amber-800 border-amber-300'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              <span>M</span>
              <span>{currencySymbol}{Math.abs(memoryValue) >= 1000 ? formattedIndian : memoryValue}</span>
            </button>
          )}

          <span className={`truncate font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {expressionHistory || ' '}
          </span>
        </div>

        {/* View mode toggle & Copy button */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            id="btn-unit-guide"
            onClick={onOpenUnitGuide}
            title="Indian Numbering Shorthand Guide"
            className={`p-1 rounded-md transition-colors ${
              isLight
                ? 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
                : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            id="btn-toggle-view"
            onClick={onToggleViewMode}
            title={`View: ${resultViewMode}. Click to switch view`}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-semibold border transition-colors ${
              isLight
                ? 'bg-white/90 text-slate-600 hover:bg-white border-slate-200'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/50'
            }`}
          >
            <Eye className="w-2.5 h-2.5 text-indigo-500" />
            <span>{resultViewMode === 'shorthand' ? 'K/L/Cr' : resultViewMode === 'indian' ? '1,00,000' : '123'}</span>
          </button>

          <button
            type="button"
            id="btn-copy-result"
            onClick={handleCopy}
            title="Copy number"
            className={`p-1 rounded-md transition-colors ${
              isLight
                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Display Number */}
      <div
        className="my-auto py-1 text-right cursor-pointer select-text"
        onClick={onToggleViewMode}
        title="Click to toggle display mode"
      >
        {hasError ? (
          <div className="text-rose-500 text-2xl font-bold tracking-tight animate-pulse">
            {errorMessage || 'Error'}
          </div>
        ) : (
          <div className="flex items-baseline justify-end gap-1 flex-wrap">
            {currencySymbol && (
              <span className={`font-light text-xl -translate-y-0.5 ${isLight ? 'text-indigo-600/70' : 'text-indigo-400/60'}`}>
                {currencySymbol}
              </span>
            )}
            
            <span
              id="calc-main-display"
              className={`font-bold font-mono tracking-tight transition-all ${fontSizeClass} ${
                isLight ? 'text-slate-900 drop-shadow-xs' : 'text-white drop-shadow-sm'
              }`}
            >
              {mainDisplayText}
            </span>

            {/* Shorthand Tag Badge */}
            {isShorthandLocked && shorthandUnit && (
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border animate-in fade-in zoom-in-95 ${
                isLight
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                  : 'bg-gradient-to-r from-indigo-500/30 to-violet-500/30 text-indigo-300 border-indigo-500/40'
              }`}>
                {shorthandUnit}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sub-info: Indian comma format & words */}
      <div className={`flex flex-col gap-0.5 border-t pt-1 text-right ${
        isLight ? 'border-slate-200/70' : 'border-slate-800/60'
      }`}>
        {/* Full Indian numbering preview */}
        {!hasError && Math.abs(rawValue) >= 1000 && resultViewMode === 'shorthand' && (
          <div className={`text-[11px] font-mono flex items-center justify-end gap-1 font-semibold ${
            isLight ? 'text-indigo-600' : 'text-indigo-300/80'
          }`}>
            <span className={`text-[9px] font-sans ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Indian Comma:</span>
            <span>{currencySymbol}{formattedIndian}</span>
          </div>
        )}

        {/* Indian words representation */}
        {words && (
          <div className={`text-[10px] font-medium italic truncate max-w-full ${
            isLight ? 'text-slate-600' : 'text-slate-400/90'
          }`}>
            "{words}"
          </div>
        )}
      </div>
    </div>
  );
};
