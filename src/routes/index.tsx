import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Shield, Cpu, Network, Fingerprint, Activity, Lock, ArrowUpRight,
  TrendingUp, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrustChain AI — Blockchain-backed Explainable Fraud Intelligence" },
      { name: "description", content: "Adaptive trust authentication and fraud intelligence platform for banking. Behavioral biometrics, graph fraud detection, and blockchain audit trails." },
      { property: "og:title", content: "TrustChain AI" },
      { property: "og:description", content: "Blockchain-backed Explainable Fraud Intelligence Platform" },
    ],
  }),
  component: Landing,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

function Marquee() {
  const items = [
    "BEHAVIORAL BIOMETRICS", "BLOCKCHAIN AUDIT", "GRAPH FRAUD INTEL",
    "EXPLAINABLE AI", "ADAPTIVE AUTH", "RISK SCORING", "ZERO-TRUST BANKING",
    "SHA-256 FINGERPRINTS", "TAMPER-PROOF LOGS",
  ];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border/60 py-4 bg-background/40">
      <div className="flex gap-10 animate-marquee whitespace-nowrap font-mono text-xs tracking-[0.25em] text-muted-foreground">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t}
            <span className="size-1.5 rounded-full bg-neon" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-36 pb-24">
      <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="chip mb-8">
          <span className="size-2 rounded-full bg-neon animate-pulse-soft" />
          LIVE · v3.2 · BANK-GRADE TRUST ENGINE
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="display text-[12vw] lg:text-[8.5rem]"
            >
              TrustChain<br />
              <span className="text-neon text-glow">AI.</span>
            </motion.h1>
            <motion.p {...fadeUp} transition={{ delay: 0.1, duration: 0.7 }} className="mt-8 max-w-xl text-lg text-muted-foreground">
              Blockchain-backed explainable fraud intelligence. We score every login in 80 ms — behavior, graph, and chain working as one signal.
            </motion.p>
            <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.7 }} className="mt-10 flex flex-wrap gap-3">
              <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-cream text-background px-6 py-3.5 text-sm font-medium hover:bg-neon transition-colors">
                Simulate a login <ArrowUpRight className="size-4" />
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium hover:border-neon transition-colors">
                View live dashboard
              </Link>
            </motion.div>
          </div>

          <motion.div {...fadeUp} transition={{ delay: 0.25, duration: 0.7 }} className="lg:col-span-4 surface p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="chip chip-neon">TRUST SCORE</span>
              <span className="font-mono text-xs text-muted-foreground">LIVE</span>
            </div>
            <div className="text-7xl font-semibold tracking-tight text-glow text-neon">82<span className="text-2xl text-muted-foreground">/100</span></div>
            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: "82%" }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full bg-neon" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60">
              {[
                { l: "Latency", v: "78ms" },
                { l: "Signals", v: "42" },
                { l: "Chain", v: "✓ OK" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
                  <div className="text-sm font-medium mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid lg:grid-cols-12 gap-10">
        <motion.div {...fadeUp} className="lg:col-span-4">
          <div className="chip mb-4">01 · PROBLEM</div>
          <h2 className="display text-5xl">Fraud is faster than your stack.</h2>
        </motion.div>
        <div className="lg:col-span-8 grid sm:grid-cols-2 gap-5">
          {[
            { k: "$485B", v: "lost globally to authorized fraud in 2025." },
            { k: "60%", v: "of fraud uses stolen-but-valid credentials." },
            { k: "<3 min", v: "average attacker dwell time before drain." },
            { k: "Opaque", v: "ML decisions banks cannot defend in court." },
          ].map((s, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.07 }} className="surface surface-hover p-6">
              <div className="text-4xl font-semibold tracking-tight text-neon">{s.k}</div>
              <p className="mt-3 text-sm text-muted-foreground">{s.v}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  const layers = [
    { icon: Fingerprint, name: "Capture", desc: "Typing, device, location, IP, browser fingerprint." },
    { icon: Lock, name: "Blockchain", desc: "SHA-256 behavior hash + immutable audit trail." },
    { icon: Cpu, name: "AI Risk Engine", desc: "Graph fraud + anomaly model fused into one score." },
    { icon: Activity, name: "Explainable AI", desc: "Human-readable reasons behind every decision." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.div {...fadeUp} className="flex items-end justify-between flex-wrap gap-4 mb-12">
        <div>
          <div className="chip mb-4">02 · SOLUTION ARCHITECTURE</div>
          <h2 className="display text-5xl max-w-2xl">Four layers. One verdict in under 100 ms.</h2>
        </div>
        <Link to="/workflow" className="text-sm text-muted-foreground hover:text-neon inline-flex items-center gap-2">
          See workflow <ArrowUpRight className="size-4" />
        </Link>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {layers.map((l, i) => (
          <motion.div key={l.name} {...fadeUp} transition={{ delay: i * 0.08 }} className="surface surface-hover p-6 group">
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-xl bg-secondary grid place-items-center text-neon group-hover:bg-neon group-hover:text-background transition-colors">
                <l.icon className="size-5" />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest">L0{i + 1}</span>
            </div>
            <div className="mt-6 text-xl font-medium">{l.name}</div>
            <p className="text-sm text-muted-foreground mt-2">{l.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Fingerprint, t: "Behavioral Biometrics", d: "Continuous identity from typing rhythm, mouse dynamics & device posture." },
    { icon: Network, t: "Graph Fraud Intelligence", d: "Expose hidden mule networks across devices, IPs and accounts." },
    { icon: Lock, t: "Blockchain Integrity", d: "Tamper-proof audit trail. Every score hashed on-chain." },
    { icon: Cpu, t: "Explainable AI", d: "Every decision returns the top human-readable reasons." },
    { icon: Shield, t: "Adaptive Authentication", d: "Step-up only when risk spikes. Friction where it matters." },
    { icon: Activity, t: "Risk Analysis Model", d: "Ensemble model fusing 200+ signals into a 0–100 trust score." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.div {...fadeUp} className="mb-12">
        <div className="chip mb-4">03 · KEY FEATURES</div>
        <h2 className="display text-5xl max-w-3xl">Everything your fraud team wished the core could do.</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <motion.div key={it.t} {...fadeUp} transition={{ delay: i * 0.05 }} className="surface surface-hover p-7 group">
            <it.icon className="size-6 text-neon" />
            <div className="mt-6 text-xl font-medium">{it.t}</div>
            <p className="text-sm text-muted-foreground mt-2">{it.d}</p>
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground">
              <span>Module · 0{i + 1}</span>
              <ArrowUpRight className="size-4 group-hover:text-neon transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Impact() {
  const stats = [
    { k: "99.2%", v: "Fraud catch rate", icon: Shield },
    { k: "↓ 73%", v: "False positives", icon: TrendingUp },
    { k: "80 ms", v: "Decision latency", icon: Activity },
    { k: "100%", v: "Auditable on-chain", icon: CheckCircle2 },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.div {...fadeUp} className="mb-12">
        <div className="chip mb-4">04 · IMPACT</div>
        <h2 className="display text-5xl">Numbers a CFO will sign off on.</h2>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-border/60">
        {stats.map((s, i) => (
          <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.07 }}
            className="border-b lg:border-r border-border/60 p-8 hover:bg-secondary/40 transition-colors">
            <s.icon className="size-5 text-neon" />
            <div className="mt-6 text-5xl font-semibold tracking-tight">{s.k}</div>
            <div className="text-sm text-muted-foreground mt-2">{s.v}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.div {...fadeUp} className="mb-10 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="chip mb-4">05 · DASHBOARD</div>
          <h2 className="display text-5xl max-w-2xl">One pane of glass for fraud ops.</h2>
        </div>
        <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-cream text-background px-5 py-3 text-sm font-medium hover:bg-neon transition-colors">
          Open dashboard <ArrowUpRight className="size-4" />
        </Link>
      </motion.div>
      <motion.div {...fadeUp} className="surface p-2">
        <div className="rounded-xl bg-background/60 border border-border/60 p-6 grid lg:grid-cols-3 gap-5">
          <div className="surface p-5">
            <div className="chip chip-neon mb-4">TRUST SCORE</div>
            <div className="text-6xl font-semibold text-neon">82</div>
            <p className="text-sm text-muted-foreground mt-2">Safe · access granted</p>
          </div>
          <div className="surface p-5">
            <div className="chip mb-4">RISK FACTORS</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><AlertTriangle className="size-4 text-warn" />New device detected</li>
              <li className="flex items-center gap-2"><AlertTriangle className="size-4 text-warn" />Typing speed anomaly</li>
              <li className="flex items-center gap-2"><AlertTriangle className="size-4 text-danger" />VPN detected</li>
            </ul>
          </div>
          <div className="surface p-5">
            <div className="chip mb-4">BLOCKCHAIN</div>
            <div className="font-mono text-xs text-muted-foreground break-all">A83F91BC7D9E2A11FF03 552BE7AA001D8E6F</div>
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-neon"><CheckCircle2 className="size-4" />IMMUTABLE VERIFIED</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.div {...fadeUp} className="surface p-12 lg:p-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-50" />
        <div className="relative">
          <div className="chip mb-6">GET STARTED</div>
          <h2 className="display text-6xl lg:text-7xl max-w-3xl">
            Ship trust like it's <span className="text-neon">money.</span>
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-cream text-background px-6 py-3.5 text-sm font-medium hover:bg-neon transition-colors">
              Try the simulator <ArrowUpRight className="size-4" />
            </Link>
            <Link to="/features" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium hover:border-neon transition-colors">
              Explore features
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Landing() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <Hero />
      <Marquee />
      <Problem />
      <Architecture />
      <Features />
      <DashboardPreview />
      <Impact />
      <CTA />
      <SiteFooter />
    </main>
  );
}
