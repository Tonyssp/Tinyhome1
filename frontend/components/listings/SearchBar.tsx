"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type SearchBarValues = {
  keyword?: string;
  type?: string;
  minPrice?: string;
};

export function SearchBar({
  initialValues,
  onSearch,
}: {
  initialValues?: SearchBarValues;
  onSearch?: (values: SearchBarValues) => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState({
    keyword: initialValues?.keyword ?? "",
    type: initialValues?.type ?? "",
    minPrice: initialValues?.minPrice ?? "",
  });

  useEffect(() => {
    setValues({
      keyword: initialValues?.keyword ?? "",
      type: initialValues?.type ?? "",
      minPrice: initialValues?.minPrice ?? "",
    });
  }, [initialValues?.keyword, initialValues?.minPrice, initialValues?.type]);

  function updateField(field: keyof typeof values, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSearch() {
    const nextValues = {
      keyword: values.keyword.trim(),
      type: values.type,
      minPrice: values.minPrice.trim(),
    };

    if (onSearch) {
      onSearch(nextValues);
      return;
    }

    const params = new URLSearchParams();

    if (nextValues.keyword) params.set("keyword", nextValues.keyword);
    if (nextValues.type) params.set("type", nextValues.type);
    if (nextValues.minPrice) params.set("minPrice", nextValues.minPrice);

    router.push(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="card-surface p-4 sm:p-6">
      <div className="grid gap-4 md:grid-cols-5">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-600">Keyword or location</label>
          <Input
            value={values.keyword}
            onChange={(event) => updateField("keyword", event.target.value)}
            placeholder="Vientiane / Luang Prabang / riverside"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">Type</label>
          <select
            value={values.type}
            onChange={(event) => updateField("type", event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary"
          >
            <option value="">Any</option>
            <option value="ROOM">Room</option>
            <option value="HOUSE">House</option>
            <option value="APARTMENT">Apartment</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">Min price</label>
          <Input
            value={values.minPrice}
            onChange={(event) => updateField("minPrice", event.target.value)}
            placeholder="5,000,000+"
          />
        </div>
        <div className="flex items-end">
          <Button type="button" className="w-full" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
