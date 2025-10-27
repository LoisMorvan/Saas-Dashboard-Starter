"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type FlashKind = "success" | "error" | "warning" | "info";
export type FlashItem = {
  id: string;
  kind: FlashKind;
  message: string;
  duration?: number;
};

type Ctx = {
  items: FlashItem[];
  push: (item: Omit<FlashItem, "id">) => string;
  remove: (id: string) => void;
  clear: () => void;
};

const FlashCtx = createContext<Ctx | null>(null);

export function FlashProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FlashItem[]>([]);
  const idSeq = useRef(0);

  const api = useMemo<Ctx>(
    () => ({
      items,
      push: ({ kind, message, duration = 3500 }) => {
        const id = `f_${++idSeq.current}`;
        setItems((prev) => [...prev, { id, kind, message, duration }]);
        if (duration) {
          setTimeout(() => {
            setItems((prev) => prev.filter((x) => x.id !== id));
          }, duration);
        }
        return id;
      },
      remove: (id) => setItems((prev) => prev.filter((x) => x.id !== id)),
      clear: () => setItems([]),
    }),
    [items]
  );

  return <FlashCtx.Provider value={api}>{children}</FlashCtx.Provider>;
}

export function useFlash() {
  const ctx = useContext(FlashCtx);
  if (!ctx) throw new Error("useFlash must be used within <FlashProvider>");
  return ctx;
}

export function FlashViewport() {
  const { items, remove } = useFlash();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[1000] flex justify-center">
      <div className="flex max-w-[90vw] flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => remove(item.id)}
            className={cn(
              "pointer-events-auto mx-auto w-fit rounded-md border px-4 py-2 text-sm shadow transition-all duration-300",
              "animate-in fade-in zoom-in-95 data-[state=closed]:fade-out data-[state=closed]:zoom-out-95",
              item.kind === "success" &&
                "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200",
              item.kind === "error" &&
                "border-red-500/30 bg-red-500/10 text-red-900 dark:text-red-200",
              item.kind === "warning" &&
                "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
              item.kind === "info" &&
                "border-sky-500/30 bg-sky-500/10 text-sky-900 dark:text-sky-200"
            )}
          >
            {item.message}
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}
