"use client";

import { Button } from "@/components/ui/Button";

export function DetailActions() {
  return (
    <div className="flex w-full flex-wrap gap-3 sm:w-auto">
      <Button variant="ghost" type="button" onClick={() => console.log("Share clicked")}>
        Share
      </Button>
      <Button variant="secondary" type="button" onClick={() => alert("Saved to favorites mock.")}>
        Save
      </Button>
    </div>
  );
}

export function ContactLandlordButton({ contact }: { contact: string }) {
  return (
    <Button
      type="button"
      className="mt-6 w-full"
      onClick={() => alert(`Contact mock: ${contact}`)}
    >
      Contact landlord
    </Button>
  );
}
