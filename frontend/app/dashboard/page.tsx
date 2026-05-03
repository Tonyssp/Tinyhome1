"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Listing } from "@/data/listings";
import { fetchListings, getFallbackListings } from "@/services/listings";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}

function DashboardContent() {
  const { user, accessToken } = useAuth();
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadDashboardListings() {
      if (!accessToken) {
        return;
      }

      setLoadingListings(true);

      try {
        const result = await fetchListings({ myListings: true }, accessToken);

        if (!mounted) {
          return;
        }

        setSavedListings(result.items);
        setUsingFallback(false);
      } catch {
        if (!mounted) {
          return;
        }

        setSavedListings(getFallbackListings().slice(0, 3));
        setUsingFallback(true);
      } finally {
        if (mounted) {
          setLoadingListings(false);
        }
      }
    }

    void loadDashboardListings();

    return () => {
      mounted = false;
    };
  }, [accessToken]);

  return (
    <div className="page-shell py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</p>
          <h1 className="section-title">ສູນລວມຜູ້ໃຊ້</h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-500">
            Your dashboard now reads the real authenticated session and will use backend landlord
            listings whenever the API is available.
          </p>
        </div>
        <Button href="/post-property">Post new property</Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="p-6">
          <div className="text-center">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEa3oJeru6Rc_ncAF58QrpmW2tes3024qw6U2jNSGxDUIRyII_NOjrTOj7pg4j_r2TjmPx-bDaNDfTXzBN1BlO_Y8AH6hgHDCxMANQ2HTa8Fhey_G_HuidWoC_Ew5i_q7tsZ4bz5nDTlEaColEZu-NyH9FYfWr7iHtFTtNZxWTqugafm5fUc3d9L0zE3D7wGo8dZNaMqjsF49jCERVsCaDxbpA2hHnMrSDSP0bv-qU2X7Wkk5DZRak4wiFWGnO0zVFLi5o5tpQJUE"
              alt="Profile"
              className="mx-auto h-24 w-24 rounded-full object-cover"
            />
            <h2 className="mt-4 text-xl font-bold text-ink">{user?.fullName}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {user?.role === "LANDLORD" ? "Verified landlord account" : "Verified renter account"}
            </p>
          </div>
          <div className="mt-6 space-y-2">
            {["Profile", "Favorites", "Messages", "Security"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => console.log(`${item} clicked`)}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <span>{item}</span>
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            ))}
          </div>
        </Card>

        <div className="min-w-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Favorites", "12"],
              ["Messages", "3"],
              ["Active posts", String(savedListings.length)],
            ].map(([label, value]) => (
              <Card key={label} className="p-5">
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-black text-primary">{value}</p>
              </Card>
            ))}
          </div>

          <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-ink">Saved properties</h2>
              <Link href="/post-property" className="text-sm font-semibold text-primary hover:underline">
                Go to Post Property
              </Link>
            </div>
            {usingFallback ? (
              <p className="mt-4 text-sm text-slate-500">
                Backend landlord listings could not be loaded, so fallback items are shown.
              </p>
            ) : null}
            <div className="mt-6 grid gap-4">
              {loadingListings ? (
                <div className="rounded-[24px] border border-slate-100 p-4 text-sm text-slate-500">
                  Loading your listings...
                </div>
              ) : savedListings.length ? (
                savedListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="grid gap-4 rounded-[24px] border border-slate-100 p-4 sm:grid-cols-[140px_minmax(0,1fr)_auto]"
                  >
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="h-28 w-full rounded-[20px] object-cover"
                    />
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-ink">{listing.title}</h3>
                      <p className="mt-2 text-sm text-slate-500">{listing.address}</p>
                      <p className="mt-2 text-sm font-semibold text-primary">{listing.price.toLocaleString()} LAK</p>
                    </div>
                    <div className="flex items-center">
                      <Link
                        href={`/listings/${listing.id}`}
                        className="rounded-full bg-button-primary px-4 py-2 text-sm font-semibold text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:bg-button-primary-hover"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-slate-100 p-4 text-sm text-slate-500">
                  No listings yet. Create your first property post.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
