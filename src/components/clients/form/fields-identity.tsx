"use client";

import { useTranslations } from "next-intl";
import { Controller, type Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import type { ClientFormValues } from "./schema";
import { TFormMessage } from "@/components/ui/t-form-message";

export function IdentityFields({
  control,
}: {
  control: Control<ClientFormValues>;
}) {
  const t = useTranslations("clients");

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="md:col-span-1">
            <FormLabel>{t("form.labels.name")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={t("form.placeholders.name")}
              />
            </FormControl>
            <TFormMessage name="name" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem className="md:col-span-1">
            <FormLabel>{t("form.labels.email")}</FormLabel>
            <FormControl>
              <Input
                type="email"
                {...field}
                value={field.value ?? ""}
                placeholder={t("form.placeholders.email")}
              />
            </FormControl>
            <TFormMessage name="email" />
          </FormItem>
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem className="md:col-span-1">
            <FormLabel>{t("form.labels.phone")}</FormLabel>
            <FormControl>
              <PhoneInput
                value={(field.value as string) ?? ""}
                onChange={field.onChange}
                placeholder={t("form.placeholders.phone")}
              />
            </FormControl>
            <TFormMessage name="phone" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem className="md:col-span-1">
            <FormLabel>{t("form.labels.company")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={t("form.placeholders.company")}
              />
            </FormControl>
            <TFormMessage name="company" />
          </FormItem>
        )}
      />
    </>
  );
}
