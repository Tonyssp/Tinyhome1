import { Suspense } from "react";
import { ListingsPageContent } from "@/components/listings/ListingsPageContent";
import { Card } from "@/components/ui/Card";

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell py-10">
          <Card className="p-8 text-center">
            <p className="text-sm font-medium text-slate-500">Loading listings...</p>
          </Card>
        </div>
      }
    >
      <ListingsPageContent />
    </Suspense>
  );
}
