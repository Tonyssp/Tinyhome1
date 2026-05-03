"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/listings", label: "Listings" },
    { href: "/post-property", label: "Post" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : [{ href: "/login", label: "Login" }]),
  ];

  async function handleLogout() {
    await logout();
    setIsMobileOpen(false);
    router.replace("/");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/90 backdrop-blur">
      <div className="page-shell flex items-center justify-between gap-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="shrink-0 text-2xl font-black tracking-tight text-primary">
            Tiny House
          </Link>
          <span className="hidden rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary lg:inline-flex">
            Laos Rental Platform
          </span>
        </div>
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-100 text-primary shadow-[inset_0_0_0_1px_rgba(37,99,235,0.12)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <span className="max-w-[180px] truncate text-sm font-semibold text-slate-600">
              {user.fullName}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => console.log("Language switch is not connected yet.")}
            className="inline-flex max-w-full items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
          >
            <span className="material-symbols-outlined text-base">language</span>
            LAO / 中文 / EN
          </button>
          <Button href="/post-property">List Property</Button>
          {user ? (
            <Button variant="ghost" type="button" onClick={handleLogout} disabled={loading}>
              Logout
            </Button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setIsMobileOpen((current) => !current)}
          className="rounded-full bg-slate-100 p-2 text-slate-700 md:hidden"
          aria-expanded={isMobileOpen}
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined">{isMobileOpen ? "close" : "menu"}</span>
        </button>
        {isMobileOpen ? (
          <div className="absolute inset-x-4 top-16 md:hidden">
            <div className="rounded-3xl border border-white/70 bg-white p-3 shadow-card">
              <div className="flex flex-col gap-2">
                {user ? (
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    {user.fullName}
                  </div>
                ) : null}
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/post-property"
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-2xl bg-button-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-glow"
                >
                  List Property
                </Link>
                <button
                  type="button"
                  onClick={() => console.log("Language switch is not connected yet.")}
                  className="rounded-2xl bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-600"
                >
                  LAO / 中文 / EN
                </button>
                {user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-primary hover:bg-blue-50"
                  >
                    Logout
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
