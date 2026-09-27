import type { ShorthandUnit } from '../types/calculator';
import { SHORTHAND_UNITS, formatIndianNumber } from '../utils/indianNumber';
import { Unlock } from 'lucide-react';

interface ShorthandChipsProps {
  currentInput: string;
  rawValue?: number;
  isShorthandLocked: boolean;
  activeUnit: ShorthandUnit | null;
  theme: 'light' | 'dark';
  onApplyUnit: (unit: ShorthandUnit) => void;
  onExpand: () => void;
  disabled?: boolean;
}

const UNITS_LIST: ShorthandUnit[] = ['K', 'L', 'M', 'Cr'];

export const ShorthandChips: React.FC<ShorthandChipsProps> = ({
  currentInput,
  isShorthandLocked,
  activeUnit,
  theme,
  onApplyUnit,
  onExpand,
  disabled = false,
}) => {
  const isLight = theme === 'light';
  const baseNum = parseFloat(currentInput) || 0;

  return (
    <div
      className={`w-full flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-xl border transition-all ${isLight
          ? 'bg-white/60 backdrop-blur-md border-slate-200/80 shadow-xs'
          : 'bg-slate-900/60 backdrop-blur-md border-slate-800/80 shadow-inner'
        }`}
    >
      <div className="flex-1 grid grid-cols-4 gap-1.5">
        {UNITS_LIST.map((unit) => {
          const def = SHORTHAND_UNITS[unit];
          const isActive = isShorthandLocked && activeUnit === unit;
          const previewVal = baseNum > 0 ? formatIndianNumber(baseNum * def.multiplier) : null;

          return (
            <button
              key={unit}
              type="button"
              id={`chip-${unit.toLowerCase()}`}
              disabled={disabled}
              onClick={() => onApplyUnit(unit)}
              title={`${def.name} (${def.formattedMultiplier})${previewVal ? ` -> ${previewVal}` : ''}`}
              className={`group relative py-1 text-xs font-bold rounded-lg transition-all duration-150 flex items-center justify-center gap-1 ${isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/30 ring-1 ring-indigo-400'
                  : disabled
                    ? isLight
                      ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200'
                      : 'opacity-40 cursor-not-allowed bg-slate-800/50 text-slate-400'
                    : isLight
                      ? 'bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-700 border border-slate-200/90 hover:border-indigo-300 shadow-xs active:scale-95'
                      : 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700/60 hover:border-indigo-400/40 active:scale-95'
                }`}
            >
              <span>{unit}</span>
              <span className={`text-[9px] font-medium ${isActive ? 'text-indigo-100' : 'opacity-60'}`}>
                {unit === 'K' ? '1K' : unit === 'L' ? '1L' : unit === 'M' ? '1M' : '1Cr'}
              </span>

              {unit === 'M' && (
                <span className="w-1 h-1 rounded-full bg-amber-400" title="International unit (Million)" />
              )}
            </button>
          );
        })}
      </div>

      {/* Expand/Unlock Token Button */}
      {isShorthandLocked && (
        <button
          type="button"
          id="btn-expand-shorthand"
          onClick={onExpand}
          className={`flex items-center gap-1 px-2 py-1 text-[10px] font-semibold border rounded-lg transition-all active:scale-95 shrink-0 ml-1 ${isLight
              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border-emerald-300'
              : 'text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-500/30'
            }`}
          title="Expand back to full editable digits"
        >
          <Unlock className="w-2.5 h-2.5 text-emerald-500" />
          <span>Expand</span>
        </button>
      )}
    </div>
  );
};
