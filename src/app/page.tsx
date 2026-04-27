"use client";
import SplashScreen from "@/components/shared/SplashScreen";
import { getCurrentSession } from "@/lib/auth";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getCurrentSession();
      window.location.href = session ? "/dashboard" : "/login";
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return <SplashScreen />;
}
