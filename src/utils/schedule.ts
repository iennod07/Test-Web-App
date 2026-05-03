import type { FrequencyRule, Habit, HabitLog } from "../types";
import { daysBetween, parseDateKey } from "./dates";

export function isHabitScheduledOn(habit: Habit, dateKey: string) {
  if (habit.paused || dateKey < habit.startDate) {
    return false;
  }

  const rule = habit.frequency;

  if (rule.type === "daily") {
    return true;
  }

  if (rule.type === "everyOtherDay") {
    return daysBetween(habit.startDate, dateKey) % 2 === 0;
  }

  return rule.days.includes(parseDateKey(dateKey).getDay());
}

export function frequencyLabel(rule: FrequencyRule) {
  if (rule.type === "daily") return "Daily";
  if (rule.type === "everyOtherDay") return "Every other day";

  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return rule.days.length ? rule.days.map((day) => names[day]).join(", ") : "Custom days";
}

export function getLogForDate(logs: HabitLog[], habitId: string, dateKey: string) {
  return logs.find((log) => log.habitId === habitId && log.date === dateKey);
}

export function upsertLog(logs: HabitLog[], nextLog: HabitLog) {
  const exists = logs.some((log) => log.habitId === nextLog.habitId && log.date === nextLog.date);
  if (!exists) return [nextLog, ...logs];

  return logs.map((log) =>
    log.habitId === nextLog.habitId && log.date === nextLog.date ? nextLog : log,
  );
}
