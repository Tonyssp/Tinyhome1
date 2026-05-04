"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { fetchAmenities, createListing, uploadListingImages } from "@/services/listings";
import { updateCurrentUser } from "@/services/user";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_COUNT = 10;

export default function PostPropertyPage() {
  return (
    <RequireAuth>
      <PostPropertyContent />
    </RequireAuth>
  );
}

function PostPropertyContent() {
  const router = useRouter();
  const { accessToken, user } = useAuth();
  const previewUrlsRef = useRef<string[]>([]);
  const [amenities, setAmenities] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [selectedImages, setSelectedImages] = useState<Array<{ file: File; preview: string }>>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    deposit: "",
    city: "",
    district: "",
    village: "",
    address: "",
    type: "HOUSE" as "ROOM" | "HOUSE" | "APARTMENT",
    status: "AVAILABLE" as "AVAILABLE" | "FULL",
    amenityIds: [] as string[],
    contactPhone: user?.phone ?? "",
  });

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
    setForm((current) => ({
      ...current,
      contactPhone: user?.phone ?? current.contactPhone,
    }));
  }, [user?.phone]);

  useEffect(() => {
    const currentUrls = selectedImages.map((image) => image.preview);
    const previousUrls = previewUrlsRef.current;

    previousUrls
      .filter((url) => !currentUrls.includes(url))
      .forEach((url) => URL.revokeObjectURL(url));

    previewUrlsRef.current = currentUrls;
  }, [selectedImages]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function updateField(field: keyof typeof form, value: string | string[]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setErrorMessage("");
    setSuccessMessage("");
  }

  function toggleAmenity(id: string) {
    setForm((current) => ({
      ...current,
      amenityIds: current.amenityIds.includes(id)
        ? current.amenityIds.filter((item) => item !== id)
        : [...current.amenityIds, id],
    }));
  }

  function handleImageSelection(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    const incomingFiles = Array.from(files);
    const invalidType = incomingFiles.find((file) => !file.type.startsWith("image/"));

    if (invalidType) {
      setErrorMessage("Please upload image files only.");
      return;
    }

    const oversizedFile = incomingFiles.find((file) => file.size > MAX_IMAGE_SIZE_BYTES);

    if (oversizedFile) {
      setErrorMessage(`${oversizedFile.name} is too large. Each image must be 10MB or smaller.`);
      return;
    }

    const nextFiles = incomingFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages((current) => {
      const combined = [...current, ...nextFiles];

      if (combined.length <= MAX_IMAGE_COUNT) {
        setErrorMessage("");
        return combined;
      }

      combined.slice(MAX_IMAGE_COUNT).forEach((image) => URL.revokeObjectURL(image.preview));
      setErrorMessage(`You can upload up to ${MAX_IMAGE_COUNT} images.`);
      return combined.slice(0, MAX_IMAGE_COUNT);
    });
  }

  function removeImage(index: number) {
    setSelectedImages((current) => {
      const target = current[index];

      if (target) {
        URL.revokeObjectURL(target.preview);
      }

      return current.filter((_, currentIndex) => currentIndex !== index);
    });
  }

  async function handleSubmit() {
    if (!accessToken) {
      setErrorMessage("Your session has expired. Please sign in again.");
      return;
    }

    if (form.title.trim().length < 5) {
      setErrorMessage("Please enter a title with at least 5 characters.");
      return;
    }

    if (form.description.trim().length < 5) {
      setErrorMessage("Please enter a description with at least 5 characters.");
      return;
    }

    if (
      form.city.trim().length < 2 ||
      form.district.trim().length < 2 ||
      form.village.trim().length < 2
    ) {
      setErrorMessage("Please complete city, district, and village.");
      return;
    }

    if (form.address.trim().length < 5) {
      setErrorMessage("Please enter an address with at least 5 characters.");
      return;
    }

    const price = Number(form.price);
    const deposit = Number(form.deposit);

    if (!Number.isFinite(price) || price <= 0) {
      setErrorMessage("Please enter a valid monthly price.");
      return;
    }

    if (!Number.isFinite(deposit) || deposit < 0) {
      setErrorMessage("Please enter a valid deposit amount.");
      return;
    }

    if (!selectedImages.length) {
      setErrorMessage("Please select at least one image.");
      return;
    }

    if (!form.amenityIds.length) {
      setErrorMessage("Please select at least one amenity.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (form.contactPhone.trim() && form.contactPhone.trim() !== (user?.phone ?? "")) {
        await updateCurrentUser({ phone: form.contactPhone.trim() }, accessToken);
      }

      const uploadedImages = await uploadListingImages(
        selectedImages.map((image) => image.file),
        accessToken,
      );

      const listing = await createListing(
        {
          title: form.title.trim(),
          description: form.description.trim(),
          price,
          deposit,
          city: form.city.trim(),
          district: form.district.trim(),
          village: form.village.trim(),
          address: form.address.trim(),
          type: form.type,
          availabilityStatus: form.status,
          amenityIds: form.amenityIds,
          images: uploadedImages.map((image, index) => ({
            imageUrl: image.imageUrl,
            publicId: image.publicId,
            sortOrder: index,
          })),
        },
        accessToken,
      );

      setSuccessMessage("Listing created successfully.");
      router.push(`/listings/${listing.id}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not create listing.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-shell py-10">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Post Property</p>
        <h1 className="section-title">ລົງປະກາດຊັບສິນຂອງທ່ານ</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          This form now uploads real images first and then creates the listing with the backend API.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-ink">Basic Info</h2>
            <div className="mt-6 space-y-5">
              <Input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Listing title"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={form.type}
                  onChange={(event) => updateField("type", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary"
                >
                  <option value="ROOM">Room</option>
                  <option value="HOUSE">House</option>
                  <option value="APARTMENT">Apartment</option>
                </select>
                <select
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="FULL">Full</option>
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="City"
                />
                <Input
                  value={form.district}
                  onChange={(event) => updateField("district", event.target.value)}
                  placeholder="District"
                />
                <Input
                  value={form.village}
                  onChange={(event) => updateField("village", event.target.value)}
                  placeholder="Village"
                />
              </div>
              <Input
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder="Exact address"
              />
              <textarea
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Describe the property"
                className="min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-ink">Pricing</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Input
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                placeholder="Monthly price (LAK)"
              />
              <Input
                value={form.deposit}
                onChange={(event) => updateField("deposit", event.target.value)}
                placeholder="Deposit (LAK)"
              />
            </div>
            <div className="mt-4">
              <Input
                value={form.contactPhone}
                onChange={(event) => updateField("contactPhone", event.target.value)}
                placeholder="Contact phone"
              />
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-ink">Amenities</h2>
            {amenities.length ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {amenities.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 rounded-2xl border p-4 ${
                      form.amenityIds.includes(item.id)
                        ? "border-primary bg-blue-50"
                        : "border-slate-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.amenityIds.includes(item.id)}
                      onChange={() => toggleAmenity(item.id)}
                      className="h-4 w-4 accent-[#2563EB]"
                    />
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-medium text-primary-dark">
                Amenities are not available yet. Check the backend API connection.
              </p>
            )}
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-ink">Photos</h2>
            <div className="mt-6 space-y-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-primary/30 bg-blue-50/60 px-6 py-10 text-center">
                <span className="text-sm font-semibold text-primary">Upload multiple photos</span>
                <span className="mt-2 text-xs text-slate-500">PNG / JPG / WEBP, up to 10 files</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => handleImageSelection(event.target.files)}
                />
              </label>
              {selectedImages.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {selectedImages.map((image, index) => (
                    <div key={`${image.file.name}-${index}`} className="overflow-hidden rounded-[24px] border border-slate-200">
                      <img src={image.preview} alt={image.file.name} className="h-40 w-full object-cover" />
                      <div className="flex items-center justify-between gap-3 p-4">
                        <p className="min-w-0 truncate text-sm font-medium text-slate-600">{image.file.name}</p>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="shrink-0 text-sm font-semibold text-primary"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </Card>

          {errorMessage ? (
            <Card className="p-4">
              <p className="text-sm font-medium text-primary-dark">{errorMessage}</p>
            </Card>
          ) : null}
          {successMessage ? (
            <Card className="p-4">
              <p className="text-sm font-medium text-primary">{successMessage}</p>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card className="bg-hero-grid p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-ink">Publishing Tips</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
              <li>Use clear room photos and mention the nearest landmark.</li>
              <li>Keep pricing transparent with deposit details.</li>
              <li>Show what makes the property useful for local renters.</li>
            </ul>
          </Card>
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-ink">Actions</h2>
            <div className="mt-6 flex flex-col gap-3">
              <Button type="button" variant="secondary" onClick={() => alert("Draft saving is not connected yet.")}>
                Save Draft
              </Button>
              <Button type="button" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Publishing..." : "Publish Listing"}
              </Button>
            </div>
            {errorMessage ? (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {errorMessage}
              </p>
            ) : null}
            {successMessage ? (
              <p className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-primary">
                {successMessage}
              </p>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
