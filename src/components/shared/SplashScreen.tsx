export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex flex-col items-center justify-center min-h-svh bg-canvas"
    >
      <div className="w-12 h-px bg-border mb-4" />
      <h1 className="font-display text-4xl font-semibold text-ink-strong leading-tight">
        Habit Tracker
      </h1>
      <div className="w-12 h-px bg-border mt-4" />
    </div>
  );
}
