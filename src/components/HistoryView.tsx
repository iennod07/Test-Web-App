import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Habit, HabitLog } from "../types";
import {
  addMonths,
  formatMonthYear,
  getCalendarMonthDays,
  isSameMonth,
  mondayFirstDayNames,
  parseDateKey,
  todayKey,
} from "../utils/dates";
import { getDailySummary } from "../utils/stats";

type HistoryViewProps = {
  habits: Habit[];
  logs: HabitLog[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export function HistoryView({ habits, logs, selectedDate, onSelectDate }: HistoryViewProps) {
  const today = todayKey();
  const [visibleMonth, setVisibleMonth] = useState(selectedDate);
  const calendarDays = getCalendarMonthDays(visibleMonth);

  useEffect(() => {
    setVisibleMonth(selectedDate);
  }, [selectedDate]);

  function moveMonth(amount: number) {
    setVisibleMonth((current) => addMonths(current, amount));
  }

  return (
    <section className="section-block">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">History Calendar</h2>
          <p className="text-sm text-slate-500">Select a previous date to populate that day's activities.</p>
        </div>
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <button className="icon-button" onClick={() => moveMonth(-1)} aria-label="Previous month">
            <ChevronLeft size={18} />
          </button>
          <span className="min-w-36 text-center text-sm font-semibold text-slate-700">{formatMonthYear(visibleMonth)}</span>
          <button className="icon-button" onClick={() => moveMonth(1)} aria-label="Next month">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="calendar-grid mb-2">
        {mondayFirstDayNames.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarDays.map((day) => {
          const summary = getDailySummary(habits, logs, day);
          const done = summary.positiveDone + summary.limitSuccesses;
          const active = day === selectedDate;
          const outsideMonth = !isSameMonth(day, visibleMonth);
          const futureDate = day > today;
          const dayNumber = parseDateKey(day).getDate();

          return (
            <button
              key={day}
              disabled={futureDate}
              onClick={() => onSelectDate(day)}
              className={`calendar-day ${active ? "calendar-day-active" : ""} ${outsideMonth ? "calendar-day-muted" : ""}`}
            >
              <span className="calendar-day-number">{dayNumber}</span>
              <span className="calendar-day-meta">
                {summary.scheduledCount ? `${done}/${summary.scheduledCount}` : "Rest"}
              </span>
              {summary.slipUps > 0 && <span className="calendar-slip-badge">{summary.slipUps}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
