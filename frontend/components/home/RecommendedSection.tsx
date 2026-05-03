"use client";

import { useEffect, useState } from "react";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { Listing, listings as fallbackListings } from "@/data/listings";
import { fetchListings } from "@/services/listings";

export function RecommendedSection() {
  const [items, setItems] = useState<Listing[]>(fallbackListings.slice(0, 3));

  useEffect(() => {
    let mounted = true;

    async function loadRecommended() {
      try {
        const result = await fetchListings({});

        if (mounted && result.items.length) {
          setItems(result.items.slice(0, 3));
        }
      } catch {
        if (mounted) {
          setItems(fallbackListings.slice(0, 3));
        }
      }
    }

    void loadRecommended();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="page-shell py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Recommended</p>
          <h2 className="section-title mt-2">ບ້ານແນະນຳສຳລັບທ່ານ</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-500">
          Curated from the current HTML design set and repackaged into reusable cards for a cleaner
          mobile-first browsing flow.
        </p>
      </div>
      <ListingGrid listings={items} />
    </section>
  );
}
