const categories = [
  ["bed", "Room"],
  ["holiday_village", "Villa"],
  ["apartment", "Apartment"],
  ["cottage", "Tiny House"],
  ["other_houses", "Family Home"],
  ["meeting_room", "Studio"],
];

export function CategorySection() {
  return (
    <section className="page-shell py-14">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Categories</p>
          <h2 className="section-title mt-2">ປະເພດທີ່ພັກຍອດນິຍົມ</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(([icon, label]) => (
          <div
            key={label}
            className="card-surface flex flex-col items-center gap-4 p-5 text-center transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-glow"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-soft text-primary">
              <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <p className="text-sm font-semibold text-ink">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
