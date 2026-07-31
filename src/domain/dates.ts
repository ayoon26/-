import {
  addDays,
  differenceInCalendarDays,
  differenceInMinutes,
  formatDistanceToNow,
  isAfter,
  isBefore,
  isWithinInterval,
  parseISO,
} from "date-fns";

export type ISODateString = string;

export function toISODate(date: Date): ISODateString {
  return date.toISOString().slice(0, 10);
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function parseDate(value: ISODateString): Date {
  return parseISO(value);
}

export function daysBetween(a: ISODateString, b: ISODateString): number {
  return differenceInCalendarDays(parseDate(b), parseDate(a));
}

export function minutesBetween(a: string, b: string): number {
  return Math.abs(differenceInMinutes(parseDate(a), parseDate(b)));
}

export function isDateAfter(a: ISODateString, b: ISODateString): boolean {
  return isAfter(parseDate(a), parseDate(b));
}

export function isDateBefore(a: ISODateString, b: ISODateString): boolean {
  return isBefore(parseDate(a), parseDate(b));
}

export function isWithinDays(target: ISODateString, from: ISODateString, days: number): boolean {
  return isWithinInterval(parseDate(target), {
    start: parseDate(from),
    end: addDays(parseDate(from), days),
  });
}

export function addDaysISO(date: ISODateString, days: number): ISODateString {
  return toISODate(addDays(parseDate(date), days));
}

export function relativeTime(iso: string): string {
  return formatDistanceToNow(parseDate(iso), { addSuffix: true });
}

export function formatShortDate(iso: ISODateString): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(parseDate(iso));
}

export function formatFullDate(iso: ISODateString): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
    parseDate(iso)
  );
}

export function formatWeekday(iso: ISODateString): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(parseDate(iso));
}

/** Data older than this is considered stale and should be labeled as such. */
export const STALE_SYNC_THRESHOLD_HOURS = 36;

export function isStaleSync(lastSyncedAtISO: string, nowIso: string = nowISO()): boolean {
  return minutesBetween(lastSyncedAtISO, nowIso) / 60 > STALE_SYNC_THRESHOLD_HOURS;
}
