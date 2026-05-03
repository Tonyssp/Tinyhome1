"use client";

import { Button } from "@/components/ui/Button";

export function NearbyMapSection() {
  return (
    <section className="page-shell py-14">
      <div className="card-surface overflow-hidden bg-hero-grid p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Map Preview</p>
            <h2 className="section-title mt-2">ເບິ່ງພື້ນທີ່ໃກ້ເຄີຍງ່າຍຂຶ້ນ</h2>
            <p className="mt-4 max-w-xl text-sm leading-8 text-slate-600">
              Nearby transit, schools, cafes, and markets are surfaced visually to keep the browsing
              experience useful even before the backend is connected.
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-6"
              onClick={() => alert("Map interaction is mocked for now.")}
            >
              Open map mock
            </Button>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-card">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["location_on", "That Luang", "8 min"],
                ["school", "International school", "12 min"],
                ["shopping_basket", "Fresh market", "6 min"],
                ["local_cafe", "Coffee street", "5 min"],
              ].map(([icon, label, time]) => (
                <div key={label} className="rounded-3xl bg-slate-50 p-4">
                  <span className="material-symbols-outlined text-primary">{icon}</span>
                  <p className="mt-3 font-semibold text-ink">{label}</p>
                  <p className="text-sm text-slate-500">{time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
