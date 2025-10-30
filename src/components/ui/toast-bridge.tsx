"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { push, type ToastKind } from "@/lib/toast";

export default function ToastBridge() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const type = sp.get("toast") as ToastKind | null;
    const msg = sp.get("msg");
    const duration = sp.get("dur");

    if (type && msg) {
      push({
        kind: type,
        message: decodeURIComponent(msg),
        duration: duration ? Number(duration) : undefined,
      });

      const clone = new URLSearchParams(sp.toString());
      clone.delete("toast");
      clone.delete("msg");
      clone.delete("dur");
      router.replace(`${pathname}?${clone.toString()}`);
    }
  }, [sp, pathname, router]);

  return null;
}
