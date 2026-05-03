"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterSidebar } from "@/components/listings/FilterSidebar";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { SearchBar } from "@/components/listings/SearchBar";
import { Card } from "@/components/ui/Card";
import { Listing } from "@/data/listings";
import { fetchAmenities, fetchListings, getFallbackListings, type ListingFilters } from "@/services/listings";

function buildUrl(filters: ListingFilters) {
  const params = new URLSearchParams();

  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.city) params.set("city", filters.city);
  if (filters.district) params.set("district", filters.district);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.type) params.set("type", filters.type);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.amenities?.length) params.set("amenities", filters.amenities.join(","));

  return `/listings${params.toString() ? `?${params.toString()}` : ""}`;
}

export function ListingsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filters = useMemo<ListingFilters>(
    () => ({
      keyword: searchParams.get("keyword") || undefined,
      city: searchParams.get("city") || undefined,
      district: searchParams.get("district") || undefined,
      minPrice: searchParams.get("minPrice") || undefined,
      maxPrice: searchParams.get("maxPrice") || undefined,
      type: searchParams.get("type") || undefined,
      sortBy: (searchParams.get("sortBy") as ListingFilters["sortBy"]) || undefined,
      amenities: searchParams.get("amenities")?.split(",").filter(Boolean),
    }),
    [searchParams],
  );
  const [items, setItems] = useState<Listing[]>(getFallbackListings());
  const [amenities, setAmenities] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFallback, setIsFallback] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAmenities() {
      try {
        const data = await fetchAmenities();

        if (mounted) {
          setAmenities(data);
        }
      } catch {
        if (mounted) {
          setAmenities([]);
        }
      }
    }

    void loadAmenities();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadListings() {
      setLoading(true);
      setErrorMessage("");

      try {
        const result = await fetchListings(filters);

        if (!mounted) {
          return;
        }

        setItems(result.items);
        setIsFallback(false);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setItems(getFallbackListings());
        setIsFallback(true);
        setErrorMessage(error instanceof Error ? error.message : "Could not load listings.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadListings();

    return () => {
      mounted = false;
    };
  }, [filters]);

  function applyFilters(nextFilters: ListingFilters) {
    router.push(buildUrl({
      ...filters,
      ...nextFilters,
    }));
  }

  return (
    <div className="page-shell py-10">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Listings</p>
        <h1 className="section-title">ຊອກຫາທີ່ພັກໃນລາວ</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          Search results use the real backend first and automatically fall back to local sample data
          if the API is unavailable.
        </p>
      </div>
      <div className="mb-8">
        <SearchBar
          initialValues={{
            keyword: filters.keyword,
            type: filters.type,
            minPrice: filters.minPrice,
          }}
          onSearch={(nextValues) => {
            applyFilters({
              keyword: nextValues.keyword,
              type: nextValues.type,
              minPrice: nextValues.minPrice,
            });
          }}
        />
      </div>
      <div className="mb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="inline-flex w-full items-center justify-center rounded-full bg-button-primary px-5 py-3 text-sm font-semibold text-white shadow-glow"
        >
          Open Filters
        </button>
      </div>
      {isFallback ? (
        <Card className="mb-6 p-4">
          <p className="text-sm text-slate-600">
            Backend listings are unavailable right now. Showing fallback listings.
            {errorMessage ? ` ${errorMessage}` : ""}
          </p>
        </Card>
      ) : null}
      <div className="grid min-w-0 gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <FilterSidebar amenities={amenities} initialValues={filters} onApply={applyFilters} />
        </div>
        <div className="min-w-0">
          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-sm font-medium text-slate-500">Loading listings...</p>
            </Card>
          ) : items.length ? (
            <ListingGrid listings={items} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-sm font-medium text-slate-500">No listings matched your filters.</p>
            </Card>
          )}
        </div>
      </div>
      {isMobileFiltersOpen ? (
        <div className="fixed inset-0 z-[60] bg-slate-950/30 px-4 py-6 lg:hidden">
          <div className="mx-auto max-h-full w-full max-w-sm overflow-y-auto">
            <FilterSidebar
              amenities={amenities}
              initialValues={filters}
              onApply={applyFilters}
              onClose={() => setIsMobileFiltersOpen(false)}
              sticky={false}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
