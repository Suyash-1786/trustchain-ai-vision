import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/auth", label: "Authenticate" },
  { to: "/workflow", label: "Workflow" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/analytics", label: "Analytics" },
  { to: "/features", label: "Features" },
];

export function SiteHeader() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1240px,calc(100%-2rem))]">
      <div className="pill-nav flex items-center justify-between gap-4 px-3 py-2">
        <Link to="/" className="flex items-center gap-2 pl-3 pr-2">
          <div className="size-7 rounded-md bg-neon grid place-items-center text-background">
            <Shield className="size-4" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">TrustChain AI</div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Fraud · Intelligence</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-background/40 border border-border/60">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3.5 py-1.5 text-sm rounded-full text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "px-3.5 py-1.5 text-sm rounded-full bg-secondary text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/auth"
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-cream text-background px-4 py-2 text-sm font-medium hover:bg-neon transition-colors"
        >
          Evaluate Trust <span aria-hidden>↗</span>
        </Link>
      </div>
    </header>
  );
}
