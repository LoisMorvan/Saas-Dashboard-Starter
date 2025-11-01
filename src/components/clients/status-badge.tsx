"use client";

import { Badge } from "@/components/ui/badge";
import type { ClientWithAddress } from "@/types/clients";

export function StatusBadge({
  status,
}: {
  status: ClientWithAddress["status"];
}) {
  const variant =
    status === "actif"
      ? "default"
      : status === "prospect"
      ? "secondary"
      : "outline";

  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}
