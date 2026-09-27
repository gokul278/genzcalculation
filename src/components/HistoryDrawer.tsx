import React from 'react';
import type { HistoryItem } from '../types/calculator';
import { formatIndianNumber } from '../utils/indianNumber';
import { Clock, Trash2, X, ArrowUpRight, Copy } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  currencySymbol: string;
  theme: 'light' | 'dark';
  onSelectResult: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  currencySymbol,
  theme,
  onSelectResult,
  onClearHistory,
}) => {
  if (!isOpen) return null;
  const isLight = theme === 'light';

  const copyTape = () => {
    const text = history
      .map((item) => `${item.expression} = ${currencySymbol}${item.resultDisplay} (${currencySymbol}${formatIndianNumber(item.resultRaw)})`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className={`w-full max-w-sm h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-right duration-250 border-l ${
        isLight
          ? 'bg-white/95 backdrop-blur-2xl text-slate-800 border-slate-200'
          : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <h2 className={`text-base font-bold m-0 ${isLight ? 'text-slate-900' : 'text-white'}`}>Calculation History</h2>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={copyTape}
                  title="Copy history tape"
                  className={`p-1.5 rounded-lg transition-colors ${
                    isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClearHistory}
                  title="Clear history"
                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
              <Clock className="w-8 h-8 opacity-30" />
              <p>No calculations yet.</p>
              <p className="text-xs text-slate-400">Your recent calculations will appear here.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
                className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-0.5 ${
                  isLight
                    ? 'bg-slate-50/80 hover:bg-indigo-50/50 border-slate-200/80 hover:border-indigo-300'
                    : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/40 hover:border-indigo-500/40'
                }`}
              >
                <div className={`flex items-center justify-between text-xs font-mono ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  <span>{item.expression}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity" />
                </div>

                <div className="flex items-baseline justify-between pt-0.5">
                  <div className={`text-lg font-bold font-mono transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-indigo-600' : 'text-white group-hover:text-indigo-300'
                  }`}>
                    {currencySymbol}{item.resultDisplay}
                  </div>

                  {Math.abs(item.resultRaw) >= 1000 && (
                    <div className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {currencySymbol}{formatIndianNumber(item.resultRaw)}
                    </div>
                  )}
                </div>

                <div className="text-[9px] text-slate-400 text-right pt-0.5">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
