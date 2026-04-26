import HabitCard from "./HabitCard";
import type { Habit } from "@/types/habit";

interface HabitListProps {
  habits: Habit[];
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitList({
  habits,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitListProps) {
  return (
    <ul className="flex flex-col gap-4 list-none">
      {habits.map((habit) => (
        <li key={habit.id}>
          <HabitCard
            habit={habit}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
