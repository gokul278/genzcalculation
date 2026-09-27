import { useState, useEffect } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { Display } from './components/Display';
import { ShorthandChips } from './components/ShorthandChips';
import { Keypad } from './components/Keypad';
import { GSTBar } from './components/GSTBar';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { UnitGuideModal } from './components/UnitGuideModal';
import {
  History as HistoryIcon,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const calc = useCalculator();
  const theme = calc.settings.theme;
  const isLight = theme === 'light';

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Sync html class for tailwind dark mode if needed
  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [isLight]);

  // Trigger celebration confetti when reaching a huge calculation milestone (>= 1 Crore)
  useEffect(() => {
    if (calc.rawValue >= 10_000_000 && !calc.hasError) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch {
        // Confetti optional
      }
    }
  }, [calc.rawValue, calc.hasError]);

  // Global Keyboard event handler for instant desktop use
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is inside an input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key;

      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        calc.inputDigit(key);
      } else if (key === '.') {
        e.preventDefault();
        calc.inputDecimal();
      } else if (key === '+' || key === '=') {
        if (e.shiftKey && key === '+') {
          e.preventDefault();
          calc.setOperator('+');
        } else if (key === '=') {
          e.preventDefault();
          calc.calculateEquals();
        }
      } else if (key === '-') {
        e.preventDefault();
        calc.setOperator('−');
      } else if (key === '*') {
        e.preventDefault();
        calc.setOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        calc.setOperator('÷');
      } else if (key === 'Enter') {
        e.preventDefault();
        calc.calculateEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        calc.backspace();
      } else if (key === 'Escape') {
        e.preventDefault();
        calc.allClear();
      } else if (key === '%' || key.toLowerCase() === 'p') {
        e.preventDefault();
        calc.handlePercentage();
      } else if (key.toLowerCase() === 'k') {
        e.preventDefault();
        calc.applyShorthand('K');
      } else if (key.toLowerCase() === 'l') {
        e.preventDefault();
        calc.applyShorthand('L');
      } else if (key.toLowerCase() === 'm') {
        e.preventDefault();
        calc.applyShorthand('M');
      } else if (key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (calc.canApplyShorthand && !calc.isShorthandLocked) {
          calc.applyShorthand('Cr');
        } else {
          calc.clearEntry();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [calc]);

  const toggleTheme = () => {
    calc.updateSettings({ theme: isLight ? 'dark' : 'light' });
  };

  return (
    <main
      className={`h-[100dvh] w-full flex items-center justify-center p-2 sm:p-3 overflow-hidden select-none transition-colors duration-300 ${
        isLight
          ? 'bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-200 text-slate-800'
          : 'bg-[#090a0f] text-slate-100'
      }`}
    >
      {/* Background ambient decorative pastel glass glows */}
      {isLight ? (
        <>
          <div className="fixed top-8 left-1/3 -translate-x-1/2 w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed bottom-12 right-1/4 w-96 h-96 bg-purple-300/25 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed top-1/2 right-1/3 w-72 h-72 bg-sky-300/20 rounded-full blur-3xl pointer-events-none -z-10" />
        </>
      ) : (
        <>
          <div className="fixed top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed bottom-10 left-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        </>
      )}

      {/* Calculator Window Frame - Strict 100vh containment */}
      <div
        className={`w-full max-w-[390px] h-full max-h-[96dvh] sm:max-h-[690px] flex flex-col justify-between rounded-3xl p-3 sm:p-3.5 transition-all duration-200 ${
          isLight
            ? 'glass-light-card'
            : 'bg-slate-950/80 backdrop-blur-2xl border border-slate-800/90 shadow-2xl'
        }`}
      >
        {/* App Header */}
        <header className="flex items-center justify-between pb-1 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-sm shadow-indigo-500/30">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight leading-none m-0 flex items-center gap-1.5">
                <span className={isLight ? 'text-slate-900' : 'text-white'}>GenZ Calc</span>
                <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}>
                  K / L / M / Cr
                </span>
              </h1>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-0.5">
            {/* Theme Toggle Button */}
            <button
              type="button"
              id="header-theme-toggle"
              onClick={toggleTheme}
              title={isLight ? 'Switch to Dark mode' : 'Switch to Light mode'}
              className={`p-1.5 rounded-lg transition-colors ${
                isLight ? 'text-amber-600 hover:bg-white/80' : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {isLight ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              id="header-sound-toggle"
              onClick={() => calc.updateSettings({ soundEnabled: !calc.settings.soundEnabled })}
              title={calc.settings.soundEnabled ? 'Mute sound' : 'Unmute sound'}
              className={`p-1.5 rounded-lg transition-colors ${
                isLight ? 'text-slate-600 hover:bg-white/80' : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {calc.settings.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* History Tape */}
            <button
              type="button"
              id="header-history-toggle"
              onClick={() => setIsHistoryOpen(true)}
              title="Calculation History"
              className={`relative p-1.5 rounded-lg transition-colors ${
                isLight ? 'text-slate-600 hover:bg-white/80' : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <HistoryIcon className="w-3.5 h-3.5" />
              {calc.history.length > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
              )}
            </button>

            {/* Settings */}
            <button
              type="button"
              id="header-settings-toggle"
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
              className={`p-1.5 rounded-lg transition-colors ${
                isLight ? 'text-slate-600 hover:bg-white/80' : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <SettingsIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Display Screen */}
        <section aria-label="Calculator display" className="shrink-0 my-0.5">
          <Display
            displayValue={calc.displayValue}
            rawValue={calc.rawValue}
            formattedIndian={calc.formattedIndian}
            expressionHistory={calc.expressionHistory}
            isShorthandLocked={calc.isShorthandLocked}
            shorthandUnit={calc.shorthandUnit}
            hasError={calc.hasError}
            errorMessage={calc.errorMessage}
            memoryValue={calc.memoryValue}
            currencySymbol={calc.settings.currencySymbol}
            showWords={calc.settings.showWords}
            theme={theme}
            resultViewMode={calc.resultViewMode}
            onToggleViewMode={calc.toggleResultViewMode}
            onRecallMemory={calc.memoryRecall}
            onOpenUnitGuide={() => setIsGuideOpen(true)}
          />
        </section>

        {/* Feature A: Shorthand Units Row (K | L | M | Cr) */}
        <section aria-label="Shorthand units" className="shrink-0 my-0.5">
          <ShorthandChips
            currentInput={calc.displayValue}
            rawValue={calc.rawValue}
            isShorthandLocked={calc.isShorthandLocked}
            activeUnit={calc.shorthandUnit}
            theme={theme}
            onApplyUnit={calc.applyShorthand}
            onExpand={calc.expandShorthand}
            disabled={!calc.canApplyShorthand}
          />
        </section>

        {/* Optional Quick GST / Tax Bar */}
        {calc.settings.showGstBar && (
          <section aria-label="GST presets" className="shrink-0 my-0.5">
            <GSTBar
              onApplyGST={calc.applyPresetGST}
              disabled={calc.hasError || calc.rawValue === 0}
              theme={theme}
            />
          </section>
        )}

        {/* Main Keypad */}
        <section aria-label="Calculator keypad" className="shrink-0 my-0.5">
          <Keypad
            onDigit={calc.inputDigit}
            onDecimal={calc.inputDecimal}
            onOperator={calc.setOperator}
            onEquals={calc.calculateEquals}
            onPercentage={calc.handlePercentage}
            onToggleSign={calc.toggleSign}
            onClearEntry={calc.clearEntry}
            onAllClear={calc.allClear}
            onBackspace={calc.backspace}
            onMemoryAdd={calc.memoryAdd}
            onMemorySubtract={calc.memorySubtract}
            onMemoryRecall={calc.memoryRecall}
            onMemoryClear={calc.memoryClear}
            hasMemory={calc.memoryValue !== 0}
            activeOperator={calc.operator}
            theme={theme}
          />
        </section>

        {/* Quick Tips Footer */}
        <footer className={`text-center text-[10px] shrink-0 pt-0.5 flex items-center justify-center gap-1.5 ${
          isLight ? 'text-slate-500' : 'text-slate-500'
        }`}>
          <span>Type <kbd className={`text-[9px] px-1 py-0.5 rounded border ${isLight ? 'bg-white text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>10</kbd> then tap <kbd className="text-[9px] bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded border border-indigo-200">K</kbd> / <kbd className="text-[9px] bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded border border-indigo-200">L</kbd> / <kbd className="text-[9px] bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded border border-indigo-200">Cr</kbd></span>
          <span>•</span>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="text-indigo-600 hover:underline font-medium"
          >
            Guide
          </button>
        </footer>
      </div>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={calc.history}
        currencySymbol={calc.settings.currencySymbol}
        theme={theme}
        onSelectResult={calc.restoreHistoryItem}
        onClearHistory={calc.clearHistory}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={calc.settings}
        onUpdate={calc.updateSettings}
      />

      {/* Shorthand Unit Guide Modal */}
      <UnitGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        theme={theme}
      />
    </main>
  );
}

export default App;
