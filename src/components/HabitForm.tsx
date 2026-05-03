import { Check, Plus, X } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { FrequencyRule, Habit, HabitFormValues } from "../types";
import { dayNames, todayKey } from "../utils/dates";

type HabitFormProps = {
  habit?: Habit | null;
  onSave: (habit: Habit) => void;
  onClose: () => void;
};

const defaultValues: HabitFormValues = {
  name: "",
  description: "",
  category: "build",
  frequencyType: "daily",
  customDays: [],
  target: "",
  startDate: todayKey(),
};

function habitToForm(habit?: Habit | null): HabitFormValues {
  if (!habit) return defaultValues;
  return {
    name: habit.name,
    description: habit.description,
    category: habit.category,
    frequencyType: habit.frequency.type,
    customDays: habit.frequency.type === "customDays" ? habit.frequency.days : [],
    target: habit.target ?? "",
    startDate: habit.startDate,
  };
}

function buildFrequency(values: HabitFormValues): FrequencyRule {
  if (values.frequencyType === "customDays") {
    return { type: "customDays", days: values.customDays };
  }
  return { type: values.frequencyType };
}

export function HabitForm({ habit, onSave, onClose }: HabitFormProps) {
  const [values, setValues] = useState<HabitFormValues>(() => habitToForm(habit));

  useEffect(() => {
    setValues(habitToForm(habit));
  }, [habit]);

  const canSave = useMemo(() => {
    return values.name.trim().length > 0 && values.startDate && (values.frequencyType !== "customDays" || values.customDays.length > 0);
  }, [values]);

  function update<K extends keyof HabitFormValues>(key: K, value: HabitFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleDay(day: number) {
    setValues((current) => {
      const exists = current.customDays.includes(day);
      return {
        ...current,
        customDays: exists
          ? current.customDays.filter((currentDay) => currentDay !== day)
          : [...current.customDays, day].sort(),
      };
    });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSave) return;

    const now = new Date().toISOString();
    onSave({
      id: habit?.id ?? crypto.randomUUID(),
      name: values.name.trim(),
      description: values.description.trim(),
      category: values.category,
      frequency: buildFrequency(values),
      target: values.target.trim() || undefined,
      startDate: values.startDate,
      paused: habit?.paused ?? false,
      createdAt: habit?.createdAt ?? now,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/30 px-4 py-5 backdrop-blur-sm sm:items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-[28px] bg-white p-5 shadow-apple sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">{habit ? "Edit tracker" : "New tracker"}</p>
            <h2 className="text-2xl font-semibold text-slate-950">{habit ? habit.name : "Create a daily tracker"}</h2>
          </div>
          <button type="button" onClick={onClose} className="icon-button" aria-label="Close tracker form">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field sm:col-span-2">
            <span>Name</span>
            <input value={values.name} onChange={(event) => update("name", event.target.value)} placeholder="Morning walk" />
          </label>

          <label className="field sm:col-span-2">
            <span>Description or notes</span>
            <textarea
              value={values.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="What does success look like?"
              rows={3}
            />
          </label>

          <label className="field">
            <span>Category</span>
            <select value={values.category} onChange={(event) => update("category", event.target.value as HabitFormValues["category"])}>
              <option value="build">Build Habit</option>
              <option value="limit">Limit/Quit Habit</option>
            </select>
          </label>

          <label className="field">
            <span>Target amount</span>
            <input value={values.target} onChange={(event) => update("target", event.target.value)} placeholder="30 minutes, 0 drinks" />
          </label>

          <label className="field">
            <span>Frequency</span>
            <select
              value={values.frequencyType}
              onChange={(event) => update("frequencyType", event.target.value as HabitFormValues["frequencyType"])}
            >
              <option value="daily">Daily</option>
              <option value="everyOtherDay">Every other day</option>
              <option value="customDays">Custom days of week</option>
            </select>
          </label>

          <label className="field">
            <span>Start date</span>
            <input type="date" value={values.startDate} onChange={(event) => update("startDate", event.target.value)} />
          </label>

          {values.frequencyType === "customDays" && (
            <div className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-600">Scheduled days</span>
              <div className="grid grid-cols-7 gap-2">
                {dayNames.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(index)}
                    className={`day-toggle ${values.customDays.includes(index) ? "day-toggle-active" : ""}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">
            Cancel
          </button>
          <button type="submit" disabled={!canSave} className="primary-button">
            {habit ? <Check size={18} /> : <Plus size={18} />}
            {habit ? "Save changes" : "Add tracker"}
          </button>
        </div>
      </form>
    </div>
  );
}
