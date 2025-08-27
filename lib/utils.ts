import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-AU', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Australia/Sydney',
  }).format(d);
}

export function isToday(date: Date | string): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

export function isLive(commenceTime: Date | string): boolean {
  const now = new Date();
  const matchTime = new Date(commenceTime);
  const twoHoursAfter = new Date(matchTime.getTime() + 2 * 60 * 60 * 1000);
  
  return now >= matchTime && now <= twoHoursAfter;
}

export function getTimeUntilMatch(commenceTime: Date | string): string {
  const now = new Date();
  const matchTime = new Date(commenceTime);
  const diff = matchTime.getTime() - now.getTime();
  
  if (diff < 0) return 'Started';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  return `${hours}h ${minutes}m`;
}

export function formatOdds(price: number, format: 'decimal' | 'fractional' = 'decimal'): string {
  if (format === 'decimal') {
    return price.toFixed(2);
  }
  
  // Convert decimal to fractional
  const decimalPart = price - 1;
  const denominator = 100;
  const numerator = Math.round(decimalPart * denominator);
  const gcd = findGCD(numerator, denominator);
  
  return `${numerator / gcd}/${denominator / gcd}`;
}

function findGCD(a: number, b: number): number {
  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function findBestOdds(
  outcomes: Array<{ bookmaker: string; price: number }>
): { bookmaker: string; price: number } | null {
  if (!outcomes.length) return null;
  
  return outcomes.reduce((best, current) => {
    return current.price > best.price ? current : best;
  });
}

export function calculateMargin(odds: number[]): number {
  const probabilities = odds.map(odd => 1 / odd);
  const totalProbability = probabilities.reduce((sum, prob) => sum + prob, 0);
  return ((totalProbability - 1) * 100);
}

export function groupMatchesByDate(matches: any[]): Record<string, any[]> {
  return matches.reduce((grouped, match) => {
    const date = new Date(match.commence_time).toLocaleDateString('en-AU');
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(match);
    return grouped;
  }, {});
}