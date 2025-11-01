"use client";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import type { ClientWithAddress } from "@/types/clients";
import { formatAddressShort, formatAddressFull } from "@/types/clients";

export function ClientStatusBadge({
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

export function AddressPopoverCell({ client }: { client: ClientWithAddress }) {
  const short = formatAddressShort(
    // @ts-expect-error narrow supabase union
    client.client_addresses ?? client.address ?? null
  );
  const full = formatAddressFull(
    // @ts-expect-error narrow supabase union
    client.client_addresses ?? client.address ?? null
  );

  if (!short) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" className="p-0 h-auto font-normal">
          <span className="truncate max-w-[220px] inline-block align-middle">
            {short}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 whitespace-pre-line">
        <div className="flex items-start gap-2">
          <MapPin className="mt-1 size-4 text-muted-foreground" />
          <pre className="text-sm leading-5">{full}</pre>
        </div>
      </PopoverContent>
    </Popover>
  );
}
