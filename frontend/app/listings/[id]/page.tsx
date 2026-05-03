"use client";

import { useEffect, useState } from "react";
import { AmenityIcon } from "@/components/listings/AmenityIcon";
import { ContactLandlordButton, DetailActions } from "@/components/listings/DetailActions";
import { ImageGallery } from "@/components/listings/ImageGallery";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Listing, formatPrice } from "@/data/listings";
import { fetchListingById, getFallbackListingById } from "@/services/listings";

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadListing() {
      setLoading(true);
      setErrorMessage("");

      try {
        const result = await fetchListingById(params.id);

        if (!mounted) {
          return;
        }

        setListing(result);
        setUsingFallback(false);
      } catch (error) {
        const fallbackListing = getFallbackListingById(params.id);

        if (!mounted) {
          return;
        }

        setListing(fallbackListing ?? null);
        setUsingFallback(Boolean(fallbackListing));
        setErrorMessage(error instanceof Error ? error.message : "Could not load listing.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadListing();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="page-shell py-10">
        <Card className="p-8 text-center">
          <p className="text-sm font-medium text-slate-500">Loading listing...</p>
        </Card>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="page-shell py-10">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-ink">Listing not found</h1>
          <p className="mt-3 text-sm text-slate-500">
            We could not find the listing you requested.
          </p>
        </Card>
      </div>
    );
  }

  const statusTone = listing.status.toLowerCase().includes("available") ? "success" : "warm";

  return (
    <div className="page-shell py-10">
      {usingFallback ? (
        <Card className="mb-6 p-4">
          <p className="text-sm text-slate-600">
            Backend listing details are unavailable right now. Showing fallback content.
            {errorMessage ? ` ${errorMessage}` : ""}
          </p>
        </Card>
      ) : null}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <Badge tone={statusTone}>{listing.status}</Badge>
          <h1 className="section-title">{listing.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-primary">star</span>
              {listing.rating}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-primary">location_on</span>
              {listing.address}
            </span>
          </div>
        </div>
        <DetailActions />
      </div>

      <ImageGallery images={listing.images} title={listing.title} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="min-w-0 space-y-8">
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-ink">Property overview</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Type</p>
                <p className="mt-1 text-lg font-bold text-ink">{listing.type}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Monthly price</p>
                <p className="mt-1 text-lg font-bold text-primary">{formatPrice(listing.price)} LAK</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Deposit</p>
                <p className="mt-1 text-lg font-bold text-ink">{listing.deposit}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="mt-1 text-lg font-bold text-ink">{listing.distance}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-ink">Description</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">{listing.description}</p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-ink">Amenities</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {listing.amenities.map((amenity) => (
                <AmenityIcon key={amenity} amenity={amenity} />
              ))}
            </div>
          </Card>
        </div>

        <div className="min-w-0 space-y-6">
          <Card className="p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Landlord</p>
            <h2 className="mt-3 break-words text-2xl font-bold text-ink">{listing.landlord}</h2>
            <p className="mt-2 break-words text-sm text-slate-500">{listing.contact}</p>
            <ContactLandlordButton contact={listing.contact} />
          </Card>

          <Card className="bg-hero-grid p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Address</p>
            <h3 className="mt-3 text-xl font-bold text-ink">
              {listing.village}, {listing.district}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{listing.city}, Laos</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
