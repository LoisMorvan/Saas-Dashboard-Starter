"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useFlash } from "@/components/ui/flash";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { uploadAvatarAction } from "@/app/[locale]/(site)/(app)/profile/actions";
import { cn } from "@/lib/utils";

export default function AvatarForm({ avatarUrl }: { avatarUrl: string }) {
  const [pending, start] = useTransition();
  const t = useTranslations("profile.avatar");
  const { push } = useFlash();

  const [preview, setPreview] = useState<string>(avatarUrl || "/favicon.svg");
  const objectUrlRef = useRef<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        start(async () => {
          const res = await uploadAvatarAction(fd);

          if (res.ok) {
            if ("url" in res && typeof res.url === "string") {
              setPreview(res.url);
            }
            push({ kind: "success", message: t("upload") });
          } else {
            const msg =
              res.code === "file_too_large"
                ? t("errors.fileTooLarge")
                : res.code === "no_file"
                ? t("errors.noFile")
                : res.code === "storage_upload_failed"
                ? t("errors.uploadFailed")
                : res.code === "profile_update_failed"
                ? t("errors.profileUpdateFailed")
                : t("errors.generic");
            setError(msg);
          }
        });
      }}
      encType="multipart/form-data"
    >
      <CardContent className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          alt="avatar"
          className={cn(
            "h-16 w-16 rounded-full object-cover border",
            error && "ring-2 ring-red-500"
          )}
        />

        <div className="space-y-2">
          <Input
            type="file"
            name="avatar"
            accept="image/png,image/jpeg,image/webp"
            required
            onChange={(e) => {
              setError(null);
              const file = e.target.files?.[0];
              if (!file) return;

              if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
              }
              const url = URL.createObjectURL(file);
              objectUrlRef.current = url;
              setPreview(url);
            }}
            aria-invalid={!!error}
            className={cn(
              !!error && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          <p className="text-[11px] text-muted-foreground">{t("hint")}</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Button disabled={pending} type="submit" variant="outline">
          {t("upload")}
        </Button>
      </CardFooter>
    </form>
  );
}
