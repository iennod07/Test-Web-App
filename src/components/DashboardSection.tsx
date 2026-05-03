import type { Habit, HabitLog } from "../types";
import { HabitCard } from "./HabitCard";

type DashboardSectionProps = {
  title: string;
  subtitle: string;
  habits: Habit[];
  logs: HabitLog[];
  selectedDate: string;
  scheduled: boolean;
  onMark: (habit: Habit, status: HabitLog["status"], extras?: Partial<HabitLog>) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onTogglePause: (habitId: string) => void;
};

export function DashboardSection({
  title,
  subtitle,
  habits,
  logs,
  selectedDate,
  scheduled,
  onMark,
  onEdit,
  onDelete,
  onTogglePause,
}: DashboardSectionProps) {
  return (
    <section className="section-block">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-500 shadow-sm">{habits.length}</span>
      </div>

      {habits.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              logs={logs}
              log={logs.find((log) => log.habitId === habit.id && log.date === selectedDate)}
              scheduled={scheduled}
              onMark={onMark}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePause={onTogglePause}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">No trackers here for this day.</div>
      )}
    </section>
  );
}
