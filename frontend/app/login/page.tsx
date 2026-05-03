import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  return (
    <div className="page-shell py-10">
      <div className="w-full rounded-[36px] bg-gradient-to-br from-white via-white to-blue-50/80 px-4 py-12 sm:px-6">
        <Suspense
          fallback={
            <Card className="mx-auto max-w-md p-8 text-center">
              <p className="text-sm font-medium text-slate-500">Loading sign in...</p>
            </Card>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
