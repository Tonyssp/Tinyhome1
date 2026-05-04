import { toSlug } from "../../utils/slug";

export const defaultAmenityNames = [
  "Wi-Fi",
  "Parking",
  "Air Conditioning",
  "Furnished",
  "Laundry",
  "Pet Friendly",
  "Security",
  "Balcony",
  "Kitchen",
  "Water Heater",
  "Garden",
  "Pool",
];

export const defaultAmenities = defaultAmenityNames.map((name) => ({
  name,
  slug: toSlug(name),
}));
