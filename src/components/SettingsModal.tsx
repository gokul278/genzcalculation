import React from 'react';
import type { CalculatorSettings } from '../types/calculator';
import { Settings as SettingsIcon, X, Volume2, VolumeX, Sparkles, Sliders, Sun, Moon } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CalculatorSettings;
  onUpdate: (newSettings: Partial<CalculatorSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdate,
}) => {
  if (!isOpen) return null;
  const isLight = settings.theme === 'light';

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-md border rounded-3xl shadow-2xl p-5 sm:p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200 ${
        isLight
          ? 'bg-white/95 backdrop-blur-2xl border-slate-200 text-slate-800'
          : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-indigo-500" />
            <h2 className={`text-base font-bold m-0 ${isLight ? 'text-slate-900' : 'text-white'}`}>Calculator Settings</h2>
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

        {/* Settings Form */}
        <div className="space-y-3.5 max-h-[68vh] overflow-y-auto pr-1">
          {/* Theme selector */}
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <span>Appearance Theme</span>
            </label>
            <div className={`grid grid-cols-2 gap-1.5 p-1 rounded-2xl border ${
              isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-950/80 border-slate-800'
            }`}>
              <button
                type="button"
                onClick={() => onUpdate({ theme: 'light' })}
                className={`py-1.5 px-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  isLight
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light Glass</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ theme: 'dark' })}
                className={`py-1.5 px-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  !isLight
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark Neon</span>
              </button>
            </div>
          </div>

          {/* Shorthand Auto-Conversion */}
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Auto-Detect Shorthand</span>
            </label>
            <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-2xl border ${
              isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-950/80 border-slate-800'
            }`}>
              <button
                type="button"
                onClick={() => onUpdate({ autoShorthand: 'clean' })}
                className={`py-1.5 px-1.5 text-xs font-semibold rounded-xl transition-all ${
                  settings.autoShorthand === 'clean'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Clean Only
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ autoShorthand: 'smart' })}
                className={`py-1.5 px-1.5 text-xs font-semibold rounded-xl transition-all ${
                  settings.autoShorthand === 'smart'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Smart Dec
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ autoShorthand: 'off' })}
                className={`py-1.5 px-1.5 text-xs font-semibold rounded-xl transition-all ${
                  settings.autoShorthand === 'off'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Manual
              </button>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              {settings.autoShorthand === 'clean' && 'Auto-converts only round multiples (e.g. 10000 → 10K, 250000 → 2.5L).'}
              {settings.autoShorthand === 'smart' && 'Also converts non-round numbers with clean decimals (e.g. 10450 → 10.45K).'}
              {settings.autoShorthand === 'off' && 'Numbers remain full digits unless shorthand chip is tapped.'}
            </p>
          </div>

          {/* Debounce delay */}
          <div className="space-y-1">
            <label className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              <span>Debounce Timer: {settings.debounceMs}ms</span>
            </label>
            <input
              type="range"
              min="400"
              max="1500"
              step="100"
              value={settings.debounceMs}
              onChange={(e) => onUpdate({ debounceMs: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>Fast (400ms)</span>
              <span>Default (800ms)</span>
              <span>Relaxed (1500ms)</span>
            </div>
          </div>

          {/* Currency Symbol */}
          <div className="space-y-1">
            <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Currency Prefix
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '₹ (INR)', value: '₹' },
                { label: '$ (USD)', value: '$' },
                { label: 'None', value: '' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onUpdate({ currencySymbol: item.value })}
                  className={`py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    settings.currencySymbol === item.value
                      ? isLight
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-semibold'
                        : 'bg-slate-800 text-indigo-300 border-indigo-500/50'
                      : isLight
                      ? 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className={`pt-2 border-t space-y-2.5 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            {/* Sound */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <div className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Audio Feedback</div>
                  <div className="text-[10px] text-slate-400">Tactile key clicks & chimes</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdate({ soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            {/* Indian words */}
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Number in Words</div>
                <div className="text-[10px] text-slate-400">e.g., "Twenty-Five Lakhs" below display</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showWords}
                onChange={(e) => onUpdate({ showWords: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            {/* GST bar */}
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Quick GST Bar</div>
                <div className="text-[10px] text-slate-400">+5%, +12%, +18%, +28%, -18% presets</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showGstBar}
                onChange={(e) => onUpdate({ showGstBar: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};
