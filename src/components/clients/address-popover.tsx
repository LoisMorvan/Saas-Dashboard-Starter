"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
  formatAddressShort,
  formatAddressFull,
  type ClientWithAddress,
  type AddressRow,
} from "@/types/clients";

type ClientWithAddressUnion = ClientWithAddress & {
  client_addresses?: AddressRow | null;
};

function extractAddress(c: ClientWithAddressUnion): AddressRow | null {
  if (c.client_addresses) return c.client_addresses;
  if (c.address) return c.address;
  return null;
}

export function AddressPopover({ client }: { client: ClientWithAddressUnion }) {
  const addr = extractAddress(client);
  const short = formatAddressShort(addr);
  const full = formatAddressFull(addr);

  if (!short) return <span className="text-muted-foreground">—</span>;

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
