import type { ShorthandUnit, ShorthandDefinition } from '../types/calculator';

export const SHORTHAND_UNITS: Record<ShorthandUnit, ShorthandDefinition> = {
  K: {
    unit: 'K',
    name: 'Thousand',
    hindiName: 'Hazaar',
    multiplier: 1_000,
    formattedMultiplier: '1,000',
    description: '10³ — One Thousand',
    isIndian: true,
  },
  L: {
    unit: 'L',
    name: 'Lakh',
    hindiName: 'Lakh',
    multiplier: 100_000,
    formattedMultiplier: '1,00,000',
    description: '10⁵ — One Hundred Thousand',
    isIndian: true,
  },
  M: {
    unit: 'M',
    name: 'Million',
    hindiName: 'Ten Lakh',
    multiplier: 1_000_000,
    formattedMultiplier: '10,00,000 (1,000,000)',
    description: '10⁶ — 10 Lakhs',
    isIndian: false,
  },
  Cr: {
    unit: 'Cr',
    name: 'Crore',
    hindiName: 'Crore',
    multiplier: 10_000_000,
    formattedMultiplier: '1,00,00,000',
    description: '10⁷ — Ten Million (100 Lakhs)',
    isIndian: true,
  },
  Arab: {
    unit: 'Arab',
    name: 'Arab',
    hindiName: 'Arab',
    multiplier: 1_000_000_000,
    formattedMultiplier: '1,00,00,00,000',
    description: '10⁹ — One Hundred Crores (1 Billion)',
    isIndian: true,
  },
};

/**
 * Format a number using the Indian numbering system grouping:
 * e.g., 12345678.5 -> "1,23,45,678.50"
 */
export function formatIndianNumber(num: number, maxDecimals = 6): string {
  if (isNaN(num) || !isFinite(num)) return 'Error';

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const parts = absNum.toString().split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian numbering: last 3 digits, then groups of 2 digits
  let result = '';
  if (integerPart.length > 3) {
    const last3 = integerPart.substring(integerPart.length - 3);
    const rest = integerPart.substring(0, integerPart.length - 3);
    // Group remaining into pairs of 2 from right to left
    const restGrouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${restGrouped},${last3}`;
  } else {
    result = integerPart;
  }

  if (decimalPart !== undefined) {
    // Trim to maxDecimals
    const trimmedDecimal = decimalPart.slice(0, maxDecimals).replace(/0+$/, '');
    if (trimmedDecimal.length > 0) {
      result += `.${trimmedDecimal}`;
    }
  }

  return isNegative ? `-${result}` : result;
}

/**
 * Cleanly format float string, trimming trailing zeroes (e.g. 10.0 -> 10, 2.500 -> 2.5)
 */
export function trimFloat(num: number, maxDigits = 4): string {
  // Format to fixed with maxDigits and remove trailing zeros
  const fixed = num.toFixed(maxDigits);
  return fixed.replace(/\.?0+$/, '');
}

/**
 * Checks if a number cleanly divides by unit multiplier without messy floating remainders.
 * Allows clean decimals like 2.5 Lakhs (250,000 / 100,000 = 2.5), 1.25 Crore, etc.
 * But rejects messy decimals like 10,450 / 1,000 = 10.45 unless allowed.
 */
export function isCleanMultiplier(num: number, unitMultiplier: number, allowTwoDecimals = false): boolean {
  const quotient = num / unitMultiplier;
  
  // Whole number multiple
  if (Number.isInteger(quotient)) {
    return true;
  }

  // Check if quotient is a clean decimal (e.g., .5, .25, .75, or up to 2 clean decimal digits)
  const remainder = Math.round((quotient - Math.floor(quotient)) * 10000) / 10000;
  
  // Clean single decimal place (.1, .2, .3, .4, .5, .6, .7, .8, .9)
  if (Math.abs(remainder * 10 - Math.round(remainder * 10)) < 1e-6) {
    return true;
  }

  // Clean quarter decimals (.25, .75)
  if (Math.abs(remainder * 4 - Math.round(remainder * 4)) < 1e-6) {
    return true;
  }

  // If user allows 2 decimal clean multiples (e.g. 1.25, 2.75)
  if (allowTwoDecimals) {
    if (Math.abs(remainder * 100 - Math.round(remainder * 100)) < 1e-6) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a number auto-converts to an Indian shorthand unit per Part 2.3 of prompt.
 * Units auto-detected:
 * - Whole/clean multiple of 1,000 and < 1,00,000 -> NK (e.g. 10000 -> 10K)
 * - Whole/clean multiple of 1,00,000 and < 1,00,00,000 -> NL (e.g. 250000 -> 2.5L)
 * - Whole/clean multiple of 10,000,000 -> NCr (e.g. 50000000 -> 5Cr)
 * M is excluded from auto-detect per prompt recommendation to avoid ambiguity with Lakhs.
 */
export function detectAutoShorthand(
  num: number,
  mode: 'clean' | 'smart' | 'off' = 'clean'
): { unit: ShorthandUnit; display: string; multiplier: number } | null {
  if (mode === 'off' || isNaN(num) || !isFinite(num) || num === 0) {
    return null;
  }

  const isNegative = num < 0;
  const abs = Math.abs(num);

  const allowTwoDecimals = mode === 'smart';

  // 1. Crore range (>= 1,00,00,000 / 10,000,000)
  if (abs >= 10_000_000) {
    const unitMultiplier = 10_000_000;
    if (isCleanMultiplier(abs, unitMultiplier, allowTwoDecimals)) {
      const quotient = abs / unitMultiplier;
      const formattedQ = trimFloat(quotient, allowTwoDecimals ? 3 : 2);
      return {
        unit: 'Cr',
        display: `${isNegative ? '-' : ''}${formattedQ}Cr`,
        multiplier: unitMultiplier,
      };
    }
  }

  // 2. Lakh range (1,00,000 <= abs < 1,00,00,000)
  if (abs >= 100_000 && abs < 10_000_000) {
    const unitMultiplier = 100_000;
    if (isCleanMultiplier(abs, unitMultiplier, allowTwoDecimals)) {
      const quotient = abs / unitMultiplier;
      const formattedQ = trimFloat(quotient, allowTwoDecimals ? 3 : 2);
      return {
        unit: 'L',
        display: `${isNegative ? '-' : ''}${formattedQ}L`,
        multiplier: unitMultiplier,
      };
    }
  }

  // 3. Thousand range (1,000 <= abs < 1,00,000)
  if (abs >= 1_000 && abs < 100_000) {
    const unitMultiplier = 1_000;
    if (isCleanMultiplier(abs, unitMultiplier, allowTwoDecimals)) {
      const quotient = abs / unitMultiplier;
      const formattedQ = trimFloat(quotient, allowTwoDecimals ? 3 : 2);
      return {
        unit: 'K',
        display: `${isNegative ? '-' : ''}${formattedQ}K`,
        multiplier: unitMultiplier,
      };
    }
  }

  return null;
}

/**
 * Format a calculation result into the best possible Indian shorthand representation.
 * Used when calculation completes (=), to display e.g. 5.1L for 510,000.
 */
export function formatResultShorthand(num: number): { shorthand: string; unit: ShorthandUnit } | null {
  if (isNaN(num) || !isFinite(num) || num === 0) return null;

  const isNegative = num < 0;
  const abs = Math.abs(num);

  if (abs >= 10_000_000) {
    const q = abs / 10_000_000;
    return {
      shorthand: `${isNegative ? '-' : ''}${trimFloat(q, 3)}Cr`,
      unit: 'Cr',
    };
  }

  if (abs >= 100_000) {
    const q = abs / 100_000;
    return {
      shorthand: `${isNegative ? '-' : ''}${trimFloat(q, 3)}L`,
      unit: 'L',
    };
  }

  if (abs >= 1_000) {
    const q = abs / 1_000;
    return {
      shorthand: `${isNegative ? '-' : ''}${trimFloat(q, 2)}K`,
      unit: 'K',
    };
  }

  return null;
}

/**
 * Convert number to words in Indian Numbering System
 * e.g., 2500000 -> "Twenty-Five Lakhs"
 * e.g., 10000 -> "Ten Thousand"
 */
export function numberToWordsIndian(num: number): string {
  if (isNaN(num) || !isFinite(num)) return '';
  if (num === 0) return 'Zero';

  const isNegative = num < 0;
  let n = Math.floor(Math.abs(num));
  const decimal = Math.round((Math.abs(num) - n) * 100);

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(val: number): string {
    if (val === 0) return '';
    if (val < 20) return ones[val];
    const t = tens[Math.floor(val / 10)];
    const o = ones[val % 10];
    return o ? `${t} ${o}` : t;
  }

  function convertThreeDigits(val: number): string {
    const hundred = Math.floor(val / 100);
    const rest = val % 100;
    let str = '';
    if (hundred > 0) {
      str += `${ones[hundred]} Hundred`;
    }
    if (rest > 0) {
      if (str) str += ' ';
      str += convertTwoDigits(rest);
    }
    return str;
  }

  const parts: string[] = [];

  // Arab (100 Crore / 10^9)
  if (n >= 1_000_000_000) {
    const arab = Math.floor(n / 1_000_000_000);
    parts.push(`${convertTwoDigits(arab)} Arab`);
    n %= 1_000_000_000;
  }

  // Crore (10^7)
  if (n >= 10_000_000) {
    const crore = Math.floor(n / 10_000_000);
    parts.push(`${convertTwoDigits(crore)} Crore`);
    n %= 10_000_000;
  }

  // Lakh (10^5)
  if (n >= 100_000) {
    const lakh = Math.floor(n / 100_000);
    parts.push(`${convertTwoDigits(lakh)} Lakh`);
    n %= 100_000;
  }

  // Thousand (10^3)
  if (n >= 1_000) {
    const thousand = Math.floor(n / 1_000);
    parts.push(`${convertTwoDigits(thousand)} Thousand`);
    n %= 1_000;
  }

  // Remaining (Hundreds & Ones)
  if (n > 0) {
    parts.push(convertThreeDigits(n));
  }

  let result = parts.join(' ');
  if (decimal > 0) {
    result += ` and ${convertTwoDigits(decimal)} Paise`;
  }

  return isNegative ? `Minus ${result}` : result;
}
