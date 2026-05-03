"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { useAuth } from "./AuthProvider";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const redirectTarget = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?redirect=${redirectTarget}`);
    }
  }, [loading, pathname, router, user]);

  if (loading) {
    return (
      <div className="page-shell py-10">
        <Card className="p-8 text-center">
          <p className="text-sm font-medium text-slate-500">Checking your session...</p>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
