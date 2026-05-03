import { CalendarDays, Plus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardSection } from "./components/DashboardSection";
import { HabitForm } from "./components/HabitForm";
import { starterHabits } from "./data/starterHabits";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Habit, HabitLog } from "./types";
import { formatLongDate, todayKey } from "./utils/dates";
import { getLogForDate, isHabitScheduledOn, upsertLog } from "./utils/schedule";
import { getDailySummary, getMotivation } from "./utils/stats";

export default function App() {
  const [habits, setHabits] = useLocalStorage<Habit[]>("daily-tracker-habits", starterHabits);
  const [logs, setLogs] = useLocalStorage<HabitLog[]>("daily-tracker-logs", []);
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const visibleHabits = habits.filter((habit) => !habit.paused || getLogForDate(logs, habit.id, selectedDate));
  const scheduled = visibleHabits.filter((habit) => isHabitScheduledOn(habit, selectedDate));
  const notScheduled = visibleHabits.filter((habit) => !isHabitScheduledOn(habit, selectedDate));
  const positiveHabits = scheduled.filter((habit) => habit.category === "build");
  const limitHabits = scheduled.filter((habit) => habit.category === "limit");
  const summary = useMemo(() => getDailySummary(habits, logs, selectedDate), [habits, logs, selectedDate]);

  function openNewHabitForm() {
    setEditingHabit(null);
    setFormOpen(true);
  }

  function saveHabit(nextHabit: Habit) {
    setHabits((current) => {
      const exists = current.some((habit) => habit.id === nextHabit.id);
      return exists ? current.map((habit) => (habit.id === nextHabit.id ? nextHabit : habit)) : [nextHabit, ...current];
    });
    setFormOpen(false);
    setEditingHabit(null);
  }

  function markHabit(habit: Habit, status: HabitLog["status"], extras: Partial<HabitLog> = {}) {
    const now = new Date().toISOString();
    setLogs((current) =>
      upsertLog(current, {
        id: getLogForDate(current, habit.id, selectedDate)?.id ?? crypto.randomUUID(),
        habitId: habit.id,
        date: selectedDate,
        status,
        updatedAt: now,
        ...extras,
      }),
    );
  }

  function deleteHabit(habitId: string) {
    const confirmed = window.confirm("Delete this tracker and its logs?");
    if (!confirmed) return;
    setHabits((current) => current.filter((habit) => habit.id !== habitId));
    setLogs((current) => current.filter((log) => log.habitId !== habitId));
  }

  function togglePause(habitId: string) {
    setHabits((current) =>
      current.map((habit) => (habit.id === habitId ? { ...habit, paused: !habit.paused } : habit)),
    );
  }

  function editHabit(habit: Habit) {
    setEditingHabit(habit);
    setFormOpen(true);
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="rounded-[32px] bg-white/85 p-5 shadow-apple backdrop-blur sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
                <CalendarDays size={17} /> {formatLongDate(selectedDate)}
              </p>
              <h1 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-5xl">Daily Tracker</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{getMotivation(summary)}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="date-input"
                aria-label="Choose tracker date"
              />
              <button onClick={openNewHabitForm} className="primary-button">
                <Plus size={18} /> New Tracker
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="summary-card">
              <span>{summary.scheduledCount}</span>
              <p>Scheduled</p>
            </div>
            <div className="summary-card">
              <span>{summary.positiveDone}</span>
              <p>Positive done</p>
            </div>
            <div className="summary-card">
              <span>{summary.limitSuccesses}</span>
              <p>Limit wins</p>
            </div>
            <div className="summary-card">
              <span>{summary.slipUps}</span>
              <p>Slip-ups</p>
            </div>
          </div>
        </header>

        <div className="rounded-[28px] bg-slate-950 px-5 py-4 text-white shadow-apple">
          <div className="flex items-center gap-3">
            <Sparkles className="text-emerald-300" size={20} />
            <p className="text-sm font-medium">
              {summary.missed > 0
                ? "Missed items are feedback. Adjust the tracker or restart the streak tomorrow."
                : "Small daily proof beats perfect plans. Log what happened today."}
            </p>
          </div>
        </div>

        <DashboardSection
          title="Today's Positive Habits"
          subtitle="Build the routines you want more of."
          habits={positiveHabits}
          logs={logs}
          selectedDate={selectedDate}
          scheduled
          onMark={markHabit}
          onEdit={editHabit}
          onDelete={deleteHabit}
          onTogglePause={togglePause}
        />

        <DashboardSection
          title="Today's Limit/Quit Trackers"
          subtitle="Track success days, slip-ups, amounts, and triggers."
          habits={limitHabits}
          logs={logs}
          selectedDate={selectedDate}
          scheduled
          onMark={markHabit}
          onEdit={editHabit}
          onDelete={deleteHabit}
          onTogglePause={togglePause}
        />

        <DashboardSection
          title="Not Scheduled Today"
          subtitle="Every-other-day and custom trackers appear here when they are off-cycle."
          habits={notScheduled}
          logs={logs}
          selectedDate={selectedDate}
          scheduled={false}
          onMark={markHabit}
          onEdit={editHabit}
          onDelete={deleteHabit}
          onTogglePause={togglePause}
        />

        <HistoryView habits={habits} logs={logs} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      {formOpen && <HabitForm habit={editingHabit} onSave={saveHabit} onClose={() => setFormOpen(false)} />}
    </main>
  );
}
