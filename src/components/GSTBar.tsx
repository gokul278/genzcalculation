import React from 'react';
import { Tag } from 'lucide-react';

interface GSTBarProps {
  onApplyGST: (rate: number, isAddition?: boolean) => void;
  disabled?: boolean;
  theme: 'light' | 'dark';
}

export const GSTBar: React.FC<GSTBarProps> = ({ onApplyGST, disabled = false, theme }) => {
  const isLight = theme === 'light';

  return (
    <div
      className={`w-full flex items-center justify-between gap-1 px-2.5 py-1 rounded-xl border text-xs transition-all ${
        isLight
          ? 'bg-white/45 border-slate-200/70 shadow-xs'
          : 'bg-slate-900/40 border-slate-800/60'
      }`}
    >
      <div className={`flex items-center gap-1 text-[10px] font-bold ${
        isLight ? 'text-slate-600' : 'text-slate-400'
      }`}>
        <Tag className="w-3 h-3 text-indigo-500" />
        <span>GST</span>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
        <button
          type="button"
          id="btn-gst-5"
          disabled={disabled}
          onClick={() => onApplyGST(5, true)}
          className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-colors disabled:opacity-40 border ${
            isLight
              ? 'bg-white/90 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-slate-200'
              : 'bg-slate-800/80 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border-slate-700/60'
          }`}
        >
          +5%
        </button>
        <button
          type="button"
          id="btn-gst-12"
          disabled={disabled}
          onClick={() => onApplyGST(12, true)}
          className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-colors disabled:opacity-40 border ${
            isLight
              ? 'bg-white/90 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-slate-200'
              : 'bg-slate-800/80 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border-slate-700/60'
          }`}
        >
          +12%
        </button>
        <button
          type="button"
          id="btn-gst-18"
          disabled={disabled}
          onClick={() => onApplyGST(18, true)}
          className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-colors disabled:opacity-40 border ${
            isLight
              ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
              : 'bg-indigo-900/30 hover:bg-indigo-900/60 text-indigo-300 border-indigo-500/40'
          }`}
          title="Most common Indian GST tier (18%)"
        >
          +18%
        </button>
        <button
          type="button"
          id="btn-gst-28"
          disabled={disabled}
          onClick={() => onApplyGST(28, true)}
          className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-colors disabled:opacity-40 border ${
            isLight
              ? 'bg-white/90 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-slate-200'
              : 'bg-slate-800/80 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border-slate-700/60'
          }`}
        >
          +28%
        </button>
        <button
          type="button"
          id="btn-gst-rev-18"
          disabled={disabled}
          onClick={() => onApplyGST(18, false)}
          className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-colors disabled:opacity-40 border ${
            isLight
              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
              : 'bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 border-amber-500/30'
          }`}
          title="Reverse GST 18%: extract base amount from gross amount"
        >
          −18%
        </button>
      </div>
    </div>
  );
};
