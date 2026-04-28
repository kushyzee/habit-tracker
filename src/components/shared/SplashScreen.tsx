import Image from "next/image";
import logo from "@/app/icon.svg";

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex flex-col items-center justify-center min-h-svh bg-canvas"
    >
      <Image
        loading="eager"
        src={logo}
        alt="Logo"
        className="w-20 h-auto mb-4"
      />
      <h1 className="font-display text-4xl font-semibold text-ink-strong leading-tight">
        Habit Tracker
      </h1>
    </div>
  );
}
