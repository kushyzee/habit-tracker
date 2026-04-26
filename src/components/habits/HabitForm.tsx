"use client";

import { useState } from "react";
import { validateHabitName } from "@/lib/validators";
import type { Habit } from "@/types/habit";

interface HabitFormProps {
  editingHabit?: Habit | null;
  onSave: (data: { name: string; description: string }) => void;
  onCancel: () => void;
}

export default function HabitForm({
  editingHabit,
  onSave,
  onCancel,
}: HabitFormProps) {
  const [name, setName] = useState(editingHabit?.name ?? "");
  const [description, setDescription] = useState(
    editingHabit?.description ?? "",
  );
  const [nameError, setNameError] = useState<string | null>(null);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setNameError(null);

    const validation = validateHabitName(name);
    if (!validation.valid) {
      setNameError(validation.error);
      return;
    }

    onSave({ name: validation.value, description: description.trim() });
  }

  return (
    <div
      data-testid="habit-form"
      className="
        w-full max-w-[480px] bg-canvas
        border-t-[3px] border-t-ink-strong
        rounded-b-lg shadow-lg p-6
      "
    >
      <h2 className="font-display text-xl font-semibold text-ink-strong mb-6">
        {editingHabit ? "Edit habit" : "New habit"}
      </h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="habit-name"
            className="font-body text-sm font-medium text-ink"
          >
            Name{" "}
            <span className="text-error" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="habit-name"
            data-testid="habit-name-input"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="e.g. Drink Water"
            aria-invalid={nameError ? "true" : undefined}
            aria-describedby={nameError ? "habit-name-error" : undefined}
            className="
              w-full bg-surface border border-border rounded-sm
              px-4 py-3 font-body text-base text-ink
              placeholder:text-muted
              focus:outline-none focus:border-ink
              aria-invalid:border-error
              transition-colors duration-150
            "
          />
          {nameError && (
            <p
              id="habit-name-error"
              role="alert"
              className="font-body text-sm text-error"
            >
              {nameError}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="habit-description"
            className="font-body text-sm font-medium text-ink"
          >
            Description{" "}
            <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="habit-description"
            data-testid="habit-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this habit mean to you?"
            rows={3}
            className="
              w-full bg-surface border border-border rounded-sm
              px-4 py-3 font-body text-base text-ink
              placeholder:text-muted resize-none
              focus:outline-none focus:border-ink
              transition-colors duration-150
            "
          />
        </div>

        {/* Frequency — locked to daily */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="habit-frequency"
            className="font-body text-sm font-medium text-ink"
          >
            Frequency
          </label>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            disabled
            value="daily"
            className="
              w-full bg-surface border border-border rounded-sm
              px-4 py-3 font-body text-base text-muted
              cursor-not-allowed opacity-70
              focus:outline-none
            "
          >
            <option value="daily">Daily</option>
          </select>
          <p className="font-body text-xs text-muted">
            Only daily habits are supported in this stage.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="
              bg-transparent text-ink border border-border rounded-md
              py-3 px-6 font-body text-sm font-medium
              hover:border-ink hover:bg-surface
              transition-colors duration-150 cursor-pointer
            "
          >
            Cancel
          </button>
          <button
            data-testid="habit-save-button"
            type="submit"
            className="
              bg-accent text-white border-none rounded-md
              py-3 px-6 font-body text-sm font-medium
              hover:bg-accent-hover active:translate-y-px
              transition-colors duration-150 cursor-pointer
            "
          >
            {editingHabit ? "Save changes" : "Add habit"}
          </button>
        </div>
      </form>
    </div>
  );
}
