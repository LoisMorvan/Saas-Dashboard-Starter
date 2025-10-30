"use client";

import { toast as sonnerToast, type ExternalToast } from "sonner";

export type ToastKind = "success" | "error" | "warning" | "info" | "loading";

export type ToastItem = {
  id?: string | number;
  kind: ToastKind;
  message: string;
  duration?: number;
} & Pick<ExternalToast, "description" | "action" | "cancel">;

function fnFor(kind: ToastKind) {
  switch (kind) {
    case "success":
      return sonnerToast.success;
    case "error":
      return sonnerToast.error;
    case "warning":
      return sonnerToast.warning;
    case "info":
      return sonnerToast.info;
    case "loading":
      return sonnerToast.loading;
    default:
      return sonnerToast;
  }
}

export function push({
  kind,
  message,
  duration = 3500,
  description,
  action,
  cancel,
}: ToastItem) {
  const show = fnFor(kind);
  return show(message, { duration, description, action, cancel });
}

export function remove(id: string | number) {
  sonnerToast.dismiss(id);
}

export function clear() {
  sonnerToast.dismiss();
}

export const toast = {
  success: (message: string, opts?: ExternalToast) =>
    sonnerToast.success(message, opts),
  error: (message: string, opts?: ExternalToast) =>
    sonnerToast.error(message, opts),
  info: (message: string, opts?: ExternalToast) =>
    sonnerToast.info(message, opts),
  warning: (message: string, opts?: ExternalToast) =>
    sonnerToast.warning(message, opts),
  loading: (message: string, opts?: ExternalToast) =>
    sonnerToast.loading(message, opts),
  dismiss: sonnerToast.dismiss,
};
