import { Listing } from "@/data/listings";
import { ListingCard } from "./ListingCard";

export function ListingGrid({ listings }: { listings: Listing[] }) {
  return (
    <div className="min-w-0 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
