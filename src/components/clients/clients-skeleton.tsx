"use client";

import { Card } from "@/components/ui/card";

export function ClientsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="h-9 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-40 animate-pulse rounded-md bg-muted" />
        <div className="ml-auto h-9 w-36 animate-pulse rounded-md bg-muted" />
      </div>

      <Card className="overflow-hidden">
        <div className="border-b p-3">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-7 gap-3 p-3">
              {Array.from({ length: 7 }).map((__, j) => (
                <div
                  key={j}
                  className="h-4 w-full animate-pulse rounded bg-muted"
                />
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
