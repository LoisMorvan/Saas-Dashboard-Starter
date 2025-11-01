"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { deleteClientAction } from "@/app/[locale]/(site)/(app)/dashboard/clients/actions";

export function RowActions({ id }: { id: string }) {
  const t = useTranslations("clients");
  const confirm = useConfirm();
  const router = useRouter();

  const onEdit = React.useCallback(() => {
    window.dispatchEvent(new CustomEvent("clients:edit", { detail: { id } }));
  }, [id]);

  const onDelete = React.useCallback(async () => {
    const ok = await confirm({
      title: t("confirm.delete.title"),
      description: t("confirm.delete.description"),
      confirmText: t("confirm.delete.confirm"),
      cancelText: t("confirm.delete.cancel"),
      confirmVariant: "destructive",
    });
    if (!ok) return;

    const res = await deleteClientAction(id);
    if (!res.ok) {
      toast.error(res.message ?? t("form.toast.updateError"));
      return;
    }
    toast.success(t("delete.success"));
    router.refresh();
  }, [confirm, id, router, t]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">{t("rowActions.open")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("rowActions.title")}</DropdownMenuLabel>

        <button
          className="block w-full cursor-pointer px-2 py-1.5 text-left text-sm hover:underline"
          type="button"
          onClick={onEdit}
        >
          {t("rowActions.edit")}
        </button>

        <Separator className="my-1" />

        <button
          className="block w-full cursor-pointer px-2 py-1.5 text-left text-sm text-destructive hover:underline"
          type="button"
          onClick={onDelete}
        >
          {t("rowActions.delete")}
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
