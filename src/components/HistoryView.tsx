import type { Habit, HabitLog } from "../types";
import { addDays, formatLongDate, todayKey } from "../utils/dates";
import { getDailySummary } from "../utils/stats";

type HistoryViewProps = {
  habits: Habit[];
  logs: HabitLog[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export function HistoryView({ habits, logs, selectedDate, onSelectDate }: HistoryViewProps) {
  const today = todayKey();
  const days = Array.from({ length: 14 }, (_, index) => addDays(today, -index));

  return (
    <section className="section-block">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-950">History</h2>
        <p className="text-sm text-slate-500">Review recent days and jump back to update logs.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {days.map((day) => {
          const summary = getDailySummary(habits, logs, day);
          const done = summary.positiveDone + summary.limitSuccesses;
          const active = day === selectedDate;

          return (
            <button
              key={day}
              onClick={() => onSelectDate(day)}
              className={`history-day ${active ? "history-day-active" : ""}`}
            >
              <span className="font-semibold text-slate-950">{formatLongDate(day)}</span>
              <span className="text-sm text-slate-500">
                {done}/{summary.scheduledCount} steady, {summary.slipUps} slip-ups
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
