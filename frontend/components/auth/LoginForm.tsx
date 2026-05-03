"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "USER" as "USER" | "LANDLORD",
  });
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTarget);
    }
  }, [loading, redirectTarget, router, user]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setErrorMessage("");
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};
    const identifier = form.email.trim();

    if (mode === "signup" && form.fullName.trim().length < 2) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!identifier) {
      nextErrors.email = mode === "signin" ? "Please enter your email or phone." : "Please enter your email.";
    }

    if (mode === "signup" && identifier && !identifier.includes("@")) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (mode === "signup" && form.phone.trim() && form.phone.trim().length < 8) {
      nextErrors.phone = "Phone number must be at least 8 characters.";
    }

    if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    setErrorMessage("");

    try {
      if (mode === "signin") {
        await login({
          identifier: form.email.trim(),
          password: form.password,
        });
      } else {
        await register({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          password: form.password,
          role: form.role,
        });
      }

      router.replace(redirectTarget);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Authentication failed.");
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card-surface overflow-hidden">
        <div className="border-b border-slate-100 px-8 pb-6 pt-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-button-primary text-white shadow-glow">
            <span className="material-symbols-outlined text-4xl">home_pin</span>
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-ink">ຍິນດີຕ້ອນຮັບ</h1>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Sign in with your existing account or create a new renter or landlord account.
          </p>
        </div>
        <div className="space-y-5 p-8">
          <div className="grid grid-cols-2 gap-2 rounded-full bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === "signin" ? "bg-white text-primary shadow-sm" : "text-slate-500"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === "signup" ? "bg-white text-primary shadow-sm" : "text-slate-500"
              }`}
            >
              Sign Up
            </button>
          </div>
          {mode === "signup" ? (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">Full name</label>
              <Input
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                placeholder="Somxay Phommavong"
              />
              {fieldErrors.fullName ? (
                <p className="mt-2 text-xs font-medium text-primary-dark">{fieldErrors.fullName}</p>
              ) : null}
            </div>
          ) : null}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              {mode === "signin" ? "Email or phone" : "Email"}
            </label>
            <Input
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder={mode === "signin" ? "example@email.com or +85620..." : "example@email.com"}
            />
            {fieldErrors.email ? (
              <p className="mt-2 text-xs font-medium text-primary-dark">{fieldErrors.email}</p>
            ) : null}
          </div>
          {mode === "signup" ? (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">Phone</label>
              <Input
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+85620..."
              />
              {fieldErrors.phone ? (
                <p className="mt-2 text-xs font-medium text-primary-dark">{fieldErrors.phone}</p>
              ) : null}
            </div>
          ) : null}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">Password</label>
            <Input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="••••••••"
            />
            {fieldErrors.password ? (
              <p className="mt-2 text-xs font-medium text-primary-dark">{fieldErrors.password}</p>
            ) : null}
          </div>
          {mode === "signup" ? (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">Account role</label>
              <select
                value={form.role}
                onChange={(event) => updateField("role", event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="USER">User</option>
                <option value="LANDLORD">Landlord</option>
              </select>
            </div>
          ) : null}
          {errorMessage ? (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-primary-dark">
              {errorMessage}
            </div>
          ) : null}
          <Button type="button" className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => alert("Google login is mocked for now.")}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => alert("Facebook login is mocked for now.")}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
