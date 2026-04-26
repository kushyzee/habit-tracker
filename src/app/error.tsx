"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-svh bg-canvas px-4">
      <title>Something went wrong — Habit Tracker</title>
      <div className="w-full max-w-[480px] text-center">
        <h1 className="font-display text-3xl font-normal italic text-ink-strong leading-tight mb-4">
          Something went wrong
        </h1>

        <p className="font-body text-sm font-light text-ink leading-relaxed mb-8">
          An unexpected error occurred. Try again — if the problem persists,
          reload the page.
        </p>

        <button
          onClick={unstable_retry}
          className="inline-flex items-center justify-center font-body text-sm font-medium text-white bg-accent rounded-md px-8 py-3 min-h-[44px] transition-colors duration-150 ease-[ease] hover:bg-accent-hover active:translate-y-px"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
