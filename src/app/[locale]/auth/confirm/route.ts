import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

function sanitizeNext(next: string | null): string {
  if (!next) return "/";
  try {
    const url = new URL(next, "http://localhost");
    if (/^https?:\/\//i.test(next)) return "/";
    return url.pathname + url.search;
  } catch {
    return "/";
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { locale: string } }
) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextRaw = searchParams.get("next");
  const nextSafe = sanitizeNext(nextRaw);

  const locale = context.params?.locale;
  const prefix = locale === "fr" ? "" : `/${locale}`;

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      redirect(`${prefix}${nextSafe}`);
    } else {
      redirect(
        `${prefix}/auth/error?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  redirect(
    `${prefix}/auth/error?error=${encodeURIComponent("No token hash or type")}`
  );
}
