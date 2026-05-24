import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Fingerprint, Lock, Cpu, Network, Activity, ShieldCheck, ShieldAlert, ShieldOff,
  Code2, Brain, Database, Cloud,
} from "lucide-react";

export const Route = createFileRoute("/workflow")({
  head: () => ({
    meta: [
      { title: "Workflow — TrustChain AI" },
      { name: "description", content: "Interactive architecture: capture, blockchain, AI risk, explainability, and adaptive verdict." },
    ],
  }),
  component: Workflow,
});

type Layer = {
  id: string; title: string; sub: string;
  icon: React.ComponentType<{ className?: string }>;
  branches?: { label: string; icon: React.ComponentType<{ className?: string }> }[];
  verdicts?: { label: string; tone: "ok" | "warn" | "bad"; icon: React.ComponentType<{ className?: string }> }[];
};

const layers: Layer[] = [
  { id: "L1", title: "User Login", sub: "Username · password · device · IP", icon: Fingerprint },
  { id: "L2", title: "Behavior Capture", sub: "Typing rhythm · device · location · IP", icon: Activity },
  { id: "L3", title: "Blockchain Verification Layer", sub: "SHA-256 behavior hash · immutable audit · tamper-proof logs", icon: Lock },
  {
    id: "L4", title: "AI Risk Engine", sub: "Two parallel models fuse into one decision", icon: Cpu,
    branches: [
      { label: "Graph Fraud Intelligence", icon: Network },
      { label: "Risk Analysis Model", icon: Activity },
    ],
  },
  { id: "L5", title: "Trust Score Generated", sub: "0 — 100", icon: ShieldCheck },
  { id: "L6", title: "Explainable AI Engine", sub: "Top reasons in human language", icon: Cpu },
  {
    id: "L7", title: "Adaptive Verdict", sub: "Routed by score band", icon: ShieldCheck,
    verdicts: [
      { label: "80–100 · Safe · Access Granted", tone: "ok", icon: ShieldCheck },
      { label: "50–79 · Suspicious · Step-up", tone: "warn", icon: ShieldAlert },
      { label: "0–49 · High Risk · Alert + Block", tone: "bad", icon: ShieldOff },
    ],
  },
];

function Connector({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex justify-center my-2">
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        style={{ transformOrigin: "top" }}
        className="w-px h-12 bg-gradient-to-b from-neon to-transparent"
      />
    </div>
  );
}

function LayerCard({ layer, i }: { layer: Layer; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="surface surface-hover p-6 max-w-2xl mx-auto w-full"
    >
      <div className="flex items-start gap-4">
        <div className="size-11 rounded-xl bg-secondary grid place-items-center text-neon shrink-0">
          <layer.icon className="size-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-medium">{layer.title}</h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{layer.id}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{layer.sub}</p>

          {layer.branches && (
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              {layer.branches.map((b) => (
                <div key={b.label} className="rounded-xl border border-border bg-background/40 p-4 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-secondary grid place-items-center text-neon">
                    <b.icon className="size-4" />
                  </div>
                  <span className="text-sm">{b.label}</span>
                </div>
              ))}
            </div>
          )}

          {layer.verdicts && (
            <div className="grid sm:grid-cols-3 gap-3 mt-5">
              {layer.verdicts.map((v) => {
                const tone =
                  v.tone === "ok" ? "text-neon border-neon/40"
                  : v.tone === "warn" ? "text-warn border-warn/40"
                  : "text-danger border-danger/40";
                return (
                  <div key={v.label} className={`rounded-xl border bg-background/40 p-4 ${tone}`}>
                    <v.icon className="size-5" />
                    <div className="text-xs mt-3 leading-snug">{v.label}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Workflow() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="relative pt-32 pb-24">
        <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="chip mb-5 mx-auto">ARCHITECTURE</div>
            <h1 className="display text-6xl">From keystroke to <span className="text-neon">verdict.</span></h1>
            <p className="text-muted-foreground mt-5 max-w-xl mx-auto">
              Watch a login traverse seven layers — each verifiable, each explainable.
            </p>
          </div>

          {layers.map((l, i) => (
            <div key={l.id}>
              <LayerCard layer={l} i={i} />
              {i < layers.length - 1 && <Connector delay={i * 0.08 + 0.2} />}
            </div>
          ))}

          <TechStack />
        </div>
      </section>
    </main>
  );
}

const stackGroups = [
  {
    icon: Code2,
    title: "Frontend",
    tag: "UI · UX",
    items: [
      { k: "React + TypeScript", d: "Typed component model for an enterprise fintech UI." },
      { k: "TailwindCSS", d: "Design-token driven styling with dark fintech theme." },
      { k: "Framer Motion", d: "Smooth, premium micro-interactions." },
      { k: "Recharts", d: "Trust trends, fraud attempts, distributions." },
      { k: "React Flow", d: "Graph fraud intelligence — nodes, edges, mule networks." },
    ],
  },
  {
    icon: Brain,
    title: "AI / Risk Engine",
    tag: "Intelligence",
    items: [
      { k: "Python · FastAPI", d: "Low-latency risk scoring API (<100ms)." },
      { k: "scikit-learn / XGBoost", d: "Anomaly + ensemble model for the trust score." },
      { k: "NetworkX / Neo4j", d: "Graph fraud intelligence across users, IPs, devices." },
      { k: "SHAP", d: "Explainable AI — human-readable reasons per decision." },
    ],
  },
  {
    icon: Database,
    title: "Blockchain & Backend",
    tag: "Trust Layer",
    items: [
      { k: "Node.js + Express", d: "Auth orchestration & evaluation API." },
      { k: "SHA-256 (crypto)", d: "Behavior hashing for tamper-proof audit records." },
      { k: "Ethereum / Polygon (Solidity)", d: "Immutable audit trail anchored on-chain." },
      { k: "PostgreSQL + Redis", d: "Session store, hot risk cache, evaluations." },
    ],
  },
  {
    icon: Cloud,
    title: "DevOps & Security",
    tag: "Platform",
    items: [
      { k: "Docker · Kubernetes", d: "Containerized, horizontally scalable services." },
      { k: "GitHub Actions", d: "CI/CD with automated test + lint gates." },
      { k: "JWT + OAuth2", d: "Bank-grade session and access control." },
      { k: "Cloudflare / AWS", d: "Edge protection, WAF, KMS for secrets." },
    ],
  },
];

function TechStack() {
  return (
    <div className="mt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="chip mb-5 mx-auto">MVP TECH STACK</div>
        <h2 className="display text-5xl">Stack we'll ship the <span className="text-neon">prototype</span> on.</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Modern, open-source, production-grade — chosen to be hackathon-fast and bank-credible.
        </p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-5">
        {stackGroups.map((g, gi) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: gi * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="surface surface-hover p-7"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-secondary grid place-items-center text-neon">
                  <g.icon className="size-5" />
                </div>
                <div className="text-xl font-medium">{g.title}</div>
              </div>
              <span className="chip">{g.tag}</span>
            </div>
            <ul className="space-y-4">
              {g.items.map((it) => (
                <li key={it.k} className="flex items-start gap-3">
                  <span className="mt-2 size-1.5 rounded-full bg-neon shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{it.k}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{it.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
