"use client";

import { useFormContext, useFormState } from "react-hook-form";
import { useTranslations } from "next-intl";

export function TFormMessage({ name }: { name: string }) {
  const { control } = useFormContext();
  const { errors } = useFormState({ control, name });
  const t = useTranslations();

  // @ts-expect-error — react-hook-form type any for deep fields
  const message: string | undefined = errors?.[name]?.message;

  if (!message) return null;

  const isKey = typeof message === "string" && message.includes(".");
  const text = isKey ? t(message as any) : message;

  return <p className="text-[0.8rem] font-medium text-destructive">{text}</p>;
}
