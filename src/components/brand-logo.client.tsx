"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  width?: number;
  height?: number;
  className?: string;
  title?: string;
};

export default function BrandLogoClient({
  href = "/",
  width = 140,
  height = 40,
  className,
  title = "Home",
}: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src = !mounted
    ? "/logo-light.svg"
    : resolvedTheme === "dark"
    ? "/logo-dark.svg"
    : "/logo-light.svg";

  const img = (
    <Image
      src={src}
      alt="Logo"
      width={width}
      height={height}
      priority
      className={cn("inline-block", className)}
    />
  );

  return href ? (
    <Link href={href} title={title} aria-label={title} className="inline-flex">
      {img}
    </Link>
  ) : (
    <span className="inline-flex" title={title} aria-label={title}>
      {img}
    </span>
  );
}
