"use client";

import { useState, useEffect } from "react";
import ClientSideNav from "./sidebar.client";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "0.0.0";

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir la navigation"
        className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded hover:bg-accent"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="fixed left-0 top-0 z-50 h-full w-72 bg-background shadow-lg p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-14 border-b flex items-center px-3">
              <span className="text-sm font-medium">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded hover:bg-accent"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="h-[calc(100%-56px)] overflow-y-auto">
              <ClientSideNav version={version} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
