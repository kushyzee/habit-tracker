"use client";

import { getCurrentSession } from "@/lib/auth";
import { Session } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: (session: Session) => React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const session = getCurrentSession();

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session, router]);

  if (!session) return null;

  return <>{children(session)}</>;
}
