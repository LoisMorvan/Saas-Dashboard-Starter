"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "@/lib/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { ClientWithAddress, ClientInput } from "@/types/clients";
import { clientFormSchema, type ClientFormValues } from "./schema";
import { makeDefaultValues } from "./defaults";
import { IdentityFields } from "./fields-identity";
import { AddressFields } from "./fields-address";
import { MetaFields } from "./fields-meta";
import {
  createClientAction,
  updateClientAction,
} from "@/app/[locale]/(site)/(app)/dashboard/clients/actions";
import { useIsMobile } from "@/hooks/use-mobile";

export type ClientFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialClient?: ClientWithAddress | null;
  onSaved?: (clientId?: string) => void;
};

export function ClientForm({
  open,
  onOpenChange,
  mode,
  initialClient,
  onSaved,
}: ClientFormProps) {
  const isMobile = useIsMobile();
  const t = useTranslations("clients");

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: makeDefaultValues(initialClient),
    mode: "onBlur",
  });

  React.useEffect(() => {
    form.reset(makeDefaultValues(initialClient));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialClient?.id, open]);

  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(values: ClientFormValues) {
    setSubmitting(true);
    try {
      const payload: ClientInput = {
        name: values.name.trim(),
        email: values.email?.trim() || null,
        phone: values.phone?.trim() || null,
        company: values.company?.trim() || null,
        notes: values.notes?.trim() || null,
        status: values.status,
        address: values.address
          ? {
              line1: values.address.line1?.trim() || "",
              line2: values.address.line2?.trim() || null,
              postal_code: values.address.postal_code?.trim() || null,
              city: values.address.city?.trim() || null,
              region: values.address.region?.trim() || null,
              country: values.address.country?.trim() || null,
            }
          : undefined,
      };

      if (mode === "create") {
        const res = await createClientAction(payload);
        if (!res.ok) {
          if (res.code === "emailUnique") {
            form.setError("email", {
              type: "manual",
              message: t("form.errors.emailUnique"),
            });
          } else {
            toast.error(res.message ?? t("form.toast.createError"));
          }
          return;
        }
        toast.success(t("form.toast.createSuccess"));
        onOpenChange(false);
        onSaved?.(res.client?.id as string | undefined);
        form.reset(makeDefaultValues(undefined));
      } else {
        if (!initialClient) return;
        const res = await updateClientAction(initialClient.id, payload);
        if (!res.ok) {
          if (res.code === "emailUnique") {
            form.setError("email", {
              type: "manual",
              message: t("form.errors.emailUnique"),
            });
          } else {
            toast.error(res.message ?? t("form.toast.updateError"));
          }
          return;
        }
        toast.success(t("form.toast.updateSuccess"));
        onOpenChange(false);
        onSaved?.(res.client?.id as string | undefined);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const submit = React.useMemo(
    () => form.handleSubmit(onSubmit),
    [form, onSubmit]
  );

  const title =
    mode === "create" ? t("form.titles.create") : t("form.titles.edit");
  const description =
    mode === "create" ? t("form.desc.create") : t("form.desc.edit");

  const Content = (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <IdentityFields control={form.control} />
          <MetaFields control={form.control} />
          <AddressFields control={form.control} />

          <button type="submit" className="hidden" disabled={submitting} />
        </form>
      </Form>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {t("form.cancel")}
        </Button>
        <Button onClick={submit} disabled={submitting}>
          {mode === "create" ? t("form.createCta") : t("form.saveCta")}
        </Button>
      </div>
    </div>
  );

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {Content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4">{Content}</div>

        <DrawerFooter className="grid grid-cols-2 gap-2">
          <Button variant="outline" asChild>
            <DrawerClose>{t("form.cancel")}</DrawerClose>
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {mode === "create" ? t("form.createCta") : t("form.saveCta")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
