import Image from "next/image";
import logo from "@/app/icon.svg";

interface AuthPageWrapperProps {
  title: string;
  children: React.ReactNode;
}

export default function AuthPageWrapper({
  title,
  children,
}: AuthPageWrapperProps) {
  return (
    <main className="min-h-svh bg-canvas flex flex-col items-center justify-center px-5">
      <Image
        loading="eager"
        src={logo}
        alt="Logo"
        className="w-20 h-auto mb-4"
      />
      <div className="w-full max-w-[440px]">
        <h1 className="font-display text-3xl text-ink-strong font-semibold leading-tight text-center mb-8">
          {title}
        </h1>
        {children}
      </div>
    </main>
  );
}
