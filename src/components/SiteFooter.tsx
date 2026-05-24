export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-32">
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-2xl font-semibold tracking-tight">TrustChain AI</div>
          <p className="text-sm text-muted-foreground mt-1">Blockchain-backed explainable fraud intelligence for banking.</p>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          © 2026 · Built for bank-grade trust
        </div>
      </div>
    </footer>
  );
}
