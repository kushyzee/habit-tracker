"use client";
import SplashScreen from "@/components/shared/SplashScreen";
import { getCurrentSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getCurrentSession();
      router.replace(session ? "/dashboard" : "/login");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
