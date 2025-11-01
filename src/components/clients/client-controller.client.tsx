"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ClientForm } from "@/components/clients/form/client-form";
import type { ClientWithAddress } from "@/types/clients";

export function ClientControllerClient({
  initialRows,
}: {
  initialRows: ClientWithAddress[];
}) {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [current, setCurrent] = React.useState<ClientWithAddress | null>(null);
  const router = useRouter();

  // Bouton "Nouveau client"
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest?.(
        "[data-action='open-create-client']"
      );
      if (!el) return;
      e.preventDefault();
      setMode("create");
      setCurrent(null);
      setOpen(true);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Event "clients:edit"
  React.useEffect(() => {
    function onEdit(ev: Event) {
      const id = (ev as CustomEvent).detail?.id as string | undefined;
      if (!id) return;
      const found = initialRows.find((r) => r.id === id) ?? null;
      setMode("edit");
      setCurrent(found);
      setOpen(true);
    }
    window.addEventListener("clients:edit", onEdit as EventListener);
    return () =>
      window.removeEventListener("clients:edit", onEdit as EventListener);
  }, [initialRows]);

  // Raccourci clavier : "n" pour nouveau
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.key.toLowerCase() === "n" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        setMode("create");
        setCurrent(null);
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ClientForm
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          // focus management : on pourrait rendre le focus au bouton d'origine si on le trackait.
        }
      }}
      mode={mode}
      initialClient={current}
      onSaved={() => {
        router.refresh();
      }}
    />
  );
}
