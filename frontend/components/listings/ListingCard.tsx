import Link from "next/link";
import { Listing, formatPrice } from "@/data/listings";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function ListingCard({ listing }: { listing: Listing }) {
  const statusTone = listing.status.toLowerCase().includes("available") ? "success" : "warm";

  return (
    <Card className="overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative">
        <img src={listing.images[0]} alt={listing.title} className="h-56 w-full object-cover" />
        <div className="absolute left-4 top-4">
          <Badge tone={statusTone}>{listing.status}</Badge>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {listing.city} / {listing.district}
            </p>
            <h3 className="mt-2 text-lg font-bold text-ink">{listing.title}</h3>
          </div>
          <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-primary">
            {listing.rating}
          </div>
        </div>
        <p className="text-sm text-slate-500">{listing.distance}</p>
        <div className="flex flex-wrap gap-2">
          {listing.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity}>{amenity}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-primary">{formatPrice(listing.price)} LAK</p>
            <p className="text-xs text-slate-500">Deposit: {listing.deposit}</p>
          </div>
          <Link
            href={`/listings/${listing.id}`}
            className="rounded-full bg-button-primary px-4 py-2 text-sm font-semibold text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:bg-button-primary-hover"
          >
            View detail
          </Link>
        </div>
      </div>
    </Card>
  );
}
