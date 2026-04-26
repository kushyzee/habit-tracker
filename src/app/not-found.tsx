import Link from "next/link";

export const metadata = {
  title: "Page Not Found — Habit Tracker",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-svh bg-canvas px-4">
      <div className="w-full max-w-[480px] text-center">
        <h1 className="font-display text-3xl font-normal italic text-ink-strong leading-tight mb-4">
          Page not found
        </h1>

        <p className="font-body text-sm font-light text-ink leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Head back and pick up where you left off.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center font-body text-sm font-medium text-white bg-accent rounded-md px-8 py-3 min-h-[44px] transition-colors duration-150 ease-[ease] hover:bg-accent-hover active:translate-y-px"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
