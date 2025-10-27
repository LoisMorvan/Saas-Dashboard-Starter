"use client";
import { FlashProvider, FlashViewport } from "@/components/ui/flash";

export default function FlashRoot({ children }: { children: React.ReactNode }) {
  return (
    <FlashProvider>
      {children}
      <FlashViewport />
    </FlashProvider>
  );
}
