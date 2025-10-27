import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intl = createMiddleware(routing);

export default async function proxy(req: NextRequest) {
  const supaRes = await updateSession(req);
  const intlRes = intl(req);
  supaRes.cookies.getAll().forEach((c) => {
    intlRes.cookies.set(c);
  });

  return intlRes;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
