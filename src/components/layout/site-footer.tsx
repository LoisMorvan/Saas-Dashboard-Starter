export default async function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 text-xs text-muted-foreground">
        <p>© {year}</p>
      </div>
    </footer>
  );
}
