import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <p className="text-xl font-black text-primary">Tiny House Laos</p>
          <p className="text-sm leading-7 text-slate-500">
            Platform for finding rooms, homes, and apartments across Laos with a cleaner,
            more local-first experience.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-ink">Browse</p>
          <div className="space-y-2 text-sm text-slate-500">
            <Link href="/">Home</Link>
            <Link href="/listings" className="block">
              Listings
            </Link>
            <Link href="/post-property" className="block">
              Post Property
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-ink">Account</p>
          <div className="space-y-2 text-sm text-slate-500">
            <Link href="/login">Login</Link>
            <Link href="/dashboard" className="block">
              Dashboard
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-ink">Contact</p>
          <div className="space-y-2 text-sm text-slate-500">
            <p>support@tinyhouse.la</p>
            <p>+856 20 5555 0000</p>
            <p>Vientiane Capital, Laos</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
