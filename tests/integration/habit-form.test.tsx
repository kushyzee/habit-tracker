import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HabitForm from "@/components/habits/HabitForm";
import HabitCard from "@/components/habits/HabitCard";
import HabitList from "@/components/habits/HabitList";
import { toggleHabitCompletion } from "@/lib/habits";
import { calculateCurrentStreak } from "@/lib/streaks";
import type { Habit } from "@/types/habit";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

const today = new Date().toISOString().split("T")[0];

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "habit-1",
    userId: "user-1",
    name: "Drink Water",
    description: "Stay hydrated",
    frequency: "daily",
    createdAt: new Date().toISOString(),
    completions: [],
    ...overrides,
  };
}

describe("habit form", () => {
  beforeEach(() => {
    localStorage.clear();
    mockReplace.mockClear();
  });

  it("shows a validation error when habit name is empty", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);

    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Habit name is required",
      );
    });

    expect(onSave).not.toHaveBeenCalled();
  });

  it("creates a new habit and renders it in the list", async () => {
    const user = userEvent.setup();
    const habits: Habit[] = [];
    const onSave = vi.fn((data: { name: string; description: string }) => {
      habits.push(
        makeHabit({ name: data.name, description: data.description }),
      );
    });

    const { rerender } = render(
      <HabitForm onSave={onSave} onCancel={vi.fn()} />,
    );

    await user.type(screen.getByTestId("habit-name-input"), "Drink water");
    await user.type(
      screen.getByTestId("habit-description-input"),
      "Stay hydrated",
    );
    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => expect(onSave).toHaveBeenCalledOnce());

    rerender(
      <HabitList
        habits={habits}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const user = userEvent.setup();
    const original = makeHabit();
    const onSave = vi.fn();

    render(
      <HabitForm editingHabit={original} onSave={onSave} onCancel={vi.fn()} />,
    );

    const nameInput = screen.getByTestId("habit-name-input");
    await user.clear(nameInput);
    await user.type(nameInput, "Drink More Water");
    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => expect(onSave).toHaveBeenCalledOnce());

    const saved = onSave.mock.calls[0][0];
    expect(saved.name).toBe("Drink More Water");
    expect(saved).not.toHaveProperty("id");
    expect(saved).not.toHaveProperty("userId");
    expect(saved).not.toHaveProperty("createdAt");
    expect(saved).not.toHaveProperty("completions");
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const user = userEvent.setup();
    const habit = makeHabit();
    const onDelete = vi.fn();

    render(
      <HabitList
        habits={[habit]}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByTestId("habit-delete-drink-water"));
    expect(onDelete).not.toHaveBeenCalled();

    await user.click(screen.getByTestId("confirm-delete-button"));
    expect(onDelete).toHaveBeenCalledWith(habit.id);
  });

  it("toggles completion and updates the streak display", async () => {
    const user = userEvent.setup();
    let habit = makeHabit();
    const onToggle = vi.fn((h: Habit) => {
      habit = toggleHabitCompletion(h, today);
    });

    const { rerender } = render(
      <HabitCard
        habit={habit}
        onToggleComplete={onToggle}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const streakEl = screen.getByTestId("habit-streak-drink-water");
    expect(streakEl).toHaveTextContent("0");

    await user.click(screen.getByTestId("habit-complete-drink-water"));
    expect(onToggle).toHaveBeenCalledOnce();

    rerender(
      <HabitCard
        habit={habit}
        onToggleComplete={onToggle}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("habit-streak-drink-water")).toHaveTextContent(
        "1",
      );
    });

    expect(calculateCurrentStreak(habit.completions)).toBe(1);
  });
});
