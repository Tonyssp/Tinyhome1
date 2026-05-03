const iconMap: Record<string, string> = {
  "Wi-Fi": "wifi",
  Parking: "local_parking",
  "Air conditioning": "mode_fan",
  Furnished: "chair",
  Laundry: "local_laundry_service",
  Garden: "yard",
  "Pet friendly": "pets",
  "Market nearby": "shopping_basket",
  "School nearby": "school",
  "Cafe nearby": "local_cafe",
  "Wood accents": "cottage",
  "Bike parking": "pedal_bike",
};

export function AmenityIcon({ amenity }: { amenity: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="material-symbols-outlined text-primary">{iconMap[amenity] ?? "check_circle"}</span>
      <span className="text-sm font-medium text-slate-700">{amenity}</span>
    </div>
  );
}
