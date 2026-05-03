# Daily Habit Tracker

A responsive React, TypeScript, and Tailwind CSS daily habit tracker. It stores data in `localStorage` for the first version, so habits and logs stay in the same browser without requiring accounts or a backend.

## Features

- Add unlimited custom trackers.
- Edit, delete, pause, and reactivate trackers.
- Track positive habits separately from limit/quit habits.
- Frequency rules: daily, every other day, and custom days of the week.
- Every-other-day scheduling is calculated from each tracker's start date.
- Mark positive habits completed, skipped, or missed.
- Mark limit/quit trackers as successful days or slip-ups with amount and trigger notes.
- View current streak, best streak, and completion percentage.
- Review recent days in the history view.
- Starter trackers included: Daily walk, Exercise, Read 30 minutes, No fast food, Limit sugar, and No alcohol.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Tracking Logic

The main scheduling logic lives in `src/utils/schedule.ts`.

- Daily trackers are scheduled every day after their start date.
- Every-other-day trackers compare the selected date to the tracker start date. If the day difference is divisible by two, the tracker is scheduled.
- Custom-day trackers compare the selected date's weekday to the saved weekday list.
- Paused trackers are hidden from new scheduled work, but any existing log for the selected date can still be shown.

Streak and completion calculations live in `src/utils/stats.ts`.

- Positive habits count `completed` as success.
- Limit/quit habits count `success` as success.
- `skipped` is neutral and does not break a streak.
- `missed` and slip-ups are kept visible so users can review patterns and triggers.

## Future Expansion

The data model is separated into `Habit`, `HabitLog`, `FrequencyRule`, and `DailySummary` types so the app can later add user accounts, cloud sync, reminders, and analytics without replacing the UI.
