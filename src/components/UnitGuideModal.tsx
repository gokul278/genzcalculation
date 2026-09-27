import React from 'react';
import { HelpCircle, X, Keyboard } from 'lucide-react';
import { SHORTHAND_UNITS } from '../utils/indianNumber';

interface UnitGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const UnitGuideModal: React.FC<UnitGuideModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;
  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-md border rounded-3xl shadow-2xl p-5 sm:p-6 flex flex-col gap-3.5 animate-in zoom-in-95 duration-200 ${
        isLight
          ? 'bg-white/95 backdrop-blur-2xl border-slate-200 text-slate-800'
          : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            <h2 className={`text-base font-bold m-0 ${isLight ? 'text-slate-900' : 'text-white'}`}>Indian Shorthand Guide</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3.5 max-h-[68vh] overflow-y-auto pr-1 text-xs">
          {/* Units Table */}
          <div className={`overflow-hidden rounded-2xl border ${
            isLight ? 'border-slate-200 bg-slate-50/70' : 'border-slate-800 bg-slate-950/60'
          }`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[10px] font-semibold ${
                  isLight ? 'border-slate-200 bg-slate-100/80 text-slate-500' : 'border-slate-800 bg-slate-900/80 text-slate-400'
                }`}>
                  <th className="py-2 px-3">Unit</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Indian Value</th>
                  <th className="py-2 px-3">Zeroes</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono text-[11px]">
                {Object.values(SHORTHAND_UNITS).map((u) => (
                  <tr key={u.unit} className={isLight ? 'divide-slate-200 hover:bg-white/80' : 'divide-slate-800/60 hover:bg-slate-800/40'}>
                    <td className="py-2 px-3 font-bold text-indigo-600">{u.unit}</td>
                    <td className={`py-2 px-3 font-sans font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{u.name}</td>
                    <td className={`py-2 px-3 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{u.formattedMultiplier}</td>
                    <td className="py-2 px-3 text-slate-400">{u.description.split(' — ')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Examples */}
          <div className={`p-3 rounded-2xl border space-y-1 ${
            isLight
              ? 'bg-indigo-50/70 border-indigo-200/80 text-slate-700'
              : 'bg-indigo-950/20 border-indigo-500/20 text-slate-300'
          }`}>
            <div className="font-semibold text-indigo-600 text-xs">How it Works:</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] leading-relaxed">
              <li><strong>Quick Entry:</strong> Type <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded">10</code> and tap <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded">K</code> → 10,000</li>
              <li><strong>Decimals:</strong> Type <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded">2.5</code> and tap <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded">L</code> → 2,50,000</li>
              <li><strong>Auto-Detect:</strong> Type <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded">50000000</code> and pause → auto-converts to <strong>5Cr</strong>!</li>
              <li><strong>Unlock:</strong> Tap display or press <code className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded">⌫</code> to expand back to editable digits.</li>
            </ul>
          </div>

          {/* Keyboard Shortcuts */}
          <div className={`p-3 rounded-2xl border space-y-1.5 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <div className={`flex items-center gap-1.5 font-semibold text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              <Keyboard className="w-3.5 h-3.5 text-indigo-500" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <div><kbd className="bg-white border border-slate-300 text-indigo-600 px-1 py-0.5 rounded shadow-2xs">0-9</kbd> Digits</div>
              <div><kbd className="bg-white border border-slate-300 text-indigo-600 px-1 py-0.5 rounded shadow-2xs">.</kbd> Decimal</div>
              <div><kbd className="bg-white border border-slate-300 text-indigo-600 px-1 py-0.5 rounded shadow-2xs">K</kbd> Thousand</div>
              <div><kbd className="bg-white border border-slate-300 text-indigo-600 px-1 py-0.5 rounded shadow-2xs">L</kbd> Lakh</div>
              <div><kbd className="bg-white border border-slate-300 text-indigo-600 px-1 py-0.5 rounded shadow-2xs">M</kbd> Million</div>
              <div><kbd className="bg-white border border-slate-300 text-indigo-600 px-1 py-0.5 rounded shadow-2xs">C</kbd> Crore</div>
              <div><kbd className="bg-white border border-slate-300 text-indigo-600 px-1 py-0.5 rounded shadow-2xs">+ - * /</kbd> Ops</div>
              <div><kbd className="bg-white border border-slate-300 text-indigo-600 px-1 py-0.5 rounded shadow-2xs">Enter</kbd> Equals</div>
              <div><kbd className="bg-white border border-slate-300 text-indigo-600 px-1 py-0.5 rounded shadow-2xs">Esc</kbd> AC</div>
              <div><kbd className="bg-white border border-slate-300 text-indigo-600 px-1 py-0.5 rounded shadow-2xs">Backspace</kbd> ⌫</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
