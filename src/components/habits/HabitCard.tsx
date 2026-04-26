"use client";

import { useState } from "react";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import type { Habit } from "@/types/habit";

interface HabitCardProps {
  habit: Habit;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitCard({
  habit,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split("T")[0];
  const isComplete = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions);

  const createdDate = new Date(habit.createdAt).toLocaleDateString("en-US", {
    weekday: "short",
  });

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`
        relative rounded-md p-6 border-l-[3px] transition-colors duration-200
        ${
          isComplete
            ? "bg-accent-wash border-l-accent"
            : "bg-surface border-l-border"
        }
      `}
    >
      {/* Top row: circle + name + actions */}
      <div className="flex items-start justify-between gap-4">
        {/* Completion toggle + name */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            data-testid={`habit-complete-${slug}`}
            onClick={() => onToggleComplete(habit)}
            aria-label={
              isComplete
                ? `Mark ${habit.name} incomplete`
                : `Mark ${habit.name} complete`
            }
            className={`
              shrink-0 w-6 h-6 rounded-full border-2 transition-colors duration-200
              flex items-center justify-center cursor-pointer
              ${
                isComplete
                  ? "bg-accent border-accent"
                  : "bg-transparent border-border hover:border-muted"
              }
            `}
          >
            {isComplete && (
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <div className="min-w-0">
            <h3
              className={`
                font-body text-lg font-medium leading-snug truncate
                ${isComplete ? "text-muted" : "text-ink-strong"}
              `}
            >
              {habit.name}
            </h3>
            <p className="font-body text-xs text-muted mt-0.5">
              {createdDate} · {habit.frequency}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit)}
            aria-label={`Edit ${habit.name}`}
            className="p-1 rounded-sm text-muted hover:text-ink transition-colors duration-150 cursor-pointer"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M11.5 1.5L13.5 3.5L5 12H3V10L11.5 1.5Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => setConfirmingDelete(true)}
            aria-label={`Delete ${habit.name}`}
            className="p-1 rounded-sm text-muted hover:text-error transition-colors duration-150 cursor-pointer"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 4H12M5 4V3H10V4M6 7V11M9 7V11M4 4L5 13H10L11 4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {habit.description && (
        <p className="font-body text-sm font-light text-ink mt-3 leading-relaxed">
          {habit.description}
        </p>
      )}

      {/* Streak */}
      <div className="mt-4" data-testid={`habit-streak-${slug}`}>
        <span className="font-mono text-xl font-medium text-accent leading-none">
          {streak}
        </span>
        <span className="font-body text-xs text-muted ml-1.5 tracking-wide">
          {streak === 1 ? "day streak" : "day streak"}
        </span>
      </div>

      {/* Delete confirmation */}
      {confirmingDelete && (
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-end gap-3">
          <p className="font-body text-sm text-ink mr-auto">
            Delete this habit? This cannot be undone.
          </p>
          <button
            onClick={() => setConfirmingDelete(false)}
            className="
              bg-transparent text-ink border border-border rounded-md
              py-2 px-4 font-body text-sm font-medium
              hover:border-ink hover:bg-surface
              transition-colors duration-150 cursor-pointer
            "
          >
            Cancel
          </button>
          <button
            data-testid="confirm-delete-button"
            onClick={() => {
              setConfirmingDelete(false);
              onDelete(habit.id);
            }}
            className="
              bg-error text-white border-none rounded-md
              py-2 px-4 font-body text-sm font-medium
              hover:opacity-90 active:translate-y-px
              transition-all duration-150 cursor-pointer
            "
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
