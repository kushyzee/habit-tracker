"use client";

import HabitForm from "@/components/habits/HabitForm";
import HabitList from "@/components/habits/HabitList";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { logout } from "@/lib/auth";
import { toggleHabitCompletion } from "@/lib/habits";
import { getHabits, setHabits } from "@/lib/storage";
import { Session } from "@/types/auth";
import { Habit } from "@/types/habit";
import { generateId } from "@/utils/idGenerator";
import { useRouter } from "next/navigation";
import { useState } from "react";
import logo from "@/app/icon.svg";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {(session) => <Dashboard session={session} />}
    </ProtectedRoute>
  );
}

function Dashboard({ session }: { session: Session }) {
  const all = getHabits();
  const userHabits = all.filter((h) => h.userId === session.userId);

  const router = useRouter();
  const [habits, setHabitsState] = useState<Habit[]>(userHabits);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  function persistHabits(updated: Habit[]) {
    const others = all.filter((h) => h.userId !== session.userId);
    setHabits([...others, ...updated]);
    setHabitsState(updated);
  }

  function handleSave(data: { name: string; description: string }) {
    if (editingHabit) {
      const updated = habits.map((h) =>
        h.id === editingHabit.id
          ? {
              ...h,
              name: data.name,
              description: data.description,
            }
          : h,
      );
      persistHabits(updated);
    } else {
      const newHabit: Habit = {
        id: generateId(),
        userId: session.userId,
        name: data.name,
        description: data.description,
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions: [],
      };
      persistHabits([...habits, newHabit]);
    }
    setShowForm(false);
    setEditingHabit(null);
  }

  function handleEdit(habit: Habit) {
    setEditingHabit(habit);
    setShowForm(true);
  }

  function handleDelete(habitId: string) {
    const filtered = habits.filter((ha) => ha.id !== habitId);
    persistHabits(filtered);
  }

  function handleToggleComplete(habit: Habit) {
    const today = new Date().toISOString().split("T")[0];
    const updated = habits.map((h) =>
      h.id === habit.id ? toggleHabitCompletion(h, today) : h,
    );
    persistHabits(updated);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingHabit(null);
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  const greeting = getGreeting();

  return (
    <div
      suppressHydrationWarning
      data-testid="dashboard-page"
      className="min-h-svh bg-canvas"
    >
      <div className="max-w-[680px] mx-auto px-4 sm:px-8 py-5">
        <header className="mb-8">
          <div className="flex items-center mb-4 justify-between">
            <div className="inline-flex items-center gap-1.5">
              <Image
                loading="eager"
                src={logo}
                alt="logo"
                className="w-8 h-auto"
              />
              <span className="font-display italic text-lg font-semibold text-ink-strong">
                Habit Tracker
              </span>
            </div>
            <button
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="
                bg-transparent text-ink border border-border rounded-md
                py-2 px-4 font-body text-sm font-medium
                hover:border-ink hover:bg-surface
                transition-colors duration-150 cursor-pointer
              "
            >
              Log out
            </button>
          </div>
          <div className="h-px bg-border w-full mb-4" />
          <p className="font-body text-sm text-muted">
            {greeting}, {session.email}
          </p>
        </header>

        {!showForm && (
          <button
            data-testid="create-habit-button"
            className="
              bg-accent text-white rounded-md
              py-3 px-6 font-body text-sm font-medium
              hover:bg-accent-hover active:translate-y-px
              transition-colors duration-150 cursor-pointer mb-8
            "
            onClick={() => {
              setShowForm(true);
              setEditingHabit(null);
            }}
          >
            + Add a habit
          </button>
        )}

        {showForm && (
          <div className="mb-6">
            <HabitForm
              key={editingHabit?.id}
              onCancel={handleCancel}
              onSave={handleSave}
              editingHabit={editingHabit}
            />
          </div>
        )}

        {habits.length === 0 && !showForm ? (
          <div
            data-testid="empty-state"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <h2 className="font-display italic text-2xl font-medium text-muted mb-3">
              No habits yet
            </h2>
            <p className="font-body text-sm text-muted mb-8">
              Start by creating your first habit.
            </p>
            <button
              data-testid="create-habit-button-empty"
              onClick={() => setShowForm(true)}
              className="
                bg-accent text-white rounded-md
                py-3 px-6 font-body text-sm font-medium
                hover:bg-accent-hover active:translate-y-px
                transition-colors duration-150 cursor-pointer
              "
            >
              + Add a habit
            </button>
          </div>
        ) : (
          habits.length > 0 &&
          !showForm && (
            <HabitList
              habits={habits}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )
        )}
      </div>
    </div>
  );
}
