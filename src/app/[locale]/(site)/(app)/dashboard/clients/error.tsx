"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorClients({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // log error si besoin
    // console.error(error);
  }, [error]);

  return (
    <div className="space-y-3 p-4">
      <h2 className="text-lg font-semibold">Une erreur est survenue</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={() => reset()}>Réessayer</Button>
    </div>
  );
}
