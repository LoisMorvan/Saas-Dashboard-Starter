"use client";

import { useTranslations } from "next-intl";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import type { ClientFormValues } from "./schema";
import { TFormMessage } from "@/components/ui/t-form-message";

export function AddressFields({
  control,
}: {
  control: Control<ClientFormValues>;
}) {
  const t = useTranslations("clients");

  return (
    <div className="md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        control={control}
        name="address.line1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("form.labels.address.line1")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={t("form.placeholders.address.line1")}
              />
            </FormControl>
            <TFormMessage name="address.line1" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address.line2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("form.labels.address.line2")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={t("form.placeholders.address.line2")}
              />
            </FormControl>
            <TFormMessage name="address.line2" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address.postal_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("form.labels.address.postal_code")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={t("form.placeholders.address.postal_code")}
              />
            </FormControl>
            <TFormMessage name="address.postal_code" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address.city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("form.labels.address.city")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={t("form.placeholders.address.city")}
              />
            </FormControl>
            <TFormMessage name="address.city" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address.region"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("form.labels.address.region")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={t("form.placeholders.address.region")}
              />
            </FormControl>
            <TFormMessage name="address.region" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address.country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("form.labels.address.country")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={t("form.placeholders.address.country")}
              />
            </FormControl>
            <TFormMessage name="address.country" />
          </FormItem>
        )}
      />
    </div>
  );
}
