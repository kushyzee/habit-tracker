import { Habit } from "@/types/habit";

export function toggleHabitCompletion(habit: Habit, date: string) {
  const exists = habit.completions.includes(date);

  const completions = exists
    ? habit.completions.filter((d) => d !== date)
    : [...new Set([...habit.completions, date])];

  return { ...habit, completions };
}
