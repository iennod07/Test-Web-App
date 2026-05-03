export type HabitCategory = "build" | "limit";

export type FrequencyRule =
  | { type: "daily" }
  | { type: "everyOtherDay" }
  | { type: "customDays"; days: number[] };

export type Habit = {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  frequency: FrequencyRule;
  target?: string;
  startDate: string;
  paused: boolean;
  createdAt: string;
};

export type BuildHabitStatus = "completed" | "skipped" | "missed";
export type LimitHabitStatus = "success" | "slip";

export type HabitLog = {
  id: string;
  habitId: string;
  date: string;
  status: BuildHabitStatus | LimitHabitStatus;
  amount?: string;
  notes?: string;
  triggerNotes?: string;
  updatedAt: string;
};

export type DailySummary = {
  date: string;
  scheduledCount: number;
  positiveDone: number;
  limitSuccesses: number;
  slipUps: number;
  missed: number;
};

export type HabitFormValues = {
  name: string;
  description: string;
  category: HabitCategory;
  frequencyType: FrequencyRule["type"];
  customDays: number[];
  target: string;
  startDate: string;
};
