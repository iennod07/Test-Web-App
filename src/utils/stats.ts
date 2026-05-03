import type { DailySummary, Habit, HabitLog } from "../types";
import { addDays, todayKey } from "./dates";
import { getLogForDate, isHabitScheduledOn } from "./schedule";

function isSuccessfulLog(habit: Habit, log?: HabitLog) {
  if (!log) return false;
  if (habit.category === "build") return log.status === "completed";
  return log.status === "success";
}

export function getHabitStats(habit: Habit, logs: HabitLog[], throughDate = todayKey()) {
  let currentStreak = 0;
  let bestStreak = 0;
  let runningStreak = 0;
  let scheduled = 0;
  let successful = 0;
  let cursor = habit.startDate;

  while (cursor <= throughDate) {
    if (isHabitScheduledOn(habit, cursor)) {
      const log = getLogForDate(logs, habit.id, cursor);
      scheduled += 1;

      if (isSuccessfulLog(habit, log)) {
        successful += 1;
        runningStreak += 1;
        bestStreak = Math.max(bestStreak, runningStreak);
      } else if (log?.status === "skipped") {
        // Skips are neutral and do not break a streak.
      } else {
        runningStreak = 0;
      }
    }

    cursor = addDays(cursor, 1);
  }

  currentStreak = runningStreak;

  return {
    currentStreak,
    bestStreak,
    completionPercentage: scheduled ? Math.round((successful / scheduled) * 100) : 0,
  };
}

export function getDailySummary(habits: Habit[], logs: HabitLog[], date: string): DailySummary {
  const scheduledHabits = habits.filter((habit) => isHabitScheduledOn(habit, date));

  return scheduledHabits.reduce<DailySummary>(
    (summary, habit) => {
      const log = getLogForDate(logs, habit.id, date);
      if (habit.category === "build" && log?.status === "completed") summary.positiveDone += 1;
      if (habit.category === "limit" && log?.status === "success") summary.limitSuccesses += 1;
      if (habit.category === "limit" && log?.status === "slip") summary.slipUps += 1;
      if (log?.status === "missed") summary.missed += 1;
      return summary;
    },
    {
      date,
      scheduledCount: scheduledHabits.length,
      positiveDone: 0,
      limitSuccesses: 0,
      slipUps: 0,
      missed: 0,
    },
  );
}

export function getMotivation(summary: DailySummary) {
  if (!summary.scheduledCount) return "Nothing scheduled today. Rest days count too.";
  if (summary.slipUps) return "Notice the trigger, adjust the plan, and keep going.";
  if (summary.positiveDone + summary.limitSuccesses === summary.scheduledCount) {
    return "Clean day. Your consistency is doing the work.";
  }
  if (summary.positiveDone + summary.limitSuccesses > 0) {
    return "Progress is already logged. Finish the next small step.";
  }
  return "Start with the easiest tracker and build momentum.";
}
