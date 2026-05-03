import { ReactNode } from "react";

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warm";
}) {
  const classes =
    tone === "success"
      ? "bg-cyan-100 text-cyan-700"
      : tone === "warm"
        ? "bg-blue-100 text-primary-dark"
        : "bg-slate-100 text-slate-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
      {children}
    </span>
  );
}
