"use server";

import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "node:crypto";

const AVATARS_BUCKET = "avatars";

export type ActionResult<T extends string = string> =
  | { ok: true }
  | { ok: true; url: string }
  | { ok: false; code: T };

export async function updateProfileAction(
  formData: FormData
): Promise<ActionResult<"generic">> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, code: "generic" };

    const full_name = String(formData.get("full_name") || "").trim();
    const email = String(formData.get("email") || "").trim();

    const data: Record<string, unknown> = {};
    if (full_name) data.full_name = full_name;

    const updates: Parameters<typeof supabase.auth.updateUser>[0] = { data };
    if (email && email !== user.email) updates.email = email;

    const { error } = await supabase.auth.updateUser(updates);
    if (error) return { ok: false, code: "generic" };

    return { ok: true };
  } catch {
    return { ok: false, code: "generic" };
  }
}

export async function updatePasswordAction(
  formData: FormData
): Promise<ActionResult<"password_mismatch" | "weak_password" | "generic">> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, code: "generic" };

    const password = String(formData.get("password") || "");
    const confirm = String(formData.get("password_confirm") || "");

    if (!password || password !== confirm)
      return { ok: false, code: "password_mismatch" };
    if (password.length < 6) return { ok: false, code: "weak_password" };

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { ok: false, code: "generic" };

    return { ok: true };
  } catch {
    return { ok: false, code: "generic" };
  }
}

export async function uploadAvatarAction(
  formData: FormData
): Promise<
  ActionResult<
    | "file_too_large"
    | "no_file"
    | "storage_upload_failed"
    | "profile_update_failed"
    | "generic"
  >
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, code: "generic" };

    const file = formData.get("avatar") as File | null;
    if (!file) return { ok: false, code: "no_file" };
    if (file.size > 2 * 1024 * 1024)
      return { ok: false, code: "file_too_large" };

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const key = `${user.id}/${randomUUID()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from(AVATARS_BUCKET)
      .upload(key, file, {
        upsert: false,
        contentType: file.type || "image/jpeg",
        cacheControl: "3600",
      });
    if (uploadErr) {
      return { ok: false, code: "storage_upload_failed" };
    }

    const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(key);
    const publicUrl = data.publicUrl;

    const { error: metaErr } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });
    if (metaErr) {
      return { ok: false, code: "profile_update_failed" };
    }

    return { ok: true, url: publicUrl };
  } catch {
    return { ok: false, code: "generic" };
  }
}
