"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { AmenityOption, ListingFilters } from "@/services/listings";

type SidebarFilters = {
  city: string;
  district: string;
  minPrice: string;
  maxPrice: string;
  type: string;
  sortBy: string;
  amenities: string[];
};

export function FilterSidebar({
  initialValues,
  amenities,
  onApply,
  onClose,
  sticky = true,
}: {
  initialValues?: ListingFilters;
  amenities: AmenityOption[];
  onApply: (values: ListingFilters) => void;
  onClose?: () => void;
  sticky?: boolean;
}) {
  const [values, setValues] = useState<SidebarFilters>({
    city: initialValues?.city ?? "",
    district: initialValues?.district ?? "",
    minPrice: initialValues?.minPrice ?? "",
    maxPrice: initialValues?.maxPrice ?? "",
    type: initialValues?.type ?? "",
    sortBy: initialValues?.sortBy ?? "",
    amenities: initialValues?.amenities ?? [],
  });

  useEffect(() => {
    setValues({
      city: initialValues?.city ?? "",
      district: initialValues?.district ?? "",
      minPrice: initialValues?.minPrice ?? "",
      maxPrice: initialValues?.maxPrice ?? "",
      type: initialValues?.type ?? "",
      sortBy: initialValues?.sortBy ?? "",
      amenities: initialValues?.amenities ?? [],
    });
  }, [
    initialValues?.amenities,
    initialValues?.city,
    initialValues?.district,
    initialValues?.maxPrice,
    initialValues?.minPrice,
    initialValues?.sortBy,
    initialValues?.type,
  ]);

  function updateField(field: Exclude<keyof SidebarFilters, "amenities">, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleAmenity(slug: string) {
    setValues((current) => ({
      ...current,
      amenities: current.amenities.includes(slug)
        ? current.amenities.filter((item) => item !== slug)
        : [...current.amenities, slug],
    }));
  }

  function handleApply() {
    onApply({
      city: values.city || undefined,
      district: values.district || undefined,
      minPrice: values.minPrice || undefined,
      maxPrice: values.maxPrice || undefined,
      type: values.type || undefined,
      sortBy: (values.sortBy as ListingFilters["sortBy"]) || undefined,
      amenities: values.amenities.length ? values.amenities : undefined,
    });
    onClose?.();
  }

  function handleClear() {
    setValues({
      city: "",
      district: "",
      minPrice: "",
      maxPrice: "",
      type: "",
      sortBy: "",
      amenities: [],
    });
    onApply({});
    onClose?.();
  }

  return (
    <aside className={`card-surface ${sticky ? "sticky top-24" : ""} space-y-6 p-6`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Filters</h2>
        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Clear
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">City</label>
          <select
            value={values.city}
            onChange={(event) => updateField("city", event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary"
          >
            <option value="">Any city</option>
            <option value="Vientiane">Vientiane</option>
            <option value="Luang Prabang">Luang Prabang</option>
            <option value="Pakse">Pakse</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">District or village</label>
          <Input
            value={values.district}
            onChange={(event) => updateField("district", event.target.value)}
            placeholder="Sisattanak / Watchan"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">Budget</label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={values.minPrice}
              onChange={(event) => updateField("minPrice", event.target.value)}
              placeholder="Min"
            />
            <Input
              value={values.maxPrice}
              onChange={(event) => updateField("maxPrice", event.target.value)}
              placeholder="Max"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">Property type</label>
          <div className="flex flex-wrap gap-2">
            {[
              ["ROOM", "Room"],
              ["HOUSE", "House"],
              ["APARTMENT", "Apartment"],
            ].map(([type, label]) => (
              <button
                key={type}
                type="button"
                onClick={() => updateField("type", values.type === type ? "" : type)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  values.type === type
                    ? "border-primary bg-blue-50 text-primary"
                    : "border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">Sort</label>
          <select
            value={values.sortBy}
            onChange={(event) => updateField("sortBy", event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary"
          >
            <option value="">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.slug)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  values.amenities.includes(amenity.slug)
                    ? "border-primary bg-blue-50 text-primary"
                    : "border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                }`}
              >
                {amenity.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Button type="button" className="w-full" onClick={handleApply}>
        Apply Filters
      </Button>
    </aside>
  );
}
