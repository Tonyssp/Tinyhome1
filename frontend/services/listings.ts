import { Listing, listings as fallbackListings, getListingById as getFallbackListing } from "@/data/listings";
import { apiRequest } from "./api";

export type AmenityOption = {
  id: string;
  name: string;
  slug: string;
};

export type ListingFilters = {
  keyword?: string;
  city?: string;
  district?: string;
  minPrice?: string;
  maxPrice?: string;
  type?: string;
  amenities?: string[];
  sortBy?: "price_asc" | "newest" | "rating";
  myListings?: boolean;
};

type BackendListing = {
  id: string;
  title: string;
  description: string;
  price: string | number;
  deposit: string | number;
  city: string;
  district: string;
  village: string;
  address: string;
  type: string;
  availabilityStatus: "AVAILABLE" | "FULL";
  rating: string | number;
  createdAt?: string;
  images: Array<{ imageUrl: string }>;
  amenities: Array<{ amenity: { name: string } }>;
  landlord: {
    fullName: string;
    phone?: string | null;
    email?: string | null;
  };
};

type ListingsEnvelope = {
  items: BackendListing[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ListingEnvelope = {
  data: BackendListing;
};

type AmenitiesEnvelope = {
  data: AmenityOption[];
};

function formatDeposit(value: string | number) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return `${new Intl.NumberFormat("en-US").format(numericValue)} LAK`;
}

function formatType(type: string) {
  if (type === "ROOM") {
    return "Room";
  }

  if (type === "HOUSE") {
    return "House";
  }

  if (type === "APARTMENT") {
    return "Apartment";
  }

  return type;
}

export function normalizeListing(listing: BackendListing): Listing {
  return {
    id: listing.id,
    title: listing.title,
    city: listing.city,
    district: listing.district,
    village: listing.village,
    address: listing.address,
    price: Number(listing.price),
    deposit: formatDeposit(listing.deposit),
    type: formatType(listing.type),
    rating: Number(listing.rating),
    distance: `${listing.district}, ${listing.city}`,
    status: listing.availabilityStatus === "FULL" ? "Full" : "Available now",
    images: listing.images.map((image) => image.imageUrl),
    amenities: listing.amenities.map((item) => item.amenity.name),
    landlord: listing.landlord.fullName,
    contact: listing.landlord.phone ?? listing.landlord.email ?? "No contact provided",
    description: listing.description,
  };
}

function buildListingQuery(filters: ListingFilters) {
  const params = new URLSearchParams();

  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.city) params.set("city", filters.city);
  if (filters.district) params.set("district", filters.district);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.type) params.set("type", filters.type);
  if (filters.amenities?.length) params.set("amenities", filters.amenities.join(","));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.myListings) params.set("myListings", "true");

  return params.toString();
}

export async function fetchListings(filters: ListingFilters = {}, accessToken?: string | null) {
  const query = buildListingQuery(filters);
  const response = await apiRequest<ListingsEnvelope>(`/listings${query ? `?${query}` : ""}`, {
    method: "GET",
    token: accessToken,
  });

  return {
    items: response.items.map(normalizeListing),
    meta: response.meta,
  };
}

export async function fetchListingById(id: string, accessToken?: string | null) {
  const response = await apiRequest<ListingEnvelope>(`/listings/${id}`, {
    method: "GET",
    token: accessToken,
  });

  return normalizeListing(response.data);
}

export async function fetchAmenities() {
  const response = await apiRequest<AmenitiesEnvelope>("/listings/amenities", {
    method: "GET",
  });

  return response.data;
}

export async function createListing(
  payload: {
    title: string;
    description: string;
    price: number;
    deposit: number;
    city: string;
    district: string;
    village: string;
    address: string;
    type: "ROOM" | "HOUSE" | "APARTMENT";
    availabilityStatus: "AVAILABLE" | "FULL";
    amenityIds: string[];
    images: Array<{ imageUrl: string; publicId: string; sortOrder?: number }>;
  },
  accessToken: string,
) {
  const response = await apiRequest<ListingEnvelope>("/listings", {
    method: "POST",
    token: accessToken,
    body: payload,
  });

  return normalizeListing(response.data);
}

export async function uploadListingImages(files: File[], accessToken: string) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await apiRequest<{
    data: Array<{ imageUrl: string; publicId: string }>;
  }>("/upload", {
    method: "POST",
    token: accessToken,
    body: formData,
  });

  return response.data;
}

export function getFallbackListings() {
  return fallbackListings;
}

export function getFallbackListingById(id: string) {
  return getFallbackListing(id);
}
