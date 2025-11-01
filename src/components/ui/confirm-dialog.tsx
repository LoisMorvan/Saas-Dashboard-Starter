"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type Options = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  confirmVariant?: React.ComponentProps<typeof Button>["variant"];
};

type ConfirmFn = (opts?: Options) => Promise<boolean>;

const ConfirmDialogContext = React.createContext<ConfirmFn | null>(null);

export function ConfirmDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const resolverRef = React.useRef<((v: boolean) => void) | null>(null);
  const [opts, setOpts] = React.useState<Options | undefined>(undefined);

  const confirm = React.useCallback<ConfirmFn>((options) => {
    setOpts(options);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const onCancel = () => {
    setOpen(false);
    resolverRef.current?.(false);
  };
  const onConfirm = () => {
    setOpen(false);
    resolverRef.current?.(true);
  };

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {opts?.title ?? "Êtes-vous sûr ?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {opts?.description ?? "Cette action est irréversible."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel onClick={onCancel}>
              {opts?.cancelText ?? "Annuler"}
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={onConfirm}
                variant={opts?.confirmVariant ?? "destructive"}
              >
                {opts?.confirmText ?? "Confirmer"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = React.useContext(ConfirmDialogContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within <ConfirmDialogProvider>");
  }
  return ctx;
}
