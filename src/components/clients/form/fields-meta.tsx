"use client";

import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import type { Control } from "react-hook-form";
import type { ClientFormValues } from "./schema";
import { TFormMessage } from "@/components/ui/t-form-message";

export function MetaFields({
  control,
}: {
  control: Control<ClientFormValues>;
}) {
  const t = useTranslations("clients");

  return (
    <>
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem className="md:col-span-1">
            <FormLabel>{t("form.labels.status")}</FormLabel>
            <FormControl>
              <select
                {...field}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="prospect">{t("status.prospect")}</option>
                <option value="actif">{t("status.actif")}</option>
                <option value="inactif">{t("status.inactif")}</option>
              </select>
            </FormControl>
            <TFormMessage name="status" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>{t("form.labels.notes")}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ""}
                rows={4}
                placeholder={t("form.placeholders.notes")}
              />
            </FormControl>
            <TFormMessage name="notes" />
          </FormItem>
        )}
      />
    </>
  );
}
