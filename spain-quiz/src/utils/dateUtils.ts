import type { VacationDay } from '../types/quiz';

const VACATION_START = new Date('2026-04-18T00:00:00');
const VACATION_END_DAY = 9; // day 9 = 26. April = Abschluss-Tag (kein Quiz)
const QUIZ_DAYS = 8; // Tag 1–8 haben Fragen

export function getCurrentVacationDay(): VacationDay {
  const today = new Date();
  const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startNormalized = new Date(
    VACATION_START.getFullYear(),
    VACATION_START.getMonth(),
    VACATION_START.getDate()
  );

  const diffMs = todayNormalized.getTime() - startNormalized.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const day = diffDays + 1;

  if (day < 1) return 'before';
  if (day > VACATION_END_DAY) return 'after';
  return day;
}

export function isQuizDay(day: VacationDay): day is number {
  return typeof day === 'number' && day >= 1 && day <= QUIZ_DAYS;
}

export function isFinaleDay(day: VacationDay): boolean {
  return day === VACATION_END_DAY;
}
