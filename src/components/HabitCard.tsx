import { CheckCircle2, CircleSlash, Edit3, Pause, Play, RotateCcw, Trash2, XCircle } from "lucide-react";
import type { Habit, HabitLog } from "../types";
import { frequencyLabel } from "../utils/schedule";
import { getHabitStats } from "../utils/stats";

type HabitCardProps = {
  habit: Habit;
  log?: HabitLog;
  logs: HabitLog[];
  scheduled: boolean;
  onMark: (habit: Habit, status: HabitLog["status"], extras?: Partial<HabitLog>) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onTogglePause: (habitId: string) => void;
};

export function HabitCard({ habit, log, logs, scheduled, onMark, onEdit, onDelete, onTogglePause }: HabitCardProps) {
  const stats = getHabitStats(habit, logs);
  const statusLabel = log ? log.status.replace("-", " ") : scheduled ? "open" : "not scheduled";
  const isLimit = habit.category === "limit";

  function logSlip() {
    const amount = window.prompt("Amount consumed/done?", log?.amount ?? "");
    if (amount === null) return;
    const triggerNotes = window.prompt("Trigger notes?", log?.triggerNotes ?? "") ?? "";
    onMark(habit, "slip", { amount, triggerNotes });
  }

  return (
    <article className={`habit-card ${habit.paused ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`pill ${isLimit ? "pill-limit" : "pill-build"}`}>{isLimit ? "Limit/Quit" : "Build"}</span>
            <span className="pill pill-soft">{frequencyLabel(habit.frequency)}</span>
            {habit.paused && <span className="pill pill-soft">Paused</span>}
          </div>
          <h3 className="truncate text-xl font-semibold text-slate-950">{habit.name}</h3>
          {habit.description && <p className="mt-1 text-sm leading-6 text-slate-600">{habit.description}</p>}
          {habit.target && <p className="mt-2 text-sm font-medium text-slate-800">Target: {habit.target}</p>}
        </div>
        <div className="flex shrink-0 gap-1">
          <button className="icon-button" onClick={() => onEdit(habit)} aria-label={`Edit ${habit.name}`}>
            <Edit3 size={18} />
          </button>
          <button className="icon-button" onClick={() => onTogglePause(habit.id)} aria-label={habit.paused ? `Reactivate ${habit.name}` : `Pause ${habit.name}`}>
            {habit.paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <button className="icon-button danger-icon" onClick={() => onDelete(habit.id)} aria-label={`Delete ${habit.name}`}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-2 text-center">
        <div>
          <p className="stat-number">{stats.currentStreak}</p>
          <p className="stat-label">Current</p>
        </div>
        <div>
          <p className="stat-number">{stats.bestStreak}</p>
          <p className="stat-label">Best</p>
        </div>
        <div>
          <p className="stat-number">{stats.completionPercentage}%</p>
          <p className="stat-label">Rate</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">{statusLabel}</span>
        {!scheduled && <span className="text-sm text-slate-500">Not scheduled today</span>}

        {scheduled && !isLimit && (
          <>
            <button className="action-button success" onClick={() => onMark(habit, "completed")}>
              <CheckCircle2 size={17} /> Complete
            </button>
            <button className="action-button neutral" onClick={() => onMark(habit, "skipped")}>
              <CircleSlash size={17} /> Skip
            </button>
            <button className="action-button danger" onClick={() => onMark(habit, "missed")}>
              <XCircle size={17} /> Missed
            </button>
          </>
        )}

        {scheduled && isLimit && (
          <>
            <button className="action-button success" onClick={() => onMark(habit, "success")}>
              <CheckCircle2 size={17} /> Successful day
            </button>
            <button className="action-button danger" onClick={logSlip}>
              <RotateCcw size={17} /> Log Slip-Up
            </button>
          </>
        )}
      </div>

      {(log?.amount || log?.triggerNotes || log?.notes) && (
        <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {log.amount && <p>Amount: {log.amount}</p>}
          {log.triggerNotes && <p>Triggers: {log.triggerNotes}</p>}
          {log.notes && <p>Notes: {log.notes}</p>}
        </div>
      )}
    </article>
  );
}
