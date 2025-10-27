import BrandLogo from "@/components/brand-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <BrandLogo width={128} height={36} className="select-none" />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
